import { CryptoCurrency } from '@zeal/domains/Currency'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { SafeV0 } from '@zeal/domains/KeyStore'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { AppErrorPopup } from 'src/domains/Error/components/AppErrorPopup'
import { getPredictedSafeInstance } from 'src/domains/KeyStore/helpers/getPredictedSafeInstance'
import { LoadingLayout } from 'src/uikit/LoadingLayout'
import { Confirm } from './Confirm'
import { DeployAndConfirm } from './DeployAndConfirm'

type Props = {
    keyStore: SafeV0
    network: Network
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
    rpcRequestToBundle: EthSendTransaction
    gasCurrency: CryptoCurrency
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof Confirm> | MsgOf<typeof DeployAndConfirm>

const checkSafeDeployed = async ({
    keyStore,
    networkRPCMap,
    network,
    sessionPassword,
}: {
    network: Network
    keyStore: SafeV0
    networkRPCMap: NetworkRPCMap
    sessionPassword: string // FIXME @resetko-zeal we can do that without session password, eth_getCode
}): Promise<boolean> => {
    const safe = await getPredictedSafeInstance({
        safeDeplymentConfig: keyStore.safeDeplymentConfig,
        network,
        networkRPCMap,
        sessionPassword,
    })

    return safe.isSafeDeployed()
}

export const SafeDeploymentFork = ({
    onMsg,
    keyStore,
    networkRPCMap,
    sessionPassword,
    rpcRequestToBundle,
    gasCurrency,
    network,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(checkSafeDeployed, {
        type: 'loading',
        params: {
            keyStore,
            networkRPCMap,
            sessionPassword,
            network,
        },
    })

    switch (loadable.type) {
        case 'loading':
            return <LoadingLayout actionBar={null} />

        case 'loaded':
            return loadable.data ? (
                <Confirm
                    gasCurrency={gasCurrency}
                    network={network}
                    keyStore={keyStore}
                    networkRPCMap={networkRPCMap}
                    onMsg={onMsg}
                    rpcRequestToBundle={rpcRequestToBundle}
                    sessionPassword={sessionPassword}
                />
            ) : (
                <DeployAndConfirm
                    gasCurrency={gasCurrency}
                    network={network}
                    keyStore={keyStore}
                    networkRPCMap={networkRPCMap}
                    onMsg={onMsg}
                    rpcRequestToBundle={rpcRequestToBundle}
                    sessionPassword={sessionPassword}
                />
            )

        case 'error':
            return (
                <AppErrorPopup
                    error={parseAppError(loadable.error)}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg({ type: 'on_sign_cancel_button_clicked' })
                                break

                            case 'try_again_clicked':
                                setLoadable({
                                    type: 'loading',
                                    params: loadable.params,
                                })
                                break

                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
