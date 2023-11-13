import Web3 from 'web3'

import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { Money } from '@zeal/domains/Money'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { notReachable } from '@zeal/toolkit'
import { Account } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { Network } from '@zeal/domains/Network'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { getNativeTokenAddress } from '@zeal/domains/Network/helpers/getNativeTokenAddress'

const CONTRACT_ABI = [
    {
        type: 'function' as const,
        constant: false,
        inputs: [
            { name: '_to', type: 'address' },
            { name: '_value', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
    },
]

type Params = {
    fromAccount: Account
    toAddress: Address
    network: Network
    amount: Money
    knownCurrencies: KnownCurrencies
}

export const createERC20EthSendTransaction = ({
    fromAccount,
    knownCurrencies,
    toAddress,
    network,
    amount,
}: Params): EthSendTransaction => {
    const currency = knownCurrencies[amount.currencyId]
    if (!currency) {
        throw new Error(
            `Trying to create ERC20 trx, but fined to look up currency ${amount.currencyId}`
        )
    }
    switch (currency.type) {
        case 'FiatCurrency':
            throw new Error(
                `Trying to create ERC20 trx, but got FiatCurrency ${currency.id}`
            )
        case 'CryptoCurrency':
            const isTrxInNativeCurrency =
                currency.address === getNativeTokenAddress(network)
            if (isTrxInNativeCurrency) {
                return {
                    id: generateRandomNumber(),
                    jsonrpc: '2.0' as const,
                    method: 'eth_sendTransaction' as const,
                    params: [
                        {
                            from: fromAccount.address,
                            data: '',
                            to: toAddress,
                            value: '0x' + amount.amount.toString(16),
                        },
                    ],
                }
            } else {
                const web3 = new Web3()
                const contract = new web3.eth.Contract(
                    CONTRACT_ABI,
                    currency.address,
                    { from: fromAccount.address }
                )
                const hexAmount: string = '0x' + amount.amount.toString(16)
                const data: string = contract.methods
                    .transfer(toAddress, hexAmount)
                    .encodeABI()

                return {
                    id: generateRandomNumber(),
                    jsonrpc: '2.0' as const,
                    method: 'eth_sendTransaction' as const,
                    params: [
                        {
                            from: fromAccount.address,
                            data,
                            to: currency.address,
                        },
                    ],
                }
            }

        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}
