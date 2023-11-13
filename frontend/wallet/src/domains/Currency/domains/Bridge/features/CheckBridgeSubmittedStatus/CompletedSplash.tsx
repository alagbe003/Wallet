import { Layout2 } from 'src/uikit/Layout/Layout2'
import { ActionBar as AccountActionBar } from 'src/domains/Account/components/ActionBar'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Account } from '@zeal/domains/Account'
import { FormattedMessage } from 'react-intl'
import { Content } from 'src/uikit/Layout/Content'
import { BridgeSubmitted } from '@zeal/domains/Currency/domains/Bridge'
import {
    HeaderSubtitle,
    HeaderTitle,
} from 'src/domains/Currency/domains/Bridge/components/BridgeRouteHeader'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'

type Props = {
    account: Account
    keystoreMap: KeyStoreMap
    bridgeSubmitted: BridgeSubmitted
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'splash_screen_completed' }

export const CompletedSplash = ({
    bridgeSubmitted,
    keystoreMap,
    account,
    onMsg,
}: Props) => {
    return (
        <Layout2 padding="form" background="light">
            <AccountActionBar
                keystore={getKeyStore({
                    keyStoreMap: keystoreMap,
                    address: account.address,
                })}
                network={null}
                account={account}
                right={null}
            />
            <Content
                header={
                    <Content.Header
                        title={<HeaderTitle />}
                        subtitle={
                            <HeaderSubtitle
                                bridgeRoute={bridgeSubmitted.route}
                            />
                        }
                    />
                }
            >
                <Content.Splash
                    variant="success"
                    title={
                        <FormattedMessage
                            id="currency.bridge.success"
                            defaultMessage="Complete"
                        />
                    }
                    onAnimationComplete={() => {
                        onMsg({ type: 'splash_screen_completed' })
                    }}
                />
            </Content>
        </Layout2>
    )
}
