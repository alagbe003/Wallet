import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { Flow } from './Flow'

import { AccountsMap } from '@zeal/domains/Account'
import { AppErrorPopup } from 'src/domains/Error/components/AppErrorPopup'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'
import { NotSigned } from '@zeal/domains/TransactionRequest'
import { FALLBACK_GAS_LIMIT } from 'src/domains/TransactionRequest/constants'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { bigint, numberString } from '@zeal/toolkit/Result'
import { withDelay } from '@zeal/toolkit/delay'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import {
    Skeleton,
    Msg as SkeletonMsg,
    State as SkeletonState,
} from './Skeleton'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

export type FetchSimulationByRequest = ({
    network,
    rpcRequest,
}: {
    network: Network
    rpcRequest: EthSendTransaction
}) => Promise<SimulationResult>

type Props = {
    transactionRequest: NotSigned
    state: State

    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap

    accounts: AccountsMap
    keystores: KeyStoreMap

    fetchSimulationByRequest: FetchSimulationByRequest

    onMsg: (msg: Msg) => void
}

const fetchGasEstimate = ({
    network,
    networkRPCMap,
    rpcRequest,
}: {
    network: Network
    networkRPCMap: NetworkRPCMap
    rpcRequest: EthSendTransaction
}): Promise<string> =>
    fetchRPCResponse({
        network,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'eth_estimateGas',
            params: [
                {
                    ...rpcRequest.params[0],
                    gas: undefined, // This RPC call will fail if we set a gas value here and the estimate is higher. It is seen as an upper bound - see https://ethereum.org/uz/developers/docs/apis/json-rpc/#eth_estimategas
                    data: (() => {
                        switch (network.type) {
                            case 'predefined': {
                                switch (network.name) {
                                    case 'Ethereum':
                                    case 'Arbitrum':
                                    case 'BSC':
                                    case 'Polygon':
                                    case 'PolygonZkevm':
                                    case 'Fantom':
                                    case 'Optimism':
                                    case 'Base':
                                    case 'Gnosis':
                                    case 'Celo':
                                    case 'Avalanche':
                                    case 'Harmony':
                                    case 'Moonriver':
                                    case 'Cronos':
                                    case 'Aurora':
                                    case 'Evmos':
                                        return rpcRequest.params[0].data
                                    case 'zkSync':
                                        return rpcRequest.params[0].data || '0x'
                                    default:
                                        return notReachable(network)
                                }
                            }
                            case 'custom':
                            case 'testnet':
                                return rpcRequest.params[0].data

                            default:
                                return notReachable(network)
                        }
                    })(),
                },
            ],
        },
    })
        .then((data) =>
            bigint(data).getSuccessResultOrThrow('failed to parse gas estimate')
        )
        .then((num) => `0x${num.toString(16)}`)
        .catch((error) => {
            captureError(error)
            return rpcRequest.params[0].gas || FALLBACK_GAS_LIMIT
        })

const fetch = async ({
    request,
    fetchSimulationByRequest,
    networkMap,
    networkRPCMap,
}: {
    request: NotSigned
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    fetchSimulationByRequest: FetchSimulationByRequest
}): Promise<{
    simulation: SimulationResult
    nonce: number
    gasEstimate: string
}> => {
    const network = findNetworkByHexChainId(request.networkHexId, networkMap)
    const [simulation, nonce, gasEstimate] = await Promise.all([
        fetchSimulationByRequest({
            network,
            rpcRequest: request.rpcRequest,
        }),
        fetchRPCResponse({
            network,
            networkRPCMap,
            request: {
                id: generateRandomNumber(),
                jsonrpc: '2.0',
                method: 'eth_getTransactionCount',
                params: [request.account.address, 'latest'],
            },
        }).then((data) =>
            numberString(data).getSuccessResultOrThrow(
                'failed to parse current nonce'
            )
        ),
        fetchGasEstimate({
            network,
            networkRPCMap,
            rpcRequest: request.rpcRequest,
        }),
    ])

    return { simulation, nonce, gasEstimate }
}

type State = SkeletonState

export type Msg =
    | Extract<
          MsgOf<typeof Flow>,
          {
              type:
                  | 'drag'
                  | 'on_cancel_confirm_transaction_clicked'
                  | 'on_expand_request'
                  | 'on_minimize_click'
                  | 'user_confirmed_transaction_for_signing'
                  | 'import_keys_button_clicked'
                  | 'on_predefined_fee_preset_selected'
          }
      >
    | SkeletonMsg

const SIMULATION_ANIMATION_TIME_MS = 1000

export const ConfirmTransaction = ({
    transactionRequest,
    state,
    accounts,
    keystores,
    fetchSimulationByRequest,
    networkMap,
    networkRPCMap,
    feePresetMap,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(
        withDelay(fetch, SIMULATION_ANIMATION_TIME_MS),
        {
            type: 'loading',
            params: {
                request: transactionRequest,
                fetchSimulationByRequest: fetchSimulationByRequest,
                networkMap,
                networkRPCMap,
            },
        }
    )

    switch (loadable.type) {
        case 'loading':
            return (
                <Skeleton
                    keystore={getKeyStore({
                        keyStoreMap: keystores,
                        address: loadable.params.request.account.address,
                    })}
                    state={state}
                    network={findNetworkByHexChainId(
                        loadable.params.request.networkHexId,
                        networkMap
                    )}
                    account={loadable.params.request.account}
                    onMsg={onMsg}
                />
            )

        case 'loaded':
            return (
                <Flow
                    feePresetMap={feePresetMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    accounts={accounts}
                    keystores={keystores}
                    state={state}
                    transactionRequest={loadable.params.request}
                    simulation={loadable.data.simulation}
                    nonce={loadable.data.nonce}
                    gasEstimate={loadable.data.gasEstimate}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'drag':
                            case 'on_cancel_confirm_transaction_clicked':
                            case 'on_expand_request':
                            case 'on_minimize_click':
                            case 'user_confirmed_transaction_for_signing':
                            case 'import_keys_button_clicked':
                            case 'on_predefined_fee_preset_selected':
                                onMsg(msg)
                                break

                            case 'on_retry_button_clicked':
                            case 'on_transaction_simulation_retry_clicked':
                                setLoadable({
                                    type: 'loading',
                                    params: {
                                        request: loadable.params.request,
                                        fetchSimulationByRequest,
                                        networkMap,
                                        networkRPCMap,
                                    },
                                })
                                break
                            case 'on_edit_approval_form_submit':
                                setLoadable({
                                    type: 'loading',
                                    params: {
                                        request: {
                                            ...loadable.params.request,
                                            rpcRequest:
                                                msg.updatedEthSendTransaction,
                                        },
                                        fetchSimulationByRequest,
                                        networkMap,
                                        networkRPCMap,
                                    },
                                })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'error':
            return (
                <>
                    <Skeleton
                        keystore={getKeyStore({
                            keyStoreMap: keystores,
                            address: loadable.params.request.account.address,
                        })}
                        state={state}
                        network={findNetworkByHexChainId(
                            loadable.params.request.networkHexId,
                            networkMap
                        )}
                        account={loadable.params.request.account}
                        onMsg={onMsg}
                    />

                    <AppErrorPopup
                        error={parseAppError(loadable.error)}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                    onMsg({
                                        type: 'on_cancel_confirm_transaction_clicked',
                                    })
                                    break

                                case 'try_again_clicked':
                                    setLoadable({
                                        type: 'loading',
                                        params: loadable.params,
                                    })
                                    break

                                default:
                                    notReachable(msg)
                            }
                        }}
                    />
                </>
            )

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
