import { SafeV0 } from '@zeal/domains/KeyStore'
import { generateSecretPhraseAddressOnPath } from '@zeal/domains/KeyStore/helpers/generateSecretPhraseAddress'
import { Network } from '@zeal/domains/Network'
import { EthSignTypedDataV4 } from '@zeal/domains/RPCRequest'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { _TypedDataEncoder } from 'ethers/lib/utils'
import { hashMessage } from '@ethersproject/hash'

type TypedDataDomain = {
    name?: string
    version?: string
    chainId?: string | number | bigint | undefined
    verifyingContract?: string
    salt?: ArrayLike<number> | string
}

type TypedDataTypes = {
    name: string
    type: string
}

type TypedMessageTypes = {
    [key: string]: TypedDataTypes[]
}

type EIP712TypedData = {
    domain: TypedDataDomain
    types: TypedMessageTypes
    message: Record<string, unknown>
}

type EIP712Normalized = EIP712TypedData & { primaryType: string }

const hashTypedData = (typedData: EIP712TypedData): string => {
    // `ethers` doesn't require `EIP712Domain` and otherwise throws
    const { EIP712Domain: _, ...types } = typedData.types
    return _TypedDataEncoder.hash(
        typedData.domain as TypedDataDomain,
        types,
        typedData.message
    )
}

const normalizeTypedData = (typedData: EIP712TypedData): EIP712Normalized => {
    const { EIP712Domain: _, ...types } = typedData.types
    return _TypedDataEncoder.getPayload(
        typedData.domain as TypedDataDomain,
        types,
        typedData.message
    )
}

const generateSafeMessageMessage = (message: string | object): string => {
    return typeof message === 'string'
        ? hashMessage(message) // TODO @resetko-zeal this is for nontyped messages
        : hashTypedData(message as EIP712TypedData)
}

export const signMessageToSafeSignTypedDataV4 = async ({
    request,
    network,
    keyStore,
    sessionPassword,
}: {
    request: EthSignTypedDataV4
    network: Network
    keyStore: SafeV0
    sessionPassword: string
}): Promise<EthSignTypedDataV4> => {
    const message = JSON.parse(request.params[1])

    const ownerKeyStore = keyStore.safeDeplymentConfig.ownerKeyStore
    const { address: ownerAddress } = await generateSecretPhraseAddressOnPath({
        encryptedPhrase: ownerKeyStore.encryptedPhrase,
        path: ownerKeyStore.bip44Path,
        sessionPassword,
    })

    const safeMessage = {
        domain: {
            chainId: BigInt(network.hexChainId).toString(10),
            verifyingContract: keyStore.address,
        },
        types: {
            SafeMessage: [{ name: 'message', type: 'bytes' }],
        },
        message: {
            message: generateSafeMessageMessage(message),
        },
    }

    const normalized = normalizeTypedData(safeMessage)

    return {
        id: generateRandomNumber(),
        jsonrpc: '2.0',
        method: 'eth_signTypedData_v4',
        params: [ownerAddress, JSON.stringify(normalized)],
    }
}
