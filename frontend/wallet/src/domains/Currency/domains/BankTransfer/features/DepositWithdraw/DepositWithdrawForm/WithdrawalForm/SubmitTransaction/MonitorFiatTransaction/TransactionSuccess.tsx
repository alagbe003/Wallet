import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import {
    OffRampSuccessEvent,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { OffRampTransactionView } from 'src/domains/Currency/domains/BankTransfer/components/OffRampTransactionView'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { getExplorerLink } from '@zeal/domains/Transactions/domains/TransactionHash/helpers/getExplorerLink'
import { notReachable } from '@zeal/toolkit'
import { Button, IconButton } from 'src/uikit'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { Column2 } from 'src/uikit/Column2'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { ExternalLink } from 'src/uikit/Icon/ExternalLink'
import { Content } from 'src/uikit/Layout/Content'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Progress2 } from 'src/uikit/Progress/Progress2'
import { Row } from '@zeal/uikit/Row'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    withdrawalRequest: WithdrawalRequest
    offRampTransactionEvent: OffRampSuccessEvent
    network: Network
    networkMap: NetworkMap
    account: Account
    keyStoreMap: KeyStoreMap
    transactionHash: string
    onMsg: (msg: Msg) => void
}

type State = { type: 'splash_animation' } | { type: 'final_success_screen' }

type Msg = { type: 'close' }

export const TransactionSuccess = ({
    withdrawalRequest,
    networkMap,
    account,
    keyStoreMap,
    network,
    offRampTransactionEvent,
    transactionHash,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'splash_animation' })

    switch (state.type) {
        case 'splash_animation':
            return (
                <Layout2 padding="form" background="light">
                    <ActionBar
                        network={network}
                        account={account}
                        keystore={getKeyStore({
                            keyStoreMap,
                            address: account.address,
                        })}
                        right={
                            <IconButton
                                onClick={() => onMsg({ type: 'close' })}
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
                                <Content.Header
                                    title={
                                        <FormattedMessage
                                            id="currency.bankTransfer.withdrawal_status.title"
                                            defaultMessage="Withdrawal"
                                        />
                                    }
                                />
                            }
                            footer={
                                <Progress2
                                    initialProgress={0.8}
                                    progress={1}
                                    title={
                                        <FormattedMessage
                                            id="currency.bankTransfer.off_ramp.complete"
                                            defaultMessage="Complete"
                                        />
                                    }
                                    variant="success"
                                    right={
                                        <Tertiary
                                            size="regular"
                                            color="success"
                                            onClick={() =>
                                                window.open(
                                                    getExplorerLink(
                                                        { transactionHash },
                                                        network
                                                    )
                                                )
                                            }
                                        >
                                            <Row spacing={4} alignY="center">
                                                <Text2>0x</Text2>

                                                <ExternalLink size={14} />
                                            </Row>
                                        </Tertiary>
                                    }
                                />
                            }
                        >
                            <Content.Splash
                                onAnimationComplete={() =>
                                    setState({ type: 'final_success_screen' })
                                }
                                variant="success"
                                title={
                                    <FormattedMessage
                                        id="currency.bankTransfer.withdrawal_status.success"
                                        defaultMessage="Sent to your bank"
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

        case 'final_success_screen':
            return (
                <Layout2 padding="form" background="light">
                    <ActionBar
                        network={network}
                        account={account}
                        keystore={getKeyStore({
                            keyStoreMap,
                            address: account.address,
                        })}
                        right={
                            <IconButton
                                onClick={() => onMsg({ type: 'close' })}
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
                                <Content.Header
                                    title={
                                        <FormattedMessage
                                            id="currency.bankTransfer.withdrawal_status.title"
                                            defaultMessage="Withdrawal"
                                        />
                                    }
                                />
                            }
                            footer={
                                <Progress2
                                    variant="success"
                                    title={
                                        <FormattedMessage
                                            id="currency.bankTransfer.withdrawal_status.finished.title"
                                            defaultMessage="Check your bank account"
                                        />
                                    }
                                    subtitle={
                                        <FormattedMessage
                                            id="currency.bankTransfer.withdrawal_status.finished.subtitle"
                                            defaultMessage="The funds should have arrived in your bank account by now."
                                        />
                                    }
                                    initialProgress={1}
                                    progress={1}
                                />
                            }
                        >
                            <OffRampTransactionView
                                variant={{
                                    type: 'status',
                                    offRampTransactionEvent,
                                }}
                                networkMap={networkMap}
                                withdrawalRequest={withdrawalRequest}
                            />
                        </Content>

                        <Button
                            size="regular"
                            variant="primary"
                            onClick={() => onMsg({ type: 'close' })}
                        >
                            <FormattedMessage
                                id="actions.close"
                                defaultMessage="Close"
                            />
                        </Button>
                    </Column2>
                </Layout2>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
