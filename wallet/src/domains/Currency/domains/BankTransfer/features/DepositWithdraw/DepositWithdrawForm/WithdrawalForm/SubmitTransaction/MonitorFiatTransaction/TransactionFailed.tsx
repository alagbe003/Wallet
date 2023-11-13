import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import {
    OffRampFailedEvent,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { OffRampTransactionView } from 'src/domains/Currency/domains/BankTransfer/components/OffRampTransactionView'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { Button, IconButton } from 'src/uikit'
import { Column2 } from 'src/uikit/Column2'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { Content } from 'src/uikit/Layout/Content'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Progress2 } from 'src/uikit/Progress/Progress2'

type Props = {
    withdrawalRequest: WithdrawalRequest
    network: Network
    account: Account
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    offRampTransactionEvent: OffRampFailedEvent
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const TransactionFailed = ({
    withdrawalRequest,
    account,
    network,
    keyStoreMap,
    networkMap,
    offRampTransactionEvent,
    onMsg,
}: Props) => {
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
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <CloseCross size={24} />
                    </IconButton>
                }
            />

            <Column2 spacing={12} style={{ overflowY: 'auto', flex: '1' }}>
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
                            variant="critical"
                            title={
                                <FormattedMessage
                                    id="currency.bankTransfer.withdrawal_status.failed.title"
                                    defaultMessage="Failed"
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
}
