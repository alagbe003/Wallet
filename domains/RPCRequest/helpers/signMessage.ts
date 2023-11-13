import { toBuffer } from '@ethereumjs/util'
import Eth from '@ledgerhq/hw-app-eth'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import * as sigUtil from '@metamask/eth-sig-util'
import { signTypedData } from '@metamask/eth-sig-util'
import TrezorConnect from '@trezor/connect-web'
import Web3 from 'web3'

import { signMessageToSafeSignTypedDataV4 } from '@zeal/domains/Account/helpers/signMessageToSafeSignTypedDataV4'
import { ImperativeError } from '@zeal/domains/Error'
import { parseTrezorConnectionAlreadyInitialized } from '@zeal/domains/Error/domains/Trezor/parsers/parseTrezorError'
import { SigningKeyStore } from '@zeal/domains/KeyStore'
import { TERZOR_INIT_CONFIG } from '@zeal/domains/KeyStore/constants'
import { getPrivateKey } from '@zeal/domains/KeyStore/helpers/getPrivateKey'
import { Network } from '@zeal/domains/Network'
import {
    EthSignTypedData,
    EthSignTypedDataV3,
    EthSignTypedDataV4,
    PersonalSign,
} from '@zeal/domains/RPCRequest'
import { notReachable } from '@zeal/toolkit'

type Params = {
    request:
        | PersonalSign
        | EthSignTypedDataV4
        | EthSignTypedData
        | EthSignTypedDataV3
    keyStore: SigningKeyStore
    sessionPassword: string
    network: Network
}

export const signMessage = async ({
    request,
    sessionPassword,
    keyStore,
    network,
}: Params): Promise<string> => {
    switch (keyStore.type) {
        case 'safe_v0': {
            const { pk } = await getPrivateKey({
                keyStore: keyStore.safeDeplymentConfig.ownerKeyStore,
                sessionPassword,
            })

            switch (request.method) {
                case 'personal_sign':
                case 'eth_signTypedData':
                case 'eth_signTypedData_v3':
                    throw new Error('Not implemented')

                case 'eth_signTypedData_v4': {
                    const safeMessage = await signMessageToSafeSignTypedDataV4({
                        keyStore,
                        request,
                        network,
                        sessionPassword,
                    })

                    const data = JSON.parse(safeMessage.params[1])
                    return signTypedData({
                        privateKey: toBuffer(pk),
                        data,
                        version: sigUtil.SignTypedDataVersion.V4,
                    })
                }

                /* istanbul ignore next */
                default:
                    return notReachable(request)
            }
        }

        case 'secret_phrase_key':
        case 'private_key_store':
            const { pk } = await getPrivateKey({ keyStore, sessionPassword })
            const web3 = new Web3()
            switch (request.method) {
                case 'personal_sign':
                    return web3.eth.accounts.sign(request.params[0], pk)
                        .signature
                case 'eth_signTypedData': {
                    const data = JSON.parse(request.params[1])
                    return signTypedData({
                        privateKey: toBuffer(pk),
                        data,
                        version: sigUtil.SignTypedDataVersion.V1,
                    })
                }

                case 'eth_signTypedData_v3': {
                    const data = JSON.parse(request.params[1])
                    return signTypedData({
                        privateKey: toBuffer(pk),
                        data,
                        version: sigUtil.SignTypedDataVersion.V3,
                    })
                }

                case 'eth_signTypedData_v4': {
                    const data = JSON.parse(request.params[1])
                    return signTypedData({
                        privateKey: toBuffer(pk),
                        data,
                        version: sigUtil.SignTypedDataVersion.V4,
                    })
                }
                /* istanbul ignore next */
                default:
                    return notReachable(request)
            }

        case 'trezor': {
            try {
                await TrezorConnect.init(TERZOR_INIT_CONFIG)
            } catch (e) {
                const alreadyInitError =
                    parseTrezorConnectionAlreadyInitialized(e)

                if (!alreadyInitError) {
                    throw e
                }
            }

            switch (request.method) {
                case 'personal_sign': {
                    const message = request.params[0]
                    const messageToSign = message.startsWith('0x')
                        ? message.substring(2)
                        : message

                    const result = await TrezorConnect.ethereumSignMessage({
                        path: keyStore.path,
                        message: messageToSign,
                        hex: true,
                    })

                    if (!result.success) {
                        throw result.payload
                    }

                    return `0x${result.payload.signature}`
                }

                case 'eth_signTypedData':
                    throw new ImperativeError(
                        'eth_signTypedData V1 not supported by Trezor'
                    )

                case 'eth_signTypedData_v3':
                case 'eth_signTypedData_v4': {
                    const result = await TrezorConnect.ethereumSignTypedData({
                        data: JSON.parse(request.params[1]),
                        path: keyStore.path,
                        metamask_v4_compat: true,
                    })

                    if (!result.success) {
                        throw result.payload
                    }

                    return result.payload.signature
                }

                /* istanbul ignore next */
                default:
                    return notReachable(request)
            }
        }

        case 'ledger':
            const transport = await TransportWebHID.create()
            try {
                const app = new Eth(transport)
                switch (request.method) {
                    case 'personal_sign':
                        const message = request.params[0]
                        const messageToSign = message.startsWith('0x')
                            ? message.substring(2)
                            : message

                        const signPersonalMessage =
                            await app.signPersonalMessage(
                                keyStore.path,
                                messageToSign
                            )

                        return encodeSign(signPersonalMessage)

                    case 'eth_signTypedData':
                        throw new ImperativeError(
                            'eth_signTypedData V1 not supported by Ledger'
                        )

                    case 'eth_signTypedData_v3':
                    case 'eth_signTypedData_v4': {
                        const { message, types, primaryType, domain } =
                            sigUtil.TypedDataUtils.sanitizeData(
                                JSON.parse(request.params[1])
                            )
                        const isV4 =
                            request.method === 'eth_signTypedData_v4'
                                ? sigUtil.SignTypedDataVersion.V4
                                : sigUtil.SignTypedDataVersion.V3

                        const domainSeparatorHex =
                            sigUtil.TypedDataUtils.hashStruct(
                                'EIP712Domain',
                                domain,
                                types,
                                isV4
                            ).toString('hex')
                        const hashStructMessageHex =
                            sigUtil.TypedDataUtils.hashStruct(
                                primaryType as string,
                                message,
                                types,
                                isV4
                            ).toString('hex')

                        const signPersonalMessage =
                            await app.signEIP712HashedMessage(
                                keyStore.path,
                                domainSeparatorHex,
                                hashStructMessageHex
                            )

                        return encodeSign(signPersonalMessage)
                    }
                    /* istanbul ignore next */
                    default:
                        return notReachable(request)
                }
            } finally {
                await transport.close()
            }

        /* istanbul ignore next */
        default:
            return notReachable(keyStore)
    }
}

const flatten = (a: [string, string, string]) =>
    '0x' + a.reduce((r, s) => r + s.slice(2), '')

const encodeSignature = ([v, r, s]: [string, string, string]) =>
    flatten([r, s, v])

const encodeSign = ({
    v,
    s,
    r,
}: {
    v: number
    s: string
    r: string
}): string => {
    return encodeSignature(['0x' + v.toString(16), '0x' + r, '0x' + s])
}
