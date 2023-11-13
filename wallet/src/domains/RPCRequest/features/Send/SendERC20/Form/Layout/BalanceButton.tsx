import Big from 'big.js'
import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { ImperativeError } from '@zeal/domains/Error'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { getNativeTokenAddress } from '@zeal/domains/Network/helpers/getNativeTokenAddress'
import { Token } from '@zeal/domains/Token'
import {
    FeePresetMap,
    fetchFeeForecast,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { getDefaultFeePreset } from '@zeal/domains/Transactions/helpers/getDefaultFeePreset'
import { notReachable, useLiveRef } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { Tertiary } from '@zeal/uikit/Tertiary'

type Props = {
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    state: 'normal' | 'error'
    knownCurrencies: KnownCurrencies
    account: Account
    token: Token
    onClick: (maxAmount: string) => void
}

const fetchMaxAmount = async ({
    fromAddress,
    toAddress,
    token,
    networkMap,
    networkRPCMap,
    feePresetMap,
    signal,
}: {
    token: Token
    fromAddress: Address
    toAddress: Address
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    signal?: AbortSignal
}): Promise<Big> => {
    const {
        fast: { priceInNativeCurrency },
    } = await fetchFeeForecast({
        gasEstimate: '0x5208', // 21K
        network: findNetworkByHexChainId(token.networkHexId, networkMap),
        networkRPCMap,
        gasLimit: '0x7b0c', // 21k*1.5
        address: fromAddress,
        selectedPreset: getDefaultFeePreset({
            feePresetMap,
            networkHexId: token.networkHexId,
        }),
        sendTransactionRequest: {
            id: generateRandomNumber(),
            jsonrpc: '2.0' as const,
            method: 'eth_sendTransaction' as const,
            params: [
                {
                    from: fromAddress,
                    data: '',
                    to: toAddress,
                    value: '0x0',
                },
            ],
        },
        signal,
    })

    return Big(priceInNativeCurrency.amount.toString())
}

export const BalanceButton = ({
    networkMap,
    networkRPCMap,
    account,
    token,
    knownCurrencies,
    state,
    feePresetMap,
    onClick,
}: Props) => {
    const [pollable, setPollable] = usePollableData(
        fetchMaxAmount,
        {
            type: 'loading',
            params: {
                fromAddress: account.address,
                token: token,
                toAddress: account.address,
                networkMap,
                networkRPCMap,
                feePresetMap,
            },
        },
        {
            pollIntervalMilliseconds: 3000,
        }
    )

    const liveNetworkMap = useLiveRef(networkMap)

    useEffect(() => {
        setPollable({
            type: 'loading',
            params: {
                networkMap: liveNetworkMap.current,
                networkRPCMap,
                fromAddress: account.address,
                token: token,
                toAddress: account.address,
                feePresetMap,
            },
        })
    }, [
        account.address,
        liveNetworkMap,
        networkRPCMap,
        setPollable,
        token,
        feePresetMap,
    ])

    return (
        <Tertiary
            color={(() => {
                switch (state) {
                    case 'normal':
                        return 'on_light'
                    case 'error':
                        return 'critical'
                    /* istanbul ignore next */
                    default:
                        return notReachable(state)
                }
            })()}
            size="regular"
            onClick={() => {
                const tokenCurrency = knownCurrencies[token.balance.currencyId]
                const power = Big(10).pow(tokenCurrency.fraction)
                const tokenBalance = Big(token.balance.amount.toString())

                switch (tokenCurrency.type) {
                    case 'FiatCurrency':
                        throw new ImperativeError(
                            'Token currency must be a Crypto currency but got Fiat'
                        )
                    case 'CryptoCurrency':
                        const isTrxInNativeCurrency =
                            tokenCurrency.address ===
                            getNativeTokenAddress(
                                findNetworkByHexChainId(
                                    token.networkHexId,
                                    networkMap
                                )
                            )

                        const subtractFeesAmount = (() => {
                            if (isTrxInNativeCurrency) {
                                switch (pollable.type) {
                                    case 'loading':
                                    case 'error':
                                        return Big(0)
                                    case 'loaded':
                                    case 'reloading':
                                    case 'subsequent_failed':
                                        return pollable.data
                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(pollable)
                                }
                            }
                            return Big(0)
                        })()

                        const dollars = tokenBalance
                            .minus(subtractFeesAmount)
                            .div(power)
                            .toFixed()

                        onClick(dollars)

                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(tokenCurrency)
                }
            }}
        >
            <FormattedMessage
                id="send_token.form.balance"
                defaultMessage="Balance {amount}"
                values={{
                    amount: (
                        <FormattedTokenBalances
                            money={token.balance}
                            knownCurrencies={knownCurrencies}
                        />
                    ),
                }}
            />
        </Tertiary>
    )
}
