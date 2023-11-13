import { FormattedMessage } from 'react-intl'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { BoldPaper } from 'src/uikit/Icon/BoldPaper'
import { OutlinedInterfaceLink } from 'src/uikit/Icon/OutlinedInterfaceLink'
import { SolidCloud } from 'src/uikit/Icon/SolidCloud'
import { SolidStatusKey } from 'src/uikit/Icon/SolidStatusKey'
import { Screen } from '@zeal/uikit/Screen'
import { ListItem } from '@zeal/uikit/ListItem'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_add_from_secret_phrase' }
    | { type: 'on_add_account_private_key' }
    | { type: 'on_add_account_from_recovery_kit' }
    | { type: 'on_add_account_from_hardware_wallet_click' }
    | { type: 'on_add_account_from_existing_phrase' }

export const Layout = ({ onMsg }: Props) => {
    return (
        <Screen padding="form" background="light">
            <ActionBar />

            <Column shrink spacing={24}>
                <Header
                    title={
                        <FormattedMessage
                            id="account.add.select_type.title"
                            defaultMessage="Import wallet using..."
                        />
                    }
                />
                {/*style={{ flex: '0 0 auto' }}*/}
                <Column shrink spacing={8}>
                    <Group variant="default">
                        <ListItem
                            size="regular"
                            aria-selected={false}
                            avatar={({ size }) => (
                                <BoldPaper size={size} color="iconAccent2" />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="account.add.select_type.secret_phrase"
                                    defaultMessage="Secret Phrase"
                                />
                            }
                            shortText={
                                <FormattedMessage
                                    id="account.add.select_type.secret_phrase.subtext"
                                    defaultMessage="From Metamask, Zeal or others"
                                />
                            }
                            onClick={() =>
                                onMsg({ type: 'on_add_from_secret_phrase' })
                            }
                        />
                    </Group>

                    <Group variant="default">
                        <ListItem
                            size="regular"
                            aria-selected={false}
                            avatar={({ size }) => (
                                <SolidStatusKey
                                    size={size}
                                    color="iconAccent2"
                                />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="account.add.select_type.private_key"
                                    defaultMessage="Private Key"
                                />
                            }
                            shortText={
                                <FormattedMessage
                                    id="account.add.select_type.private_key.subtext"
                                    defaultMessage="From Metamask, Zeal or others"
                                />
                            }
                            onClick={() =>
                                onMsg({
                                    type: 'on_add_account_private_key',
                                })
                            }
                        />
                    </Group>

                    <Group variant="default">
                        <ListItem
                            size="regular"
                            aria-selected={false}
                            avatar={({ size }) => (
                                <SolidCloud size={size} color="iconAccent2" />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="account.add.select_type.zeal_recovery_file"
                                    defaultMessage="Zeal Recovery File"
                                />
                            }
                            shortText={
                                <FormattedMessage
                                    id="account.add.select_type.add_hardware_wallet.subtext"
                                    defaultMessage="Encrypted on your personal cloud"
                                />
                            }
                            onClick={() =>
                                onMsg({
                                    type: 'on_add_account_from_recovery_kit',
                                })
                            }
                        />
                    </Group>

                    <Group variant="default">
                        <ListItem
                            size="regular"
                            aria-selected={false}
                            avatar={({ size }) => (
                                <OutlinedInterfaceLink
                                    size={size}
                                    color="iconAccent2"
                                />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="account.add.select_type.add_hardware_wallet"
                                    defaultMessage="Hardware Wallet"
                                />
                            }
                            shortText={
                                <FormattedMessage
                                    id="account.add.select_type.add_hardware_wallet.subtext"
                                    defaultMessage="Connect Ledger or Trezor"
                                />
                            }
                            onClick={() =>
                                onMsg({
                                    type: 'on_add_account_from_hardware_wallet_click',
                                })
                            }
                        />
                    </Group>
                </Column>
            </Column>
        </Screen>
    )
}
