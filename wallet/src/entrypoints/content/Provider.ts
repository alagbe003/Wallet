import { EventEmitter } from 'eventemitter3'
import { RPCRequestMsg } from '@zeal/domains/Main'
import { notReachable } from '@zeal/toolkit'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { parseContentScriptToInPageScript } from 'src/domains/Main/parsers/parseZwidgetContentMsgs'

type Resolver<T = unknown, E = unknown> = {
    resolve: (payload: T) => void
    reject: (e: E) => void
}

type RPCResponse =
    | {
          id?: number
          jsonrpc: '2.0'
          method: string
          result: unknown
      }
    | {
          id?: number
          jsonrpc: '2.0'
          method: string
          error: Error
      }

export class Provider<
    Request extends { id: any; method: string; params: unknown[] } = {
        id: any
        method: string
        params: unknown[]
    }
> extends EventEmitter {
    private _bcm: BroadcastChannel
    public _selectedAddress?: string
    private _chainId: string = '0x1'

    public cache: Record<string, Resolver<unknown, unknown>> = {}

    isMetaMask = true
    isZeal: true | undefined = true

    // MM internal state 👨‍🦼
    _state = {
        initialized: true,
    }
    _metamask = {
        isUnlocked: async () => {
            return true
        },
    }

    isConnected() {
        return true
    }

    enable(...args: any[]) {
        return this.request({ method: 'eth_requestAccounts' } as any)
    }

    get networkVersion() {
        return `${parseInt(this._chainId, 16)}`
    }

    set selectedAddress(newAddress: string | undefined) {
        if (newAddress !== this._selectedAddress) {
            this._selectedAddress = newAddress

            if (!this._selectedAddress) {
                const e = new Error('User disconnect app')
                this.emit('disconnect', e)
                this.emit('close', e)
                this.emit('accountsChanged', [])
            } else {
                this.emit('accountsChanged', [this._selectedAddress])
            }
        }
    }

    set chainId(newChainId: string) {
        if (newChainId !== this._chainId) {
            this._chainId = newChainId
            this.emitNetworkChangeEvents(this._chainId)
        }
    }

    network_version() {
        return this.request({ method: 'net_version' } as any)
    }

    public emitNetworkChangeEvents(chainId: string) {
        this.emit('chainChanged', chainId)
        this.emit('networkChanged', `${parseInt(chainId, 16)}`)
    }

    constructor(bcm: BroadcastChannel) {
        super()

        this.isConnected = this.isConnected.bind(this)
        this.enable = this.enable.bind(this)
        this.network_version = this.network_version.bind(this)
        this.sendAsync = this.sendAsync.bind(this)
        this.send = this.send.bind(this)
        this.request = this.request.bind(this)

        if (disableIsZeal()) {
            this.isZeal = undefined
        }

        this._bcm = bcm
        this._bcm.addEventListener(
            'message',
            (event: MessageEvent<unknown>) => {
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

                            case 'select_meta_mask_provider':
                            case 'switch_to_zeal_provider_requested':
                            case 'zwidget_connected_to_meta_mask':
                                // we should handle it outside
                                break

                            case 'disconnect':
                                this.selectedAddress = undefined
                                break
                            case 'account_change':
                                this.selectedAddress = data.account

                                break
                            case 'rpc_response':
                                {
                                    const { response, id } = data
                                    const resolver = this.cache[id]
                                    if (!resolver) {
                                        // Since there could be more than one provider connected to same BCM
                                        // We might not have resolver for the request
                                        return
                                    }

                                    delete this.cache[id]

                                    const { reject, resolve } = resolver

                                    // TODO :: every time account or network change request made we need to update chainId && selectedAccount

                                    switch (response.type) {
                                        case 'success':
                                            resolve(response.data)
                                            break
                                        case 'failure':
                                            // TODO :: you MUST have property message here or some apps may not work
                                            reject(response.reason)
                                            break
                                        /* istanbul ignore next */
                                        default:
                                            return notReachable(response)
                                    }
                                }
                                break

                            case 'network_change':
                                this.chainId = data.chainId
                                break

                            case 'init_provider':
                                this.chainId = data.chainId
                                this.selectedAddress = data.account ?? undefined
                                break

                            /* istanbul ignore next */
                            default:
                                return notReachable(data)
                        }
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(parsed)
                }
            }
        )
        this.emit('_initialized')
    }

    sendAsync(
        payload: Request,
        callback?: (error: Error | undefined, res: RPCResponse) => void
    ): Promise<unknown> {
        return this.request(payload)
            .then((res) => {
                callback &&
                    callback(undefined, {
                        id: payload.id,
                        jsonrpc: '2.0',
                        method: payload.method,
                        result: res,
                    })
                return res
            })
            .catch((e) => {
                callback &&
                    callback(e, {
                        id: payload.id,
                        jsonrpc: '2.0',
                        method: payload.method,
                        error: e,
                    })
                throw e
            })
    }

    // https://docs.metamask.io/guide/ethereum-provider.html#ethereum-send-deprecated
    send(
        methodOrPayload: Request | string,
        paramsOrCallback?:
            | unknown[]
            | ((error: Error | undefined, res: RPCResponse) => void)
    ) {
        if (methodOrPayload === 'eth_accounts') {
            return [this._selectedAddress]
        } else if (
            typeof methodOrPayload === 'string' &&
            (!paramsOrCallback || Array.isArray(paramsOrCallback))
        ) {
            const request = {
                method: methodOrPayload,
                params: paramsOrCallback || [],
            } as Request
            return this.sendAsync(request)
        } else if (
            typeof methodOrPayload === 'object' &&
            paramsOrCallback instanceof Function
        ) {
            return this.sendAsync(methodOrPayload, paramsOrCallback)
        } else {
            throw new Error(`un supported sync call to send ${methodOrPayload}`)
        }
    }

    request(payload: Request): Promise<unknown> {
        const rpcRequestMessage: RPCRequestMsg = {
            type: 'rpc_request',
            request: {
                id: generateRandomNumber(),
                method: payload.method,
                params: payload.params,
            },
        }

        return new Promise<unknown>((resolve, reject) => {
            this.cache[rpcRequestMessage.request.id] = { resolve, reject }
            this._bcm.postMessage(rpcRequestMessage)
        })
    }
}

// The following Dapps use a version of Blocknative that is incompatible with Zeal; they cannot connect.
// TODO: check that the sites have been updated and remove them from the list.
const disableIsZeal = () => {
    return ['app.angle.money', 'app.eralend.com'].includes(
        window?.location?.hostname
    )
}
