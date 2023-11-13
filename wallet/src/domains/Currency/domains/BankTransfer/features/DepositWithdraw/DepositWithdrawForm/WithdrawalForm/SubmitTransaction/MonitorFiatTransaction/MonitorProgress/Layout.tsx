import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import {
    OffRampTransactionEvent,
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
import { Row } from '@zeal/uikit/Row'
import { OffRampProgress } from '../OffRampProgress'

type Props = {
    now: number
    startedAt: number
    network: Network
    networkMap: NetworkMap
    account: Account
    keyStoreMap: KeyStoreMap
    withdrawalRequest: WithdrawalRequest
    offRampTransactionEvent: OffRampTransactionEvent | null
    transactionHash: string
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const Layout = ({
    onMsg,
    account,
    keyStoreMap,
    network,
    networkMap,
    withdrawalRequest,
    offRampTransactionEvent,
    now,
    startedAt,
    transactionHash,
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
                        <OffRampProgress
                            network={network}
                            now={now}
                            offRampTransactionEvent={offRampTransactionEvent}
                            startedAt={startedAt}
                            transactionHash={transactionHash}
                            withdrawalRequest={withdrawalRequest}
                        />
                    }
                >
                    <OffRampTransactionView
                        variant={{ type: 'status', offRampTransactionEvent }}
                        networkMap={networkMap}
                        withdrawalRequest={withdrawalRequest}
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
}
