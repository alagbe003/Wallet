import { Provider } from './/Provider'
import { ProviderAnnouncementMsg } from '@zeal/domains/Main'
import { notReachable } from '@zeal/toolkit'
import { parseContentScriptToInPageScript } from 'src/domains/Main/parsers/parseZwidgetContentMsgs'

type Params = {
    window: Window
    id: string
}

declare global {
    interface Window {
        ethereum?: Provider
    }
}
type State = {
    currentProvider: Provider
    alternativeProvider?: Provider
}

const EIP6963ProviderInfo = {
    uuid: 'ee00e916-4c02-11ee-be56-0242ac120002',
    name: 'Zeal',
    icon: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><rect width='32' height='32' rx='10.3333' fill='%2300FFFF'/><path d='M7.44031 24.5598H24.5597V16.8561H10.8642C8.97323 16.8561 7.44031 18.389 7.44031 20.28V24.5598Z' fill='%230B1821'/><path d='M24.5597 7.44043H7.44031V15.1442H21.1358C23.0268 15.1442 24.5597 13.6112 24.5597 11.7203V7.44043Z' fill='%230B1821'/></svg>`,
    rdns: 'app.zeal',
}

export const injectInpageScript = ({ id, window }: Params): void => {
    const bcm = new BroadcastChannel(id)
    const provider = new Provider(bcm)

    Object.defineProperty(window, 'zeal', {
        value: provider,
        writable: false,
    })

    try {
        const state: State = {
            currentProvider: provider,
            alternativeProvider: window.ethereum,
        }
        if (window.ethereum) {
            //
            ;(state.currentProvider as any)._events = (
                window.ethereum as any
            )._events
        }

        const proxyProvider = new Proxy(
            {},
            {
                get(_, property: keyof Provider) {
                    return state.currentProvider[property]
                },
            }
        )

        Object.defineProperty(window, 'ethereum', {
            configurable: false,
            get() {
                return proxyProvider
            },
            set(provider: Provider) {
                state.alternativeProvider = provider
                const msg: ProviderAnnouncementMsg = {
                    type: 'provider_announcement_msg',
                    provider: state.alternativeProvider
                        ? 'metamask'
                        : 'provider_unavailable',
                }
                bcm.postMessage(msg)
            },
        })

        // order is matter if we are not the fist in race condition for window.ethereum above defineProperty will throw and we will leak a subscription

        bcm.addEventListener('message', (event: MessageEvent<unknown>) => {
            const parsed = parseContentScriptToInPageScript(event.data)
            switch (parsed.type) {
                case 'Failure':
                    break
                case 'Success':
                    const { data } = parsed
                    switch (data.type) {
                        case 'provider_announcement_msg':
                        case 'rpc_request':
                            // coming from iframe
                            break

                        case 'disconnect':
                        case 'rpc_response':
                        case 'account_change':
                        case 'network_change':
                        case 'init_provider':
                            // should be handled by provider
                            break

                        case 'zwidget_connected_to_meta_mask':
                            if (!state.alternativeProvider) {
                                //TODO report, we need to understand impact of Sentry in inpage script
                                break
                            }
                            state.currentProvider = state.alternativeProvider
                            ;(state.currentProvider as any)._events = (
                                provider as any
                            )._events
                            provider.selectedAddress = undefined

                            break

                        case 'switch_to_zeal_provider_requested': {
                            ;(provider as any)._events = (
                                state.currentProvider as any
                            )._events

                            state.currentProvider = provider
                            state.currentProvider.selectedAddress = data.account
                            state.currentProvider.chainId = data.chainId
                            // lot of dApps didn't accept emitted event on the same tick, dunno why
                            setTimeout(() => {
                                state.currentProvider.emitNetworkChangeEvents(
                                    data.chainId
                                )
                            }, 0)

                            break
                        }
                        case 'select_meta_mask_provider': {
                            const resolver = provider.cache[data.id]
                            delete provider.cache[data.id]

                            if (!state.alternativeProvider) {
                                //TODO report, we need to understand impact of Sentry in inpage script

                                if (resolver) {
                                    // we need to respond to dApp otherwise dApp will not be able to recover
                                    // but zwidget and provider currently in out of zync state (I can reproduce when MM was disabled or deleted after connecting to MM via zeal)
                                    // but error we should send to dApp?
                                    resolver.reject({
                                        code: 4001,
                                        message: 'User Rejected Request',
                                    })
                                }

                                break
                            }

                            state.currentProvider = state.alternativeProvider
                            ;(state.currentProvider as any)._events = (
                                provider as any
                            )._events

                            const request = state.currentProvider.request({
                                id: data.id,
                                params: data.ethRequestAccounts.params,
                                method: data.ethRequestAccounts.method,
                            })

                            // if we use selectedAddress = undefined we will emit disconnect event and app will wait for user input
                            provider._selectedAddress = undefined

                            if (resolver) {
                                request
                                    .then(resolver.resolve)
                                    .catch(resolver.reject)
                            } else {
                                // If MM in the connected state it will not emit account change event
                                request.then((addresses) => {
                                    provider.emit('accountsChanged', addresses)
                                })
                            }

                            break
                        }
                        /* istanbul ignore next */
                        default:
                            return notReachable(data)
                    }
                    break
                /* istanbul ignore next */
                default:
                    return notReachable(parsed)
            }
        })

        const msg: ProviderAnnouncementMsg = {
            type: 'provider_announcement_msg',
            provider: state.alternativeProvider
                ? 'metamask'
                : 'provider_unavailable',
        }
        bcm.postMessage(msg)
    } catch (e) {
        // @ts-ignore
        window.ethereum = provider
    }

    window.dispatchEvent(new Event('ethereum#initialized'))

    const announceProvider = () => {
        window.dispatchEvent(
            new CustomEvent('eip6963:announceProvider', {
                detail: Object.freeze({
                    info: EIP6963ProviderInfo,
                    provider,
                }),
            })
        )
    }

    window.addEventListener('eip6963:requestProvider', announceProvider)
    announceProvider()
}
