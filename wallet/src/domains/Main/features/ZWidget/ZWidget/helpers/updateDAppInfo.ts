import { DAppSiteInfo } from '@zeal/domains/DApp'
import { Storage } from '@zeal/domains/Storage'
import { ConnectionState } from 'src/domains/DApp/domains/ConnectionState'
import { notReachable } from '@zeal/toolkit'
import { DEFAULT_NETWORK } from '@zeal/domains/Network/constants'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { ImperativeError } from '@zeal/domains/Error'

export const updateDAppInfo = (
    dAppInfo: DAppSiteInfo,
    storage: Storage,
    connectionState: ConnectionState
): Storage => {
    if (connectionState.dApp.hostname !== dAppInfo.hostname) {
        captureError(new ImperativeError('Iframe URL and Check not matching'), {
            extra: {
                dAppUrl: connectionState.dApp.hostname,
                msg: dAppInfo.hostname,
            },
        })
        return storage
    }

    switch (connectionState.type) {
        case 'not_interacted':
            return {
                ...storage,
                dApps: {
                    ...storage.dApps,
                    [dAppInfo.hostname]: {
                        type: 'disconnected',
                        dApp: dAppInfo,
                        networkHexId: DEFAULT_NETWORK.hexChainId,
                    },
                },
            }
        case 'disconnected':
        case 'connected':
        case 'connected_to_meta_mask':
            return {
                ...storage,
                dApps: {
                    ...storage.dApps,
                    [dAppInfo.hostname]: {
                        ...connectionState,
                        dApp: dAppInfo,
                    },
                },
            }
        /* istanbul ignore next */
        default:
            return notReachable(connectionState)
    }
}
