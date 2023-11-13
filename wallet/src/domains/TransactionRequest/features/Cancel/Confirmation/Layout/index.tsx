import { CancelSubmited } from '@zeal/domains/TransactionRequest'

import { IconButton } from 'src/uikit'

import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { notReachable } from '@zeal/toolkit'
import { Minimized, Msg as MinimizedMsg } from 'src/uikit/Minimized'

import { Actions, Msg as ActionsMsg } from './Actions'
import { FormattedMessage } from 'react-intl'
import { Column2 } from 'src/uikit/Column2'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Content } from 'src/uikit/Layout/Content'
import { SubmitedTransaction } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { TransactionHeader } from 'src/domains/TransactionRequest/components/TransactionHeader'

import { ProgressStatusBar } from './ProgressStatusBar'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'

type Props = {
    transactionRequest: CancelSubmited
    state: State
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    onMsg: (msg: Msg) => void
    keystores: KeyStoreMap
}

export type Msg = ActionsMsg | MinimizedMsg | { type: 'on_minimize_click' }

export type State = { type: 'minimised' } | { type: 'maximised' }

export const Layout = ({
    transactionRequest,
    keystores,
    state,
    networkMap,
    networkRPCMap,
    onMsg,
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
                            address: account.address,
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
                    <Column2 spacing={12} style={{ flex: '1' }}>
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
                                <ProgressStatusBar
                                    submitedTransaction={
                                        transactionRequest.cancelSubmitedTransaction
                                    }
                                    network={network}
                                    networkRPCMap={networkRPCMap}
                                />
                            }
                        >
                            <ContentLayout
                                submitedCancelTransaction={
                                    transactionRequest.cancelSubmitedTransaction
                                }
                            />
                        </Content>

                        <Actions
                            networkMap={networkMap}
                            transactionRequest={transactionRequest}
                            onMsg={onMsg}
                        />
                    </Column2>
                </Layout2>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}

const ContentLayout = ({
    submitedCancelTransaction,
}: {
    submitedCancelTransaction: SubmitedTransaction
}) => {
    switch (submitedCancelTransaction.state) {
        case 'queued':
        case 'included_in_block':
            return (
                <Content.Splash
                    onAnimationComplete={null}
                    variant="spinner"
                    title={
                        <FormattedMessage
                            id="submitTransaction.cancel.attemptingToStop"
                            defaultMessage="Attempting to stop"
                        />
                    }
                />
            )

        case 'completed':
            return (
                <Content.Splash
                    onAnimationComplete={null}
                    variant="success"
                    title={
                        <FormattedMessage
                            id="submitTransaction.cancel.stopped"
                            defaultMessage="Stopped"
                        />
                    }
                />
            )

        case 'failed':
            return (
                <Content.Splash
                    onAnimationComplete={null}
                    variant="error"
                    title={
                        <FormattedMessage
                            id="submitTransaction.cancel.failedToStop"
                            defaultMessage="Failed to stop"
                        />
                    }
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(submitedCancelTransaction)
    }
}
