import { PredefinedSourceOfFunds } from '@zeal/domains/Currency/domains/BankTransfer/api/submitUnblockKycApplication'
import { Column2 } from 'src/uikit/Column2'
import { Header } from 'src/uikit/Header'
import { FormattedMessage } from 'react-intl'
import { Group } from 'src/uikit/Group'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { IconButton } from 'src/uikit'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { Account } from '@zeal/domains/Account'
import { Network } from '@zeal/domains/Network'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { ActionBar } from 'src/domains/Account/components/ActionBar'

type Props = {
    onMsg: (msg: Msg) => void
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
}

type Msg =
    | { type: 'on_source_of_funds_selected'; source: PredefinedSourceOfFunds }
    | { type: 'on_back_button_clicked' }
    | { type: 'on_other_source_of_funds_clicked' }
    | {
          type: 'close'
      }

export const Layout = ({ onMsg, account, network, keyStoreMap }: Props) => {
    return (
        <Layout2 padding="form" background="light">
            <ActionBar
                network={network}
                account={account}
                keystore={getKeyStore({
                    keyStoreMap,
                    address: account.address,
                })}
                left={
                    <IconButton
                        onClick={() =>
                            onMsg({ type: 'on_back_button_clicked' })
                        }
                    >
                        <BackIcon size={24} />
                    </IconButton>
                }
                right={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <CloseCross size={24} />
                    </IconButton>
                }
            />
            <Column2 spacing={24} style={{ flex: '0 0 auto' }}>
                <Header
                    title={
                        <FormattedMessage
                            id="bank_transfers.source_of_funds.form.title"
                            defaultMessage="Your source of funds"
                        />
                    }
                />

                <Column2 style={{ flex: '0 0 auto' }} spacing={8}>
                    <Group style={{ flex: '0 0 auto' }} variant="default">
                        <ListItem2
                            size="regular"
                            aria-selected={false}
                            primaryText={
                                <FormattedMessage
                                    id="bank_transfers.source_of_funds.form.salary"
                                    defaultMessage="Salary"
                                />
                            }
                            onClick={() =>
                                onMsg({
                                    type: 'on_source_of_funds_selected',
                                    source: { type: 'salary' },
                                })
                            }
                        />
                    </Group>

                    <Group style={{ flex: '0 0 auto' }} variant="default">
                        <ListItem2
                            size="regular"
                            aria-selected={false}
                            primaryText={
                                <FormattedMessage
                                    id="bank_transfers.source_of_funds.form.business_income"
                                    defaultMessage="Business income"
                                />
                            }
                            onClick={() =>
                                onMsg({
                                    type: 'on_source_of_funds_selected',
                                    source: { type: 'business_income' },
                                })
                            }
                        />
                    </Group>

                    <Group style={{ flex: '0 0 auto' }} variant="default">
                        <ListItem2
                            size="regular"
                            aria-selected={false}
                            primaryText={
                                <FormattedMessage
                                    id="bank_transfers.source_of_funds.form.pension"
                                    defaultMessage="Pension"
                                />
                            }
                            onClick={() =>
                                onMsg({
                                    type: 'on_source_of_funds_selected',
                                    source: { type: 'pension' },
                                })
                            }
                        />
                    </Group>

                    <Group style={{ flex: '0 0 auto' }} variant="default">
                        <ListItem2
                            size="regular"
                            aria-selected={false}
                            primaryText={
                                <FormattedMessage
                                    id="bank_transfers.source_of_funds.form.other"
                                    defaultMessage="Other"
                                />
                            }
                            onClick={() =>
                                onMsg({
                                    type: 'on_other_source_of_funds_clicked',
                                })
                            }
                        />
                    </Group>
                </Column2>
            </Column2>
        </Layout2>
    )
}
