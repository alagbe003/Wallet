import { Account } from '@zeal/domains/Account'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStore } from '@zeal/domains/KeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'
import {
    EthSignTypedData,
    EthSignTypedDataV3,
    EthSignTypedDataV4,
    PersonalSign,
} from '@zeal/domains/RPCRequest'

import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { fetchSimulatedSignMessage } from 'src/domains/RPCRequest/domains/SignMessageSimulation/api/fetchSimulatedSignMessage'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { FormattedMessage, useIntl } from 'react-intl'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { IconButton } from 'src/uikit'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { Content } from '@zeal/uikit/Content'
import { Screen } from '@zeal/uikit/Screen'
import { NoSimulation, State as FormVisualState } from './NoSimulation'
import { Simulation } from './Simulation'

type Props = {
    keyStore: KeyStore
    request:
        | PersonalSign
        | EthSignTypedDataV4
        | EthSignTypedData
        | EthSignTypedDataV3

    isLoading: boolean

    account: Account
    dApp: DAppSiteInfo
    network: Network
    networkMap: NetworkMap

    state: VisualState

    onMsg: (msg: Msg) => void
}

export type VisualState = FormVisualState

type Msg =
    | MsgOf<typeof NoSimulation>
    | Extract<
          MsgOf<typeof Simulation>,
          {
              type:
                  | 'cancel_button_click'
                  | 'sign_click'
                  | 'import_keys_button_clicked'
          }
      >

export const Flow = ({
    account,
    dApp,
    keyStore,
    network,
    networkMap,
    onMsg,
    request,
    state,
    isLoading,
}: Props) => {
    const { formatMessage } = useIntl()
    const [loadable] = useLoadableData(fetchSimulatedSignMessage, {
        type: 'loading',
        params: {
            request,
            network,
        },
    })

    switch (loadable.type) {
        case 'loading':
            return (
                <Screen background="light" padding="form">
                    <ActionBar
                        keystore={keyStore}
                        network={network}
                        account={account}
                        right={
                            <IconButton
                                onClick={() =>
                                    onMsg({ type: 'on_minimize_click' })
                                }
                                aria-label={formatMessage({
                                    id: 'actions.minimize',
                                    defaultMessage: 'Minimize',
                                })}
                            >
                                <CloseCross size={24} />
                            </IconButton>
                        }
                    />

                    <Content>
                        <Content.Splash
                            onAnimationComplete={null}
                            variant="spinner"
                            title={
                                <FormattedMessage
                                    id="Sign.Simuation.Skeleton.title"
                                    defaultMessage="Simulating..."
                                />
                            }
                        />
                    </Content>
                </Screen>
            )

        case 'loaded': {
            switch (loadable.data.type) {
                case 'not_supported':
                case 'failed':
                    return (
                        <NoSimulation
                            account={account}
                            dApp={dApp}
                            isLoading={isLoading}
                            keyStore={keyStore}
                            network={network}
                            onMsg={onMsg}
                            request={loadable.params.request}
                            state={state}
                        />
                    )

                case 'simulated':
                    return (
                        <Simulation
                            account={account}
                            request={loadable.params.request}
                            isLoading={isLoading}
                            keyStore={keyStore}
                            dApp={dApp}
                            simulationResponse={
                                loadable.data.simulationResponse
                            }
                            network={network}
                            state={state}
                            networkMap={networkMap}
                            onMsg={(msg) => {
                                switch (msg.type) {
                                    case 'cancel_button_click':
                                    case 'sign_click':
                                    case 'import_keys_button_clicked':
                                    case 'on_minimize_click':
                                    case 'on_expand_request':
                                    case 'drag':
                                        onMsg(msg)
                                        break
                                    default:
                                        notReachable(msg)
                                }
                            }}
                        />
                    )

                default:
                    return notReachable(loadable.data)
            }
        }

        case 'error':
            return (
                <NoSimulation
                    account={account}
                    dApp={dApp}
                    isLoading={isLoading}
                    keyStore={keyStore}
                    network={network}
                    onMsg={onMsg}
                    request={loadable.params.request}
                    state={state}
                />
            )

        default:
            return notReachable(loadable)
    }
}
