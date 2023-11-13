import { components } from '@zeal/api/portfolio'
import {
    Eip1559Fee,
    LegacyFee,
} from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { Money } from '@zeal/domains/Money'
import { post } from '@zeal/api/request'
import { notReachable } from '@zeal/toolkit'
import {
    bigint,
    nullable,
    numberString,
    oneOf,
    Result,
    shape,
    success,
} from '@zeal/toolkit/Result'
import {
    parseEIP1559Fee,
    parseLegacyFee,
} from '@zeal/domains/Transactions/domains/SimulatedTransaction/parsers/parseEstimatedFee'
import { parse as parseMoney } from '@zeal/domains/Money/helpers/parse'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import {
    CustomNetwork,
    Network,
    NetworkHexId,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { parseKnownCurrencies } from '@zeal/domains/Currency/helpers/parse'
import { fetchNativeBalance } from '@zeal/domains/Address/api/fetchNativeBalance'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'
import { Address } from '@zeal/domains/Address'
import { ImperativeError } from '@zeal/domains/Error'
import { bigIntToHex } from '@zeal/toolkit/BigInt'

export type CustomSelectedPreset = {
    type: 'Custom'
    fee:
        | {
              type: 'LegacyCustomPresetRequestFee'
              gasPrice: string
              nonce: number
          }
        | {
              type: 'Eip1559CustomPresetRequestFee'
              maxPriorityFee: string
              maxBaseFee: string
              nonce: number
          }
}

export type FeePresetMap = Record<NetworkHexId, PredefinedPreset>

export type PredefinedPreset = { type: 'Slow' | 'Normal' | 'Fast' }

export type FeeForecastRequest = {
    network: Network
    networkRPCMap: NetworkRPCMap
    gasLimit: components['schemas']['Hexadecimal']
    gasEstimate: components['schemas']['Hexadecimal']
    address: string
    sendTransactionRequest: EthSendTransaction

    selectedPreset: PredefinedPreset | CustomSelectedPreset
}

export type FeesForecastResponseLegacyFee = {
    type: 'FeesForecastResponseLegacyFee'
    slow: LegacyFee
    normal: LegacyFee
    fast: LegacyFee
    custom: LegacyFee | null
    nonce: number
    balanceInNativeCurrency: Money
    networkState: components['schemas']['LegacyNetworkState']
    currencies: KnownCurrencies
}

export type FeesForecastResponseEip1559Fee = {
    type: 'FeesForecastResponseEip1559Fee'
    slow: Eip1559Fee
    normal: Eip1559Fee
    fast: Eip1559Fee
    custom: Eip1559Fee | null
    nonce: number
    networkState: components['schemas']['Eip1559NetworkState']
    balanceInNativeCurrency: Money
    currencies: KnownCurrencies
}

export type FeeForecastResponse =
    | FeesForecastResponseLegacyFee
    | FeesForecastResponseEip1559Fee

export const fetchFeeForecast = async ({
    signal,
    address,
    network,
    networkRPCMap,
    selectedPreset,
    gasLimit,
    gasEstimate,
    sendTransactionRequest,
}: FeeForecastRequest & {
    signal?: AbortSignal
}): Promise<FeeForecastResponse> => {
    switch (network.type) {
        case 'predefined':
        case 'testnet':
            const response = await post(
                '/wallet/fee/forecast',
                {
                    body: {
                        sendTransactionParams: sendTransactionRequest.params[0],
                        network: network.name,
                        address,
                        gasLimit,
                        gasEstimate,
                        selectedPreset: getSelectedPreset({ selectedPreset }),
                    },
                },
                signal
            )
            return parseFeeForecastResponse({
                response,
            }).getSuccessResultOrThrow('cannot parse ForecastRequest ')

        case 'custom':
            return fetchCustomNetworkFeeForecast({
                address,
                gasLimit,
                network,
                networkRPCMap,
                selectedPreset,
            })

        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}

const getSelectedPreset = ({
    selectedPreset,
}: {
    selectedPreset: FeeForecastRequest['selectedPreset']
}): components['schemas']['FeesForecastSelectedPreset'] => {
    switch (selectedPreset.type) {
        case 'Slow':
        case 'Normal':
        case 'Fast':
            return selectedPreset
        case 'Custom':
            return {
                type: 'Custom',
                fee: selectedPreset.fee,
            }
        /* istanbul ignore next */
        default:
            return notReachable(selectedPreset)
    }
}

const parseFeeForecastResponse = ({
    response,
}: {
    response: components['schemas']['FeesForecastResponse']
}): Result<unknown, FeeForecastResponse> => {
    switch (response.type) {
        case 'FeesForecastResponseLegacyFee':
            return shape({
                type: success('FeesForecastResponseLegacyFee' as const),
                slow: parseLegacyFee(response.slow),
                normal: parseLegacyFee(response.normal),
                fast: parseLegacyFee(response.fast),
                custom: oneOf([
                    parseLegacyFee(response.custom),
                    nullable(response.custom),
                ]),
                nonce: success(response.nonce),
                networkState: success(response.networkState),
                balanceInNativeCurrency: parseMoney(
                    response.balanceInNativeCurrency
                ),
                currencies: parseKnownCurrencies(response.currencies),
            })
        case 'FeesForecastResponseEip1559Fee':
            return shape({
                type: success('FeesForecastResponseEip1559Fee' as const),
                slow: parseEIP1559Fee(response.slow),
                normal: parseEIP1559Fee(response.normal),
                fast: parseEIP1559Fee(response.fast),
                custom: oneOf([
                    parseEIP1559Fee(response.custom),
                    nullable(response.custom),
                ]),
                nonce: success(response.nonce),
                balanceInNativeCurrency: parseMoney(
                    response.balanceInNativeCurrency
                ),
                currencies: parseKnownCurrencies(response.currencies),
                networkState: success(response.networkState),
            })
        /* istanbul ignore next */
        default:
            return notReachable(response)
    }
}

export const fetchCustomNetworkFeeForecast = async ({
    network,
    networkRPCMap,
    address,
    gasLimit,
    selectedPreset,
}: {
    address: Address
    network: CustomNetwork
    networkRPCMap: NetworkRPCMap
    gasLimit: string
    selectedPreset: FeeForecastRequest['selectedPreset']
}): Promise<FeeForecastResponse> => {
    switch (network.trxType) {
        case 'legacy':
            const [nativeBalance, nonce, gasPrice] = await Promise.all([
                fetchNativeBalance({
                    address,
                    network,
                    networkRPCMap,
                }),
                fetchRPCResponse({
                    network,
                    networkRPCMap,
                    request: {
                        id: generateRandomNumber(),
                        jsonrpc: '2.0',
                        method: 'eth_getTransactionCount',
                        params: [address, 'latest'],
                    },
                }).then((data) =>
                    numberString(data).getSuccessResultOrThrow(
                        'failed to parse custom network current nonce'
                    )
                ),
                fetchRPCResponse({
                    network,
                    networkRPCMap,
                    request: {
                        id: generateRandomNumber(),
                        jsonrpc: '2.0',
                        method: 'eth_gasPrice',
                        params: [],
                    },
                }).then((data) =>
                    bigint(data).getSuccessResultOrThrow(
                        'failed to parse gas price for custom network nonce'
                    )
                ),
            ])

            const legacyPreset: LegacyFee = {
                type: 'LegacyFee',
                forecastDuration: { type: 'OutsideOfForecast' },
                gasPrice: bigIntToHex(gasPrice),
                priceInDefaultCurrency: null,
                priceInNativeCurrency: {
                    amount: gasPrice * BigInt(gasLimit),
                    currencyId: network.nativeCurrency.id,
                },
            }

            switch (selectedPreset.type) {
                case 'Slow':
                case 'Normal':
                case 'Fast':
                    return {
                        type: 'FeesForecastResponseLegacyFee',
                        currencies: {
                            [network.nativeCurrency.id]: network.nativeCurrency,
                        },
                        networkState: {
                            type: 'LegacyNetworkState',
                            durationMs: 0,
                            maxGasPrice: '0',
                            minGasPrice: '0',
                        },
                        balanceInNativeCurrency: {
                            amount: nativeBalance,
                            currencyId: network.nativeCurrency.id,
                        },
                        nonce,
                        custom: null,
                        fast: legacyPreset,
                        normal: legacyPreset,
                        slow: legacyPreset,
                    }

                case 'Custom':
                    switch (selectedPreset.fee.type) {
                        case 'LegacyCustomPresetRequestFee':
                            return {
                                type: 'FeesForecastResponseLegacyFee',
                                currencies: {
                                    [network.nativeCurrency.id]:
                                        network.nativeCurrency,
                                },
                                networkState: {
                                    type: 'LegacyNetworkState',
                                    durationMs: 0,
                                    maxGasPrice: '0',
                                    minGasPrice: '0',
                                },
                                balanceInNativeCurrency: {
                                    amount: nativeBalance,
                                    currencyId: network.nativeCurrency.id,
                                },
                                nonce: selectedPreset.fee.nonce,
                                custom: {
                                    type: 'LegacyFee',
                                    forecastDuration: {
                                        type: 'OutsideOfForecast',
                                    },
                                    gasPrice: bigIntToHex(gasPrice),
                                    priceInDefaultCurrency: null,
                                    priceInNativeCurrency: {
                                        amount:
                                            BigInt(
                                                selectedPreset.fee.gasPrice
                                            ) * BigInt(gasLimit),
                                        currencyId: network.nativeCurrency.id,
                                    },
                                },
                                fast: legacyPreset,
                                normal: legacyPreset,
                                slow: legacyPreset,
                            }

                        case 'Eip1559CustomPresetRequestFee':
                            throw new ImperativeError(
                                'Impossible state, got custom eip1559 preset for legacy trx type network'
                            )

                        /* istanbul ignore next */
                        default:
                            return notReachable(selectedPreset.fee)
                    }

                /* istanbul ignore next */
                default:
                    return notReachable(selectedPreset)
            }

        case 'eip1559':
            throw new ImperativeError(
                'Custom network with eip1559 fees are not supported'
            )

        default:
            return notReachable(network.trxType)
    }
}
