import { Button, IconButton } from 'src/uikit'

import { Simulated } from '@zeal/domains/TransactionRequest'
import { FormattedMessage } from 'react-intl'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { notReachable } from '@zeal/toolkit'
import { Minimized, Msg as MinimizedMsg } from 'src/uikit/Minimized'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { Column2 } from 'src/uikit/Column2'
import { Row } from '@zeal/uikit/Row'
import { Content } from 'src/uikit/Layout/Content'
import { TransactionHeader } from 'src/domains/TransactionRequest/components/TransactionHeader'
import { Progress2 } from 'src/uikit/Progress/Progress2'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { NetworkMap } from '@zeal/domains/Network'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'

type Props = {
    transactionRequest: Simulated
    keystores: KeyStoreMap
    networkMap: NetworkMap
    state: State
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'on_minimize_click' } | MinimizedMsg

export type State = { type: 'minimised' } | { type: 'maximised' }

export const Layout = ({
    transactionRequest,
    keystores,
    onMsg,
    state,
    networkMap,
}: Props) => {
    const { account } = transactionRequest
    const network = findNetworkByHexChainId(
        transactionRequest.networkHexId,
        networkMap
    )

    switch (state.type) {
        case 'minimised':
            return <Minimized onMsg={onMsg} />
        case 'maximised':
            return (
                <Layout2 background="light" padding="form">
                    <ActionBar
                        keystore={getKeyStore({
                            keyStoreMap: keystores,
                            address: transactionRequest.account.address,
                        })}
                        account={account}
                        network={network}
                        right={
                            <IconButton
                                onClick={() => {
                                    onMsg({ type: 'on_minimize_click' })
                                }}
                            >
                                <CloseCross size={24} />
                            </IconButton>
                        }
                    />
                    <Column2
                        spacing={12}
                        style={{ overflowY: 'auto', flex: '1' }}
                    >
                        <Content
                            header={
                                <TransactionHeader
                                    networkMap={networkMap}
                                    transactionRequest={transactionRequest}
                                    simulationResult={
                                        transactionRequest.simulation
                                    }
                                />
                            }
                            footer={
                                <Progress2
                                    title={
                                        <FormattedMessage
                                            id="submitTransaction.state.sendingToNetwork"
                                            defaultMessage="Sending to network"
                                        />
                                    }
                                    variant="neutral"
                                    initialProgress={0}
                                    progress={0.1}
                                />
                            }
                        >
                            <Content.Splash
                                onAnimationComplete={null}
                                variant="paper-plane"
                                title={
                                    <FormattedMessage
                                        id="submitTransaction.state.sendingToNetwork"
                                        defaultMessage="Sending to network"
                                    />
                                }
                            />
                        </Content>

                        <Row spacing={8}>
                            <Button size="regular" variant="secondary" disabled>
                                <FormattedMessage
                                    id="submitTransaction.stop"
                                    defaultMessage="Stop"
                                />
                            </Button>

                            <Button size="regular" variant="secondary" disabled>
                                <FormattedMessage
                                    id="submitTransaction.speedUp"
                                    defaultMessage="Speed up"
                                />
                            </Button>
                        </Row>
                    </Column2>
                </Layout2>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
