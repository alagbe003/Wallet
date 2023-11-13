import { Connected as ConnectedState } from '../../..'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { FormattedMessage } from 'react-intl'
import { ListItem } from 'src/domains/DApp/components/ListItem'
import { IconButton } from 'src/uikit'
import { Button } from '@zeal/uikit/Button'
import { InputButton as AccountInputButton } from 'src/domains/Account/components/InputButton'
import { InputButton as NetworkInputButton } from 'src/domains/Network/components/InputButton'
import { Account } from '@zeal/domains/Account'
import { Network } from '@zeal/domains/Network'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { Text } from '@zeal/uikit/Text'
import { Portfolio } from '@zeal/domains/Portfolio'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { Column2 } from 'src/uikit/Column2'
import { Content } from '@zeal/uikit/Content'
import { KeyStore } from '@zeal/domains/KeyStore'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { Actions } from '@zeal/uikit/Actions'

type Props = {
    connectionState: ConnectedState

    selectedNetwork: Network
    selectedAccount: Account

    portfolio: Portfolio | null
    keystore: KeyStore

    currencyHiddenMap: CurrencyHiddenMap

    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'account_selector_click' }
    | { type: 'network_selector_click' }
    | { type: 'disconnect_button_click' }
    | { type: 'on_minimize_click' }

export const Layout = ({
    connectionState,
    selectedAccount,
    selectedNetwork,
    portfolio,
    keystore,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    return (
        <Layout2 padding="form" background="light">
            <ActionBar
                keystore={keystore}
                network={selectedNetwork}
                account={selectedAccount}
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
                        <Content.Header
                            title={
                                <FormattedMessage
                                    id="connection_state.connected.expanded.title"
                                    defaultMessage="Connected"
                                />
                            }
                        />
                    }
                >
                    <Column2 spacing={20}>
                        <ListItem
                            highlightHostName={null}
                            variant="regular"
                            dApp={connectionState.dApp}
                        />
                        <Column2 spacing={24}>
                            <AccountInputButton
                                currencyHiddenMap={currencyHiddenMap}
                                keystore={keystore}
                                account={selectedAccount}
                                onClick={() => {
                                    onMsg({ type: 'account_selector_click' })
                                }}
                                portfolio={portfolio}
                            />
                            <NetworkInputButton
                                network={selectedNetwork}
                                onClick={() => {
                                    onMsg({ type: 'network_selector_click' })
                                }}
                            />
                        </Column2>
                        <Text
                            variant="footnote"
                            weight="regular"
                            color="textSecondary"
                        >
                            <FormattedMessage
                                id="connection_state.connected.expanded.disclaimer"
                                defaultMessage="Connecting an app will allow it to see your balance and ask you to confirm transactions"
                            />
                        </Text>
                    </Column2>
                </Content>

                <Actions>
                    <Button
                        size="regular"
                        variant="secondary"
                        onClick={() => {
                            onMsg({ type: 'disconnect_button_click' })
                        }}
                    >
                        <FormattedMessage
                            id="connection_state.connected.expanded.disconnectButton"
                            defaultMessage="Disconnect"
                        />
                    </Button>
                </Actions>
            </Column2>
        </Layout2>
    )
}
