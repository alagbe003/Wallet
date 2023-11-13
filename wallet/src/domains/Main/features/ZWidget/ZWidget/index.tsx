import { useEffect, useLayoutEffect, useState } from 'react'
import { Storage } from '@zeal/domains/Storage'
import { notReachable, useLiveRef } from '@zeal/toolkit'

import { Network, NetworkMap } from '@zeal/domains/Network'
import { DEFAULT_NETWORK } from '@zeal/domains/Network/constants'
import { Connected } from './Connected'

import {
    AlternativeProvider,
    ContentScriptToZwidget,
    ExtensionToZWidget,
    ReadyMsg,
    RPCRequestMsg as RPCRequestMessage,
    RPCResponse,
    ZwidgetToContentScript,
} from '@zeal/domains/Main'
import { Disconnected } from 'src/domains/DApp/domains/ConnectionState/components/Disconnected'
import { calculate } from 'src/domains/DApp/domains/ConnectionState/helpers/calculate'
import { ImperativeError, RPCRequestParseError } from '@zeal/domains/Error'
import { parseRPCError } from '@zeal/domains/Error/domains/RPCError/parsers/parseRPCError'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { parseUnexpectedFailureError } from '@zeal/domains/Error/parsers/parseUnexpectedFailureError'
import {
    openAddAccountPageTab,
    openAddFromHardwareWallet,
    openCreateContactPage,
} from 'src/domains/Main/helpers/openEntrypoint'
import { parse as parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'
import {
    InteractionRequest,
    notSupportedNetwork,
    ProviderRPCError,
    RPCRequest,
    unauthorizedPRCRequest,
    unsupportedRPCMethod,
    userRejectedRequest,
    WalletSwitchEthereumChain,
} from '@zeal/domains/RPCRequest'
import { proxyRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'
import { getSignatureAddress } from '@zeal/domains/RPCRequest/helpers/getSignatureAddress'
import { parseRPCRequest } from '@zeal/domains/RPCRequest/parsers/parseRPCRequest'
import { addAccountsWithKeystores } from '@zeal/domains/Storage/helpers/addAccountsWithKeystores'
import { toLocalStorage } from 'src/domains/Storage/helpers/toLocalStorage'
import { cancelSubmittedToSubmitted } from 'src/domains/TransactionRequest/helpers/cancelSubmittedToSubmitted'
import { removeTransactionRequest } from 'src/domains/TransactionRequest/helpers/removeTransactionRequest'
import { match, object, oneOf, Result, shape } from '@zeal/toolkit/Result'
import { DragAndDropBar } from 'src/uikit/DragAndClickHandler'
import { Connect } from './Connect'
import { saveFeePreset } from '@zeal/domains/Storage/helpers/saveFeePreset'
import { updateNetworkRPC } from '@zeal/domains/Network/helpers/updateNetworkRPC'
import { ConnectedToMetaMask } from './ConnectedToMetaMask'
import { updateDAppInfo } from './helpers/updateDAppInfo'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { parseContentScriptToZwidget } from 'src/domains/Main/parsers/parseZwidgetContentMsgs'
import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'
import { Account } from '@zeal/domains/Account'

type Props = {
    dAppUrl: string
    selectedAddress: string
    installationId: string

    networkMap: NetworkMap

    storage: Storage
    sessionPassword: string | null
}

const failureResponse = (
    id: number,
    reason: ProviderRPCError
): RPCResponse<unknown, ProviderRPCError> => {
    return {
        type: 'rpc_response',
        id,
        response: {
            type: 'failure',
            reason: reason,
        },
    }
}

const send = (
    msg: ZwidgetToContentScript<unknown, ProviderRPCError | unknown>
): void => {
    window.parent.postMessage(msg, '*')
}

export const ZWidget = ({
    sessionPassword,
    selectedAddress,
    dAppUrl,
    storage,
    networkMap,
    installationId,
}: Props) => {
    const state = calculate({ hostname: dAppUrl, dApps: storage.dApps })

    const [changeNetworkRequest, setChangeNetworkRequest] = useState<Network>(
        () => {
            switch (state.type) {
                case 'connected_to_meta_mask':
                case 'not_interacted':
                    return DEFAULT_NETWORK
                case 'disconnected':
                case 'connected': {
                    const network = networkMap[state.networkHexId]
                    return network || DEFAULT_NETWORK
                }
                /* istanbul ignore next */
                default:
                    return notReachable(state)
            }
        }
    )

    const [interactionRequest, setInteractionRequest] =
        useState<InteractionRequest | null>(null)

    const [alternativeProvider, setAlternativeProvider] =
        useState<AlternativeProvider>(() => {
            switch (state.type) {
                case 'not_interacted':
                case 'disconnected':
                case 'connected':
                    return 'provider_unavailable'
                case 'connected_to_meta_mask':
                    return 'metamask'
                /* istanbul ignore next */
                default:
                    return notReachable(state)
            }
        })

    const [account, setAccount] = useState<Account>(() => {
        switch (state.type) {
            case 'not_interacted':
            case 'disconnected':
            case 'connected_to_meta_mask':
                return storage.accounts[selectedAddress]
            case 'connected':
                return storage.accounts[state.address]
            /* istanbul ignore next */
            default:
                return notReachable(state)
        }
    })

    const liveState = useLiveRef(state)
    const liveStorage = useLiveRef(storage)
    const liveChangeNetworkRequest = useLiveRef(changeNetworkRequest)
    const liveNetworkMap = useLiveRef(networkMap)

    useLayoutEffect(() => {
        const messageListener = (
            request: unknown,
            sender: chrome.runtime.MessageSender
        ) => {
            if (sender.id === chrome.runtime.id) {
                const message =
                    parseExtensionToZWidgetMessage(request).getSuccessResult()
                if (message) {
                    switch (message.type) {
                        case 'extension_address_change':
                            const connectionState = liveState.current
                            const accounts = liveStorage.current.accounts
                            const account = accounts[message.address]
                            if (!account) {
                                captureError(
                                    new ImperativeError(
                                        'Failed to find account by address from extension message'
                                    )
                                )
                                return
                            }

                            setAccount(account)

                            switch (connectionState.type) {
                                case 'disconnected':
                                case 'not_interacted':
                                case 'connected_to_meta_mask':
                                    toLocalStorage({
                                        ...liveStorage.current,
                                        selectedAddress: account.address,
                                    })

                                    break
                                case 'connected':
                                    toLocalStorage({
                                        ...liveStorage.current,
                                        selectedAddress: account.address,
                                        dApps: {
                                            ...liveStorage.current.dApps,
                                            [dAppUrl]: {
                                                type: 'connected',
                                                address: account.address,
                                                networkHexId:
                                                    liveChangeNetworkRequest
                                                        .current.hexChainId,
                                                dApp: liveState.current.dApp,
                                                connectedAtMs: Date.now(),
                                            },
                                        },
                                    })
                                    send({
                                        type: 'account_change',
                                        account: account.address,
                                    })

                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(connectionState)
                            }

                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(message.type)
                    }
                }
            }

            return undefined
        }

        chrome.runtime.onMessage.addListener(messageListener)

        return () => {
            chrome.runtime.onMessage.removeListener(messageListener)
        }
    }, [dAppUrl, liveChangeNetworkRequest, liveState, liveStorage])

    useEffect(() => {
        switch (liveState.current.type) {
            case 'not_interacted':
            case 'disconnected':
            case 'connected':
                break
            case 'connected_to_meta_mask':
                switch (alternativeProvider) {
                    case 'provider_unavailable':
                        toLocalStorage({
                            ...liveStorage.current,
                            dApps: {
                                ...liveStorage.current.dApps,
                                [liveState.current.dApp.hostname]: {
                                    type: 'disconnected',
                                    dApp: liveState.current.dApp,
                                    networkHexId: DEFAULT_NETWORK.hexChainId,
                                },
                            },
                        })
                        break
                    case 'metamask':
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(alternativeProvider)
                }
                break
            /* istanbul ignore next */
            default:
                return notReachable(liveState.current)
        }
    }, [alternativeProvider, liveState, liveStorage])

    useLayoutEffect(() => {
        switch (liveState.current.type) {
            case 'connected_to_meta_mask':
                send({
                    type: 'zwidget_connected_to_meta_mask',
                })
                break
            case 'not_interacted':
            case 'disconnected':
                send({
                    type: 'init_provider',
                    account: null,
                    chainId: liveChangeNetworkRequest.current.hexChainId,
                })
                break
            case 'connected': {
                send({
                    type: 'init_provider',
                    account: liveState.current.address,
                    chainId: liveChangeNetworkRequest.current.hexChainId,
                })
                break
            }

            /* istanbul ignore next */
            default:
                notReachable(liveState.current)
        }
        const listener = async (
            message: MessageEvent<ContentScriptToZwidget>
        ) => {
            const event = parseContentScriptToZwidget(
                message.data
            ).getSuccessResult()
            if (!event) {
                return
            }

            const handleNetworkChangeRequest = async (
                event: RPCRequestMessage,
                request: WalletSwitchEthereumChain
            ) => {
                const chainId =
                    parseNetworkHexId(
                        request.params[0].chainId.toLowerCase()
                    ).getSuccessResult() || null

                const network: Network | null =
                    chainId && liveNetworkMap.current[chainId]

                if (chainId && network && isRPCSupported(network)) {
                    setChangeNetworkRequest(network)
                    const connection = liveState.current

                    switch (connection.type) {
                        case 'not_interacted': {
                            liveStorage.current.dApps[
                                liveState.current.dApp.hostname
                            ] = {
                                type: 'disconnected',
                                dApp: connection.dApp,
                                networkHexId: chainId,
                            }

                            await toLocalStorage(liveStorage.current)

                            send({
                                type: 'network_change',
                                chainId,
                            })

                            send({
                                type: 'rpc_response',
                                id: event.request.id,
                                response: {
                                    type: 'success',
                                    data: null,
                                },
                            })
                            break
                        }
                        case 'disconnected':
                        case 'connected': {
                            liveStorage.current.dApps[
                                liveState.current.dApp.hostname
                            ] = {
                                ...connection,
                                networkHexId: chainId,
                            }

                            await toLocalStorage(liveStorage.current)

                            send({
                                type: 'network_change',
                                chainId,
                            })

                            send({
                                type: 'rpc_response',
                                id: event.request.id,
                                response: {
                                    type: 'success',
                                    data: null,
                                },
                            })
                            break
                        }

                        case 'connected_to_meta_mask': {
                            captureError(
                                new ImperativeError(
                                    'we got network change request in connected to connected_to_meta_mask state'
                                )
                            )
                            break
                        }

                        /* istanbul ignore next */
                        default:
                            return notReachable(connection)
                    }
                } else {
                    return send({
                        type: 'rpc_response',
                        id: event.request.id,
                        response: {
                            type: 'failure',
                            reason: notSupportedNetwork(),
                        },
                    })
                }
            }

            const handleRPCRequestWhenNotConnected = async (
                event: RPCRequestMessage,
                request: RPCRequest
            ) => {
                switch (request.method) {
                    case 'eth_accounts':
                        send({
                            type: 'rpc_response',
                            id: event.request.id,
                            response: {
                                type: 'success',
                                data: [],
                            },
                        })
                        break
                    case 'net_version':
                        send({
                            type: 'rpc_response',
                            id: event.request.id,
                            response: {
                                type: 'success',
                                data: `${parseInt(
                                    liveChangeNetworkRequest.current.hexChainId,
                                    16
                                )}`,
                            },
                        })
                        break

                    case 'eth_chainId':
                        send({
                            type: 'rpc_response',
                            id: event.request.id,
                            response: {
                                type: 'success',
                                data: liveChangeNetworkRequest.current
                                    .hexChainId,
                            },
                        })
                        break

                    case 'eth_coinbase':
                        send({
                            type: 'rpc_response',
                            id: event.request.id,
                            response: {
                                type: 'success',
                                data: null,
                            },
                        })
                        break

                    case 'wallet_watchAsset':
                        send({
                            type: 'rpc_response',
                            id: event.request.id,
                            response: {
                                type: 'success',
                                data: true,
                            },
                        })
                        break

                    case 'wallet_switchEthereumChain':
                        await handleNetworkChangeRequest(event, request)
                        break

                    // we allow some non-expensive read transaction without auth
                    case 'eth_call':
                    case 'eth_getCode':
                    case 'eth_blockNumber':
                    case 'eth_getBalance':
                    case 'eth_estimateGas':
                    case 'web3_clientVersion':
                        proxyRPCResponse({
                            request,
                            network: liveChangeNetworkRequest.current,
                            networkRPCMap: liveStorage.current.networkRPCMap,
                            dAppSiteInfo: liveState.current.dApp,
                        })
                            .then((response) => {
                                send({
                                    type: 'rpc_response',
                                    id: event.request.id,
                                    response: {
                                        type: 'success',
                                        data: response,
                                    },
                                })
                            })
                            .catch((error) => {
                                const parsed = oneOf([
                                    parseRPCError(error).map(
                                        ({ payload }) => payload
                                    ),
                                    parseUnexpectedFailureError(error).map(
                                        ({ error: { reason } }) => reason
                                    ),
                                ])

                                switch (parsed.type) {
                                    case 'Success':
                                        send({
                                            type: 'rpc_response',
                                            id: event.request.id,
                                            response: {
                                                type: 'failure',
                                                reason: parsed.data,
                                            },
                                        })
                                        break

                                    case 'Failure':
                                        send({
                                            type: 'rpc_response',
                                            id: event.request.id,
                                            response: {
                                                type: 'failure',
                                                reason: error,
                                            },
                                        })
                                        break

                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(parsed)
                                }
                            })
                        break

                    case 'eth_sendRawTransaction':
                    case 'eth_sendTransaction':
                    case 'eth_getTransactionReceipt':
                    case 'eth_getTransactionByHash':
                    case 'eth_getLogs':
                    case 'debug_traceTransaction':
                    case 'personal_sign':
                    case 'eth_getBlockByNumber':
                    case 'eth_signTypedData':
                    case 'eth_signTypedData_v4':
                    case 'eth_signTypedData_v3':
                    case 'eth_getTransactionCount':
                    case 'personal_ecRecover':
                    case 'eth_gasPrice':
                    case 'eth_getStorageAt':
                    case 'wallet_addEthereumChain':
                        send(
                            failureResponse(
                                request.id,
                                unauthorizedPRCRequest()
                            )
                        )

                        break

                    case 'eth_requestAccounts':
                        setInteractionRequest(request)
                        break

                    /* istanbul ignore next */
                    default:
                        return notReachable(request)
                }
            }

            switch (event.type) {
                case 'provider_announcement_msg':
                    setAlternativeProvider(event.provider)
                    break

                case 'rpc_request':
                    const request = parseRPCRequest(event.request)
                    switch (request.type) {
                        case 'Failure':
                            captureError(
                                new RPCRequestParseError({
                                    reason: request.reason,
                                    rpcMethod: event.request.method,
                                })
                            )
                            send(
                                failureResponse(
                                    event.request.id,
                                    unsupportedRPCMethod()
                                )
                            )
                            break

                        case 'Success':
                            switch (liveState.current.type) {
                                case 'connected_to_meta_mask':
                                    switch (request.data.method) {
                                        case 'eth_requestAccounts':
                                        case 'eth_accounts':
                                            send({
                                                type: 'select_meta_mask_provider',
                                                id: event.request.id,
                                                ethRequestAccounts: {
                                                    method: request.data.method,
                                                    params: request.data.params,
                                                },
                                            })
                                            break
                                        case 'debug_traceTransaction':
                                        case 'eth_blockNumber':
                                        case 'eth_call':
                                        case 'eth_chainId':
                                        case 'eth_coinbase':
                                        case 'eth_estimateGas':
                                        case 'eth_gasPrice':
                                        case 'eth_getBalance':
                                        case 'eth_getBlockByNumber':
                                        case 'eth_getCode':
                                        case 'eth_getTransactionByHash':
                                        case 'eth_getTransactionCount':
                                        case 'eth_getTransactionReceipt':
                                        case 'eth_getLogs':
                                        case 'eth_sendRawTransaction':
                                        case 'eth_sendTransaction':
                                        case 'eth_signTypedData':
                                        case 'eth_signTypedData_v3':
                                        case 'eth_signTypedData_v4':
                                        case 'net_version':
                                        case 'personal_ecRecover':
                                        case 'personal_sign':
                                        case 'wallet_addEthereumChain':
                                        case 'wallet_switchEthereumChain':
                                        case 'web3_clientVersion':
                                        case 'wallet_watchAsset':
                                        case 'eth_getStorageAt':
                                            captureError(
                                                new ImperativeError(
                                                    'we got rpc request in zwidget in connected_to_meta_mask state'
                                                )
                                            )
                                            failureResponse(
                                                event.request.id,
                                                unsupportedRPCMethod()
                                            )
                                            break
                                        /* istanbul ignore next */
                                        default:
                                            return notReachable(request.data)
                                    }

                                    break

                                case 'not_interacted': {
                                    liveStorage.current.dApps[dAppUrl] = {
                                        type: 'disconnected',
                                        networkHexId:
                                            DEFAULT_NETWORK.hexChainId,
                                        dApp: {
                                            hostname: dAppUrl,
                                            avatar: null,
                                            title: null,
                                        },
                                    }
                                    await toLocalStorage(liveStorage.current)
                                    await handleRPCRequestWhenNotConnected(
                                        event,
                                        request.data
                                    )
                                    break
                                }

                                case 'disconnected':
                                    await handleRPCRequestWhenNotConnected(
                                        event,
                                        request.data
                                    )
                                    break

                                case 'connected':
                                    switch (request.data.method) {
                                        case 'personal_sign':
                                        case 'eth_signTypedData':
                                        case 'eth_signTypedData_v3':
                                        case 'eth_signTypedData_v4':
                                            setInteractionRequest(request.data)
                                            break

                                        case 'wallet_addEthereumChain':
                                            const requestData =
                                                request.data.params[0]

                                            const chainId =
                                                parseNetworkHexId(
                                                    requestData.chainId.toLowerCase()
                                                ).getSuccessResult() || null

                                            if (!chainId) {
                                                send({
                                                    type: 'rpc_response',
                                                    id: event.request.id,
                                                    response: {
                                                        type: 'failure',
                                                        reason: notSupportedNetwork(), // TODO :: what will be correct error here?
                                                    },
                                                })
                                                break
                                            }

                                            const network: Network | null =
                                                chainId &&
                                                liveNetworkMap.current[chainId]

                                            if (network) {
                                                send({
                                                    type: 'rpc_response',
                                                    id: event.request.id,
                                                    response: {
                                                        type: 'failure',
                                                        reason: notSupportedNetwork(), // TODO :: what will be correct error here?
                                                    },
                                                })
                                                break
                                            }

                                            setInteractionRequest(request.data)
                                            break

                                        case 'wallet_watchAsset':
                                            send({
                                                type: 'rpc_response',
                                                id: event.request.id,
                                                response: {
                                                    type: 'success',
                                                    data: true,
                                                },
                                            })
                                            break

                                        case 'wallet_switchEthereumChain':
                                            // req received
                                            await handleNetworkChangeRequest(
                                                event,
                                                request.data
                                            )
                                            break

                                        case 'eth_sendRawTransaction':
                                            send(
                                                failureResponse(
                                                    event.request.id,
                                                    unauthorizedPRCRequest()
                                                )
                                            )
                                            break
                                        case 'eth_accounts':
                                        case 'eth_requestAccounts':
                                            send({
                                                type: 'rpc_response',
                                                id: event.request.id,
                                                response: {
                                                    type: 'success',
                                                    data: [
                                                        liveState.current
                                                            .address,
                                                    ],
                                                },
                                            })

                                            break
                                        case 'eth_sendTransaction':
                                            setInteractionRequest(request.data)
                                            break
                                        case 'eth_chainId': {
                                            const chainId =
                                                liveChangeNetworkRequest.current
                                                    .hexChainId
                                            send({
                                                type: 'rpc_response',
                                                id: event.request.id,
                                                response: {
                                                    type: 'success',
                                                    data: chainId,
                                                },
                                            })

                                            break
                                        }

                                        case 'eth_coinbase':
                                            send({
                                                type: 'rpc_response',
                                                id: event.request.id,
                                                response: {
                                                    type: 'success',
                                                    data: liveState.current
                                                        .address,
                                                },
                                            })
                                            break

                                        case 'personal_ecRecover':
                                            getSignatureAddress(request.data)
                                                .then((address) =>
                                                    send({
                                                        type: 'rpc_response',
                                                        id: event.request.id,
                                                        response: {
                                                            type: 'success',
                                                            data: address,
                                                        },
                                                    })
                                                )
                                                .catch((e) => {
                                                    send({
                                                        type: 'rpc_response',
                                                        id: event.request.id,
                                                        response: {
                                                            type: 'failure',
                                                            reason: e,
                                                        },
                                                    })
                                                })
                                            break

                                        case 'debug_traceTransaction':
                                        case 'eth_blockNumber':
                                        case 'eth_call':
                                        case 'eth_estimateGas':
                                        case 'eth_gasPrice':
                                        case 'eth_getBalance':
                                        case 'eth_getBlockByNumber':
                                        case 'eth_getCode':
                                        case 'eth_getLogs':
                                        case 'eth_getTransactionByHash':
                                        case 'eth_getTransactionCount':
                                        case 'eth_getTransactionReceipt':
                                        case 'net_version':
                                        case 'web3_clientVersion':
                                        case 'eth_getStorageAt':
                                            proxyRPCResponse({
                                                request: request.data,
                                                network:
                                                    liveChangeNetworkRequest.current,
                                                networkRPCMap:
                                                    liveStorage.current
                                                        .networkRPCMap,
                                                dAppSiteInfo:
                                                    liveState.current.dApp,
                                            })
                                                .then((response) => {
                                                    send({
                                                        type: 'rpc_response',
                                                        id: event.request.id,
                                                        response: {
                                                            type: 'success',
                                                            data: response,
                                                        },
                                                    })
                                                })
                                                .catch((error) => {
                                                    const parsed = oneOf([
                                                        parseRPCError(
                                                            error
                                                        ).map(
                                                            ({ payload }) =>
                                                                payload
                                                        ),
                                                        parseUnexpectedFailureError(
                                                            error
                                                        ).map(
                                                            ({
                                                                error: {
                                                                    reason,
                                                                },
                                                            }) => reason
                                                        ),
                                                    ])

                                                    switch (parsed.type) {
                                                        case 'Success':
                                                            send({
                                                                type: 'rpc_response',
                                                                id: event
                                                                    .request.id,
                                                                response: {
                                                                    type: 'failure',
                                                                    reason: parsed.data,
                                                                },
                                                            })
                                                            break

                                                        case 'Failure':
                                                            send({
                                                                type: 'rpc_response',
                                                                id: event
                                                                    .request.id,
                                                                response: {
                                                                    type: 'failure',
                                                                    reason: error,
                                                                },
                                                            })
                                                            break

                                                        /* istanbul ignore next */
                                                        default:
                                                            return notReachable(
                                                                parsed
                                                            )
                                                    }
                                                })
                                            break
                                        default:
                                            notReachable(request.data)
                                    }
                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(liveState.current)
                            }
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(request)
                    }

                    break
                /* istanbul ignore next */
                default:
                    return notReachable(event)
            }
        }

        window.addEventListener('message', listener)

        const readyMsg: ReadyMsg = { type: 'ready' }
        send(readyMsg)

        return () => {
            window.removeEventListener('message', listener)
        }
    }, [
        liveChangeNetworkRequest,
        liveState,
        liveStorage,
        dAppUrl,
        liveNetworkMap,
    ])

    useEffect(() => {
        const listener = async () => {
            if (!document.hidden) {
                switch (liveState.current.type) {
                    case 'connected':
                        await toLocalStorage({
                            ...liveStorage.current,
                            selectedAddress: liveState.current.address,
                        })
                        break

                    case 'disconnected':
                    case 'not_interacted':
                    case 'connected_to_meta_mask':
                        break

                    default:
                        notReachable(liveState.current)
                }
            }
        }

        document.addEventListener('visibilitychange', listener)

        listener()

        return () => {
            document.removeEventListener('visibilitychange', listener)
        }
    }, [liveState, liveStorage])

    useLayoutEffect(() => {
        if (interactionRequest) {
            send({ type: 'change_iframe_size', size: 'large' })
        }
    }, [interactionRequest])

    switch (state.type) {
        case 'not_interacted':
        case 'disconnected':
            if (interactionRequest) {
                return (
                    <>
                        <DragAndDropBar
                            onMsg={(msg) => {
                                switch (msg.type) {
                                    case 'drag':
                                        send(msg)
                                        break
                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(msg.type)
                                }
                            }}
                        />
                        <Connect
                            alternativeProvider={alternativeProvider}
                            currencyHiddenMap={storage.currencyHiddenMap}
                            networkMap={networkMap}
                            networkRPCMap={storage.networkRPCMap}
                            customCurrencyMap={storage.customCurrencies}
                            requestedNetwork={changeNetworkRequest}
                            key={interactionRequest.id}
                            encryptedPassword={storage.encryptedPassword}
                            sessionPassword={sessionPassword}
                            connectionState={state}
                            initialAccount={storage.accounts[selectedAddress]}
                            portfolios={storage.portfolios}
                            keystores={storage.keystoreMap}
                            accounts={storage.accounts}
                            onMsg={async (msg) => {
                                switch (msg.type) {
                                    case 'on_user_confirmed_connection_with_safety_checks':
                                    case 'on_continue_with_meta_mask':
                                        {
                                            setInteractionRequest(null)

                                            storage.dApps[state.dApp.hostname] =
                                                {
                                                    type: 'connected_to_meta_mask',
                                                    dApp: state.dApp,
                                                }
                                            await toLocalStorage(storage)

                                            switch (interactionRequest.method) {
                                                case 'eth_requestAccounts':
                                                    send({
                                                        type: 'select_meta_mask_provider',
                                                        id: interactionRequest.id,
                                                        ethRequestAccounts:
                                                            interactionRequest,
                                                    })
                                                    break

                                                case 'eth_sendTransaction':
                                                case 'eth_signTypedData_v4':
                                                case 'eth_signTypedData_v3':
                                                case 'eth_signTypedData':
                                                case 'personal_sign':
                                                case 'wallet_addEthereumChain':
                                                    captureError(
                                                        new ImperativeError(
                                                            `${interactionRequest.method} method can't be first request in disconnected state`
                                                        )
                                                    )
                                                    break

                                                /* istanbul ignore next */
                                                default:
                                                    notReachable(
                                                        interactionRequest
                                                    )
                                            }
                                        }

                                        break

                                    case 'on_account_create_request':
                                        await toLocalStorage(
                                            addAccountsWithKeystores(
                                                storage,
                                                msg.accountsWithKeystores
                                            )
                                        )
                                        break

                                    case 'track_wallet_clicked':
                                        openCreateContactPage()
                                        break

                                    case 'add_wallet_clicked':
                                        openAddAccountPageTab()
                                        break

                                    case 'hardware_wallet_clicked':
                                        openAddFromHardwareWallet()
                                        break

                                    case 'session_password_decrypted':
                                        await chrome.storage.session.set({
                                            password: msg.sessionPassword,
                                        })
                                        await toLocalStorage(storage)
                                        break
                                    case 'lock_screen_close_click':
                                    case 'on_minimize_click':
                                    case 'reject_connection_button_click':
                                        setInteractionRequest(null)
                                        send(
                                            failureResponse(
                                                interactionRequest.id,
                                                userRejectedRequest()
                                            )
                                        )
                                        break

                                    case 'on_rpc_change_confirmed':
                                        liveStorage.current.networkRPCMap[
                                            msg.network.hexChainId
                                        ] = updateNetworkRPC({
                                            network: msg.network,
                                            initialRPCUrl: msg.initialRPCUrl,
                                            networkRPCMap:
                                                liveStorage.current
                                                    .networkRPCMap,
                                            rpcUrl: msg.rpcUrl,
                                        })
                                        await toLocalStorage(
                                            liveStorage.current
                                        )
                                        break

                                    case 'on_select_rpc_click':
                                        liveStorage.current.networkRPCMap[
                                            msg.network.hexChainId
                                        ] = msg.networkRPC
                                        await toLocalStorage(
                                            liveStorage.current
                                        )
                                        break

                                    case 'dApp_info_loaded': {
                                        const newStorage = updateDAppInfo(
                                            msg.dApp,
                                            liveStorage.current,
                                            state
                                        )

                                        await toLocalStorage(newStorage)
                                        break
                                    }

                                    case 'zeal_account_connected':
                                        setInteractionRequest(null)

                                        storage.dApps[state.dApp.hostname] = {
                                            type: 'connected',
                                            dApp: state.dApp,
                                            address: msg.account.address,
                                            networkHexId:
                                                msg.network.hexChainId,
                                            connectedAtMs: Date.now(),
                                        }
                                        storage.selectedAddress =
                                            msg.account.address
                                        setAccount(msg.account)
                                        setChangeNetworkRequest(msg.network)
                                        await toLocalStorage(storage)

                                        send({
                                            type: 'init_provider',
                                            chainId: msg.network.hexChainId,
                                            account: msg.account.address,
                                        })

                                        // ORDER can be important; at MM they set network & account on provider as property
                                        // during connection you can select both network and account
                                        // so on connect response you need to fire network update as well
                                        // but on some dApp (https://sunflower-land.com/play/) if found that on each "event" app trigger reconnect (enable() call)
                                        // this can lead to thousands of calls in loop

                                        switch (interactionRequest.method) {
                                            case 'eth_requestAccounts':
                                                send({
                                                    type: 'rpc_response',
                                                    id: interactionRequest.id,
                                                    response: {
                                                        type: 'success',
                                                        data: [
                                                            msg.account.address,
                                                        ],
                                                    },
                                                })
                                                break

                                            case 'eth_sendTransaction':
                                            case 'eth_signTypedData_v4':
                                            case 'eth_signTypedData_v3':
                                            case 'eth_signTypedData':
                                            case 'personal_sign':
                                            case 'wallet_addEthereumChain':
                                                captureError(
                                                    new ImperativeError(
                                                        `${interactionRequest.method} method can't be first request in disconnected state`
                                                    )
                                                )
                                                break

                                            /* istanbul ignore next */
                                            default:
                                                notReachable(interactionRequest)
                                        }

                                        break
                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(msg)
                                }
                            }}
                        />
                    </>
                )
            } else {
                switch (state.type) {
                    case 'not_interacted':
                        return null
                    case 'disconnected':
                        return (
                            <Disconnected
                                isOnboardingStorySeen={
                                    storage.isOnboardingStorySeen
                                }
                                state={state}
                                onMsg={(msg) => {
                                    switch (msg.type) {
                                        case 'disconnected_state_expanded':
                                            send({
                                                type: 'change_iframe_size',
                                                size: 'large_with_full_screen_takeover',
                                            })
                                            break
                                        case 'disconnected_state_minimized':
                                            send({
                                                type: 'change_iframe_size',
                                                size: 'icon',
                                            })
                                            break
                                        case 'connection_story_seen':
                                            toLocalStorage({
                                                ...storage,
                                                isOnboardingStorySeen: true,
                                            })
                                            break
                                        case 'drag':
                                            send(msg)
                                            break
                                        /* istanbul ignore next */
                                        default:
                                            return notReachable(msg)
                                    }
                                }}
                            />
                        )
                    /* istanbul ignore next */
                    default:
                        return notReachable(state)
                }
            }

        case 'connected': {
            return (
                <Connected
                    account={account}
                    alternativeProvider={alternativeProvider}
                    currencyHiddenMap={storage.currencyHiddenMap}
                    feePresetMap={storage.feePresetMap}
                    networkMap={networkMap}
                    networkRPCMap={storage.networkRPCMap}
                    installationId={installationId}
                    encryptedPassword={storage.encryptedPassword}
                    customCurrencyMap={storage.customCurrencies}
                    connectionState={state}
                    ethNetworkChange={changeNetworkRequest}
                    interactionRequest={interactionRequest}
                    accounts={storage.accounts}
                    keystores={storage.keystoreMap}
                    portfolios={storage.portfolios}
                    sessionPassword={sessionPassword}
                    onMsg={async (msg) => {
                        switch (msg.type) {
                            case 'on_continue_with_meta_mask':
                                storage.dApps[state.dApp.hostname] = {
                                    type: 'connected_to_meta_mask',
                                    dApp: state.dApp,
                                }
                                await toLocalStorage(storage)
                                send({
                                    type: 'select_meta_mask_provider',
                                    id: generateRandomNumber(), // we don't really have any demand from dapp, but we also don't know if dapp is connected to MM, so we try to send eth_requestAccounts with fake id
                                    ethRequestAccounts: {
                                        method: 'eth_requestAccounts',
                                        params: [],
                                    },
                                })
                                break

                            case 'disconnect_button_click':
                                send({
                                    type: 'disconnect',
                                })

                                storage.dApps[state.dApp.hostname] = {
                                    type: 'disconnected',
                                    networkHexId: state.networkHexId,
                                    dApp: state.dApp,
                                }
                                await toLocalStorage(storage)

                                break

                            case 'account_item_clicked':
                                await toLocalStorage({
                                    ...storage,
                                    selectedAddress: msg.account.address,
                                    dApps: {
                                        ...storage.dApps,
                                        [dAppUrl]: {
                                            type: 'connected',
                                            address: msg.account.address,
                                            networkHexId: state.networkHexId,
                                            dApp: state.dApp,
                                            connectedAtMs: Date.now(),
                                        },
                                    },
                                })

                                send({
                                    type: 'account_change',
                                    account: msg.account.address,
                                })

                                setAccount(msg.account)

                                break
                            case 'track_wallet_clicked':
                                openCreateContactPage()
                                break

                            case 'on_account_create_request':
                                await toLocalStorage(
                                    addAccountsWithKeystores(
                                        storage,
                                        msg.accountsWithKeystores
                                    )
                                )
                                setAccount(msg.accountsWithKeystores[0].account)
                                break

                            case 'import_keys_button_clicked':
                            case 'add_wallet_clicked':
                                openAddAccountPageTab()
                                break

                            case 'hardware_wallet_clicked':
                                openAddFromHardwareWallet()
                                break

                            case 'on_network_item_click': {
                                switch (msg.network.type) {
                                    case 'all_networks':
                                        throw new ImperativeError(
                                            'All networks not possible in ZWidget'
                                        )

                                    case 'specific_network':
                                        setChangeNetworkRequest(
                                            msg.network.network
                                        )
                                        send({
                                            type: 'network_change',
                                            chainId:
                                                msg.network.network.hexChainId,
                                        })
                                        storage.dApps[dAppUrl] = {
                                            type: 'connected',
                                            address: state.address,
                                            networkHexId:
                                                msg.network.network.hexChainId,
                                            dApp: state.dApp,
                                            connectedAtMs: Date.now(),
                                        }
                                        await toLocalStorage(storage)
                                        break

                                    default:
                                        notReachable(msg.network)
                                }
                                break
                            }
                            case 'expanded':
                                send({
                                    type: 'change_iframe_size',
                                    size: 'large',
                                })
                                break
                            case 'minimized':
                                send({
                                    type: 'change_iframe_size',
                                    size: 'icon',
                                })
                                break
                            case 'session_password_decrypted':
                                await chrome.storage.session.set({
                                    password: msg.sessionPassword,
                                })
                                await toLocalStorage(storage)
                                break
                            case 'drag':
                                send(msg)
                                break

                            case 'on_cancel_confirm_transaction_clicked':
                            case 'on_sign_cancel_button_clicked':
                            case 'transaction_cancel_success':
                            case 'close':
                                // TODO: this is trx close, ref
                                setInteractionRequest(null)
                                // TODO :: fix composition to avoid !
                                send(
                                    failureResponse(
                                        interactionRequest!.id,
                                        userRejectedRequest()
                                    )
                                )
                                break

                            case 'transaction_failure_accepted': {
                                const { transactionRequest } = msg
                                const { account } = transactionRequest
                                await toLocalStorage({
                                    ...storage,
                                    transactionRequests: {
                                        [account.address]:
                                            removeTransactionRequest(
                                                storage.transactionRequests[
                                                    account.address
                                                ],
                                                msg.transactionRequest
                                            ),
                                    },
                                })
                                // TODO: this is trx close, ref
                                setInteractionRequest(null)
                                // TODO :: fix composition to avoid !
                                send(
                                    failureResponse(
                                        interactionRequest!.id,
                                        userRejectedRequest()
                                    )
                                )
                                break
                            }

                            case 'cancel_button_click':
                                setInteractionRequest(null)
                                send(
                                    failureResponse(
                                        interactionRequest!.id,
                                        userRejectedRequest()
                                    )
                                )
                                break
                            case 'message_signed':
                                setInteractionRequest(null)
                                send({
                                    type: 'rpc_response',
                                    // TODO: fix composition
                                    id: interactionRequest!.id,
                                    response: {
                                        type: 'success',
                                        data: msg.signature,
                                    },
                                })
                                break

                            case 'transaction_cancel_failure_accepted': {
                                setInteractionRequest(null)

                                const { transactionRequest } = msg
                                const { account } = transactionRequest
                                await toLocalStorage({
                                    ...storage,
                                    transactionRequests: {
                                        [account.address]:
                                            removeTransactionRequest(
                                                storage.transactionRequests[
                                                    account.address
                                                ],
                                                cancelSubmittedToSubmitted(
                                                    msg.transactionRequest
                                                )
                                            ),
                                    },
                                })
                                break
                            }

                            case 'on_transaction_completed_splash_animation_screen_competed':
                                const { transactionRequest } = msg
                                const { account } = transactionRequest
                                await toLocalStorage({
                                    ...storage,
                                    transactionRequests: {
                                        [account.address]:
                                            removeTransactionRequest(
                                                storage.transactionRequests[
                                                    account.address
                                                ],
                                                msg.transactionRequest
                                            ),
                                    },
                                })
                                break

                            case 'on_predefined_fee_preset_selected':
                                await toLocalStorage(
                                    saveFeePreset({
                                        storage,
                                        feePreset: msg.preset,
                                        networkHexId: msg.networkHexId,
                                    })
                                )
                                break

                            case 'on_completed_transaction_close_click':
                                setInteractionRequest(null)
                                break
                            case 'cancel_submitted': {
                                const from =
                                    msg.transactionRequest.account.address

                                const removed = storage.transactionRequests[
                                    from
                                ]
                                    ? removeTransactionRequest(
                                          storage.transactionRequests[from],
                                          msg.transactionRequest
                                      )
                                    : []

                                await toLocalStorage({
                                    ...storage,
                                    transactionRequests: {
                                        ...storage.transactionRequests,
                                        [from]: removed,
                                    },
                                })
                                break
                            }
                            case 'transaction_submited':
                                const existingRequests = storage
                                    .transactionRequests[state.address]
                                    ? removeTransactionRequest(
                                          storage.transactionRequests[
                                              state.address
                                          ],
                                          msg.transactionRequest
                                      )
                                    : []

                                storage.transactionRequests[state.address] = [
                                    msg.transactionRequest,
                                    ...existingRequests,
                                ]
                                await toLocalStorage(storage)
                                send({
                                    type: 'rpc_response',
                                    // TODO: fix composition
                                    id: interactionRequest!.id,
                                    response: {
                                        type: 'success',
                                        data: msg.transactionRequest
                                            .submitedTransaction.hash,
                                    },
                                })
                                break

                            case 'on_transaction_relayed':
                                setInteractionRequest(null)
                                send({
                                    type: 'rpc_response',
                                    // TODO: fix composition
                                    id: interactionRequest!.id,
                                    response: {
                                        type: 'success',
                                        data: msg.transactionHash,
                                    },
                                })
                                break

                            case 'on_network_add_clicked':
                                const { customNetwork } = msg

                                liveStorage.current.customNetworkMap[
                                    customNetwork.hexChainId
                                ] = customNetwork

                                await toLocalStorage(liveStorage.current)

                                setChangeNetworkRequest(customNetwork)

                                setInteractionRequest(null)

                                send({
                                    type: 'rpc_response',
                                    // TODO: fix composition
                                    id: interactionRequest!.id,
                                    response: {
                                        type: 'success',
                                        data: null,
                                    },
                                })
                                break

                            case 'on_rpc_change_confirmed':
                                liveStorage.current.networkRPCMap[
                                    msg.network.hexChainId
                                ] = updateNetworkRPC({
                                    network: msg.network,
                                    initialRPCUrl: msg.initialRPCUrl,
                                    networkRPCMap:
                                        liveStorage.current.networkRPCMap,
                                    rpcUrl: msg.rpcUrl,
                                })
                                await toLocalStorage(liveStorage.current)
                                break

                            case 'on_select_rpc_click':
                                liveStorage.current.networkRPCMap[
                                    msg.network.hexChainId
                                ] = msg.networkRPC
                                await toLocalStorage(liveStorage.current)
                                break

                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )
        }

        case 'connected_to_meta_mask':
            return (
                <ConnectedToMetaMask
                    connectionState={state}
                    initialAccount={storage.accounts[selectedAddress]}
                    portfolios={storage.portfolios}
                    keystores={storage.keystoreMap}
                    accounts={storage.accounts}
                    requestedNetwork={changeNetworkRequest}
                    interactionRequest={interactionRequest}
                    sessionPassword={sessionPassword}
                    encryptedPassword={storage.encryptedPassword}
                    customCurrencyMap={storage.customCurrencies}
                    networkRPCMap={storage.networkRPCMap}
                    networkMap={networkMap}
                    currencyHiddenMap={storage.currencyHiddenMap}
                    alternativeProvider={alternativeProvider}
                    onMsg={async (msg) => {
                        switch (msg.type) {
                            case 'expanded':
                                send({
                                    type: 'change_iframe_size',
                                    size: 'large',
                                })
                                break
                            case 'minimized':
                                send({
                                    type: 'change_iframe_size',
                                    size: 'icon',
                                })
                                break

                            case 'zeal_account_connected':
                                storage.dApps[state.dApp.hostname] = {
                                    type: 'connected',
                                    dApp: state.dApp,
                                    address: msg.account.address,
                                    networkHexId: msg.network.hexChainId,
                                    connectedAtMs: Date.now(),
                                }
                                storage.selectedAddress = msg.account.address
                                setChangeNetworkRequest(msg.network)
                                await toLocalStorage(storage)

                                send({
                                    type: 'switch_to_zeal_provider_requested',
                                    chainId: msg.network.hexChainId,
                                    account: msg.account.address,
                                })

                                break

                            case 'session_password_decrypted':
                                await chrome.storage.session.set({
                                    password: msg.sessionPassword,
                                })
                                await toLocalStorage(storage)
                                break
                            case 'on_select_rpc_click':
                                liveStorage.current.networkRPCMap[
                                    msg.network.hexChainId
                                ] = msg.networkRPC
                                await toLocalStorage(liveStorage.current)
                                break
                            case 'on_rpc_change_confirmed':
                                liveStorage.current.networkRPCMap[
                                    msg.network.hexChainId
                                ] = updateNetworkRPC({
                                    network: msg.network,
                                    initialRPCUrl: msg.initialRPCUrl,
                                    networkRPCMap:
                                        liveStorage.current.networkRPCMap,
                                    rpcUrl: msg.rpcUrl,
                                })
                                await toLocalStorage(liveStorage.current)
                                break

                            case 'dApp_info_loaded':
                                const newStorage = updateDAppInfo(
                                    msg.dApp,
                                    liveStorage.current,
                                    state
                                )
                                await toLocalStorage(newStorage)
                                break

                            case 'on_account_create_request':
                                await toLocalStorage(
                                    addAccountsWithKeystores(
                                        storage,
                                        msg.accountsWithKeystores
                                    )
                                )
                                break
                            case 'track_wallet_clicked':
                                openCreateContactPage()
                                break
                            case 'add_wallet_clicked':
                                openAddAccountPageTab()
                                break
                            case 'hardware_wallet_clicked':
                                openAddFromHardwareWallet()
                                break
                            case 'drag':
                                send(msg)
                                break

                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}

const isRPCSupported = (network: Network | null): boolean => {
    if (!network) {
        return false
    }

    switch (network.type) {
        case 'predefined':
        case 'testnet':
            return network.isZealRPCSupported
        case 'custom':
            return true
        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}

const parseExtensionToZWidgetMessage = (
    input: unknown
): Result<unknown, ExtensionToZWidget> =>
    object(input).andThen((obj) =>
        shape({
            type: match(obj.type, 'extension_address_change' as const),
            address: parseAddress(obj.address),
        })
    )
