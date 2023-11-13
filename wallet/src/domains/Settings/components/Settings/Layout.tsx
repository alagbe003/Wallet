import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import {
    FetchPortfolioRequest,
    FetchPortfolioResponse,
} from '@zeal/domains/Account/api/fetchAccounts'
import {
    SmallWidget,
    SmallWidgetError,
    SmallWidgetSkeleton,
} from 'src/domains/Account/components/Widget'
import { KeyStore } from '@zeal/domains/KeyStore'
import {
    ZEAL_PRIVACY_POLICY_URL,
    ZEAL_TERMS_OF_USE_URL,
} from '@zeal/domains/Main/constants'
import { Manifest } from 'src/domains/Manifest'
import { CurrentNetwork } from '@zeal/domains/Network'
import { getLayoutBackground } from '@zeal/domains/Network/helpers/getLayoutBackground'
import { notReachable } from '@zeal/toolkit'
import { ReloadableData } from '@zeal/toolkit/LoadableData/ReloadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Column2 } from 'src/uikit/Column2'
import { Group, Section } from 'src/uikit/Group'
import { GroupHeader } from '@zeal/uikit/Group'
import { BoldLock } from 'src/uikit/Icon/BoldLock'
import { Discord } from 'src/uikit/Icon/Discord'
import { Document } from 'src/uikit/Icon/Document'
import { Logo } from 'src/uikit/Icon/Logo/Logo'
import { ForwardIcon } from 'src/uikit/Icon/Navigation/ForwardIcon'
import { Privacy } from 'src/uikit/Icon/Privacy'
import { Scan } from 'src/uikit/Icon/Scan'
import { Twitter } from 'src/uikit/Icon/Twitter'
import { ContentBox, HeaderBox, Screen } from '@zeal/uikit/Screen'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Row } from '@zeal/uikit/Row'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

import { Text } from '@zeal/uikit/Text'

type Props = {
    manifest: Manifest
    portfolioLoadable: ReloadableData<
        FetchPortfolioResponse,
        FetchPortfolioRequest
    >
    currentAccount: Account
    currentNetwork: CurrentNetwork
    keystore: KeyStore
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | MsgOf<typeof SmallWidget>
    | { type: 'on_lock_zeal_click' }
    | { type: 'on_manage_connections_click' }
    | { type: 'add_new_account_click' }

export const Layout = ({
    manifest,
    currentNetwork,
    currentAccount,
    portfolioLoadable,
    keystore,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    return (
        <Screen padding="main" background={getLayoutBackground(currentNetwork)}>
            <HeaderBox>
                {(() => {
                    switch (portfolioLoadable.type) {
                        case 'loading':
                            return (
                                <SmallWidgetSkeleton
                                    currencyHiddenMap={currencyHiddenMap}
                                    keystore={keystore}
                                    currentAccount={currentAccount}
                                    currentNetwork={currentNetwork}
                                    onMsg={onMsg}
                                />
                            )
                        case 'loaded':
                        case 'reloading':
                        case 'subsequent_failed':
                            return (
                                <SmallWidget
                                    currencyHiddenMap={currencyHiddenMap}
                                    keystore={keystore}
                                    currentAccount={currentAccount}
                                    currentNetwork={currentNetwork}
                                    onMsg={onMsg}
                                    portfolio={portfolioLoadable.data.portfolio}
                                />
                            )
                        case 'error':
                            return (
                                <SmallWidgetError
                                    currencyHiddenMap={currencyHiddenMap}
                                    keystore={keystore}
                                    currentAccount={currentAccount}
                                    currentNetwork={currentNetwork}
                                    onMsg={onMsg}
                                />
                            )
                        /* istanbul ignore next */
                        default:
                            return notReachable(portfolioLoadable)
                    }
                })()}
            </HeaderBox>
            <ContentBox>
                <Column2 spacing={16}>
                    <Text
                        variant="title3"
                        weight="semi_bold"
                        color="textPrimary"
                    >
                        <FormattedMessage
                            id="settings.page.title"
                            defaultMessage="Settings"
                        />
                    </Text>

                    <Section>
                        <GroupHeader
                            left={
                                <FormattedMessage
                                    id="settings.communitySecurity"
                                    defaultMessage="Security"
                                />
                            }
                            right={null}
                        />
                        <Group variant="default">
                            <ListItem2
                                size="regular"
                                aria-selected={false}
                                avatar={({ size }) => (
                                    <Logo size={size} color="iconAccent2" />
                                )}
                                primaryText={
                                    <FormattedMessage
                                        id="settings.addNewAccount"
                                        defaultMessage="Add new account"
                                    />
                                }
                                side={{
                                    rightIcon: ({ size }) => (
                                        <ForwardIcon
                                            size={size}
                                            color="iconDefault"
                                        />
                                    ),
                                }}
                                onClick={() =>
                                    onMsg({ type: 'add_new_account_click' })
                                }
                            />
                            <ListItem2
                                size="regular"
                                aria-selected={false}
                                avatar={({ size }) => (
                                    <Scan size={size} color="iconAccent2" />
                                )}
                                primaryText={
                                    <FormattedMessage
                                        id="settings.connections"
                                        defaultMessage="Connections"
                                    />
                                }
                                side={{
                                    rightIcon: ({ size }) => (
                                        <ForwardIcon
                                            size={size}
                                            color="iconDefault"
                                        />
                                    ),
                                }}
                                onClick={() => {
                                    onMsg({
                                        type: 'on_manage_connections_click',
                                    })
                                }}
                            />
                            <ListItem2
                                size="regular"
                                aria-selected={false}
                                avatar={({ size }) => (
                                    <BoldLock size={size} color="iconAccent2" />
                                )}
                                primaryText={
                                    <FormattedMessage
                                        id="settings.lockZeal"
                                        defaultMessage="Lock Zeal"
                                    />
                                }
                                side={{
                                    rightIcon: ({ size }) => (
                                        <ForwardIcon
                                            size={size}
                                            color="iconDefault"
                                        />
                                    ),
                                }}
                                onClick={() =>
                                    onMsg({ type: 'on_lock_zeal_click' })
                                }
                            />
                        </Group>
                    </Section>

                    <Section>
                        <GroupHeader
                            left={
                                <FormattedMessage
                                    id="settings.communityHeader"
                                    defaultMessage="Community"
                                />
                            }
                            right={null}
                        />
                        <Group variant="default">
                            <ListItem2
                                size="regular"
                                aria-selected={false}
                                avatar={({ size }) => (
                                    <Discord size={size} color="iconAccent2" />
                                )}
                                primaryText={
                                    <FormattedMessage
                                        id="settings.discord"
                                        defaultMessage="Discord"
                                    />
                                }
                                side={{
                                    rightIcon: ({ size }) => (
                                        <ForwardIcon
                                            size={size}
                                            color="iconDefault"
                                        />
                                    ),
                                }}
                                onClick={() => {
                                    window.open(
                                        'https://discord.gg/XN6j4Mg9JD',
                                        '_blank'
                                    )
                                }}
                            />
                            <ListItem2
                                size="regular"
                                aria-selected={false}
                                avatar={({ size }) => (
                                    <Twitter size={size} color="iconAccent2" />
                                )}
                                primaryText={
                                    <FormattedMessage
                                        id="settings.twitter"
                                        defaultMessage="Twitter"
                                    />
                                }
                                side={{
                                    rightIcon: ({ size }) => (
                                        <ForwardIcon
                                            size={size}
                                            color="iconDefault"
                                        />
                                    ),
                                }}
                                onClick={() => {
                                    window.open(
                                        'https://twitter.com/withzeal',
                                        '_blank'
                                    )
                                }}
                            />
                        </Group>
                    </Section>

                    <Section>
                        <GroupHeader
                            left={
                                <FormattedMessage
                                    id="settings.LEGALHeader"
                                    defaultMessage="Legal"
                                />
                            }
                            right={null}
                        />

                        <Group variant="default">
                            <ListItem2
                                size="regular"
                                aria-selected={false}
                                avatar={({ size }) => (
                                    <Privacy size={size} color="iconAccent2" />
                                )}
                                primaryText={
                                    <FormattedMessage
                                        id="settings.privacyPolicy"
                                        defaultMessage="Privacy Policy"
                                    />
                                }
                                side={{
                                    rightIcon: ({ size }) => (
                                        <ForwardIcon
                                            size={size}
                                            color="iconDefault"
                                        />
                                    ),
                                }}
                                onClick={() => {
                                    window.open(
                                        ZEAL_PRIVACY_POLICY_URL,
                                        '_blank'
                                    )
                                }}
                            />

                            <ListItem2
                                size="regular"
                                aria-selected={false}
                                avatar={({ size }) => (
                                    <Document size={size} color="iconAccent2" />
                                )}
                                primaryText={
                                    <FormattedMessage
                                        id="settings.termsOfUse"
                                        defaultMessage="Terms of Use"
                                    />
                                }
                                side={{
                                    rightIcon: ({ size }) => (
                                        <ForwardIcon
                                            size={size}
                                            color="iconDefault"
                                        />
                                    ),
                                }}
                                onClick={() => {
                                    window.open(ZEAL_TERMS_OF_USE_URL, '_blank')
                                }}
                            />
                        </Group>
                    </Section>

                    <Row spacing={0} alignX="center">
                        <Text
                            variant="caption1"
                            weight="regular"
                            color="textSecondary"
                            align="center"
                        >
                            <FormattedMessage
                                id="settings.version"
                                defaultMessage="Version {version}"
                                values={{ version: manifest.version }}
                            />
                        </Text>
                    </Row>
                </Column2>
            </ContentBox>
        </Screen>
    )
}
