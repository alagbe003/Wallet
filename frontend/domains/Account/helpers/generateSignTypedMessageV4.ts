import Safe from '@safe-global/protocol-kit'
import { generateTypedData } from '@safe-global/protocol-kit/dist/src/utils/eip-712'

import { SafeTransaction } from '@safe-global/safe-core-sdk-types'
import { Address } from '@zeal/domains/Address'
import { EthSignTypedDataV4 } from '@zeal/domains/RPCRequest'
import { generateRandomNumber } from '@zeal/toolkit/Number'

/**
 * This turns SafeTransaction + Safe into EthSignTypedDataV4 which we can sign with our KeyStores
 */
export const generateSignTypedMessageV4 = async ({
    safe,
    safeTransaction,
    signer,
}: {
    safeTransaction: SafeTransaction
    safe: Safe
    signer: Address
}): Promise<EthSignTypedDataV4> => ({
    id: generateRandomNumber(),
    jsonrpc: '2.0',
    method: 'eth_signTypedData_v4',
    params: [
        signer,
        JSON.stringify(
            generateTypedData({
                chainId: await safe.getChainId(),
                safeAddress: await safe.getAddress(),
                safeTransactionData: safeTransaction.data,
                safeVersion: await safe.getContractVersion(),
            })
        ),
    ],
})
