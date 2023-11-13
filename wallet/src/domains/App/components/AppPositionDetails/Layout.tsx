import { Account } from '@zeal/domains/Account'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { App, Lending } from '@zeal/domains/App'
import { AppProtocolGroup } from 'src/domains/App/components/AppPoolGroup'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { KeyStore } from '@zeal/domains/KeyStore'
import { NetworkMap } from '@zeal/domains/Network'
import { IconButton } from 'src/uikit'
import { Column2 } from 'src/uikit/Column2'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { ExternalLink } from 'src/uikit/Icon/ExternalLink'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Row } from '@zeal/uikit/Row'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    account: Account
    keystore: KeyStore
    networkMap: NetworkMap
    knownCurrencies: KnownCurrencies
    app: App
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_health_rate_info_click'; protocol: Lending }

export const Layout = ({
    account,
    keystore,
    networkMap,
    knownCurrencies,
    app,
    onMsg,
}: Props) => {
    return (
        <Layout2 padding="form" background="light">
            <ActionBar
                account={account}
                keystore={keystore}
                network={null}
                right={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <CloseCross size={24} />
                    </IconButton>
                }
            />

            <Column2 spacing={12} style={{ overflowY: 'auto' }}>
                <Row spacing={8}>
                    <Text2
                        variant="title3"
                        weight="semi_bold"
                        color="textPrimary"
                    >
                        {app.name}
                    </Text2>

                    {app.url && (
                        <IconButton
                            onClick={() => window.open(app.url!, '_blank')}
                        >
                            <ExternalLink size={16} color="iconDefault" />
                        </IconButton>
                    )}
                </Row>

                {/* FIXME: @masm could not get this to render correctly and scroll, otherwise */}
                <div>
                    <Column2 spacing={12}>
                        {app.protocols.map((protocol) => (
                            <AppProtocolGroup
                                key={protocol.type}
                                protocol={protocol}
                                onMsg={onMsg}
                                knownCurrencies={knownCurrencies}
                                networkMap={networkMap}
                            />
                        ))}
                    </Column2>
                </div>
            </Column2>
        </Layout2>
    )
}
