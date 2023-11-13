import { GAS_MULTIPLIER } from '@zeal/domains/RPCRequest/constants'
import { Big } from 'big.js'

import Web3 from 'web3'

export const getSuggestedGasLimit = (gasEstimate: string): string => {
    const simulatedGas = Big(BigInt(gasEstimate).toString(10))
    const gasWithMultiplierFloat = simulatedGas
        .times(Big(GAS_MULTIPLIER))
        .toFixed(0)

    return Web3.utils.toHex(gasWithMultiplierFloat)
}
