import { Account } from '@zeal/domains/Account'
import { CurrentNetwork } from '@zeal/domains/Network'
import { FormattedMessage } from 'react-intl'
import { Section } from '@zeal/uikit/Group'
import { TokensGroupHeader } from 'src/domains/Token/components/TokensGroupHeader'
import { Apps, NFT, Tokens } from 'src/uikit/Icon/Empty'
import { AppsGroupHeader } from 'src/domains/App/components/AppsGroupHeader'
import { GroupHeader as NFTGroupHeader } from 'src/domains/NFTCollection/components/GroupHeader'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { ErrorWidget } from 'src/domains/Account/components/Widget'
import { KeyStore } from '@zeal/domains/KeyStore'
import { HeaderBox, ContentBox, Screen } from '@zeal/uikit/Screen'
import { Row } from '@zeal/uikit/Row'
import { EmptyStateWidget } from '@zeal/uikit/EmptyStateWidget'
import { Column } from '@zeal/uikit/Column'
import { getLayoutBackground } from '@zeal/domains/Network/helpers/getLayoutBackground'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { useState } from 'react'

type Props = {
    account: Account
    currentNetwork: CurrentNetwork
    keystore: KeyStore
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof ErrorWidget> | { type: 'reload_button_click' }

export const Error = ({ account, currentNetwork, keystore, onMsg }: Props) => {
    const [tokensLabelId] = useState(crypto.randomUUID())
    return (
        <Screen padding="main" background={getLayoutBackground(currentNetwork)}>
            <HeaderBox>
                <ErrorWidget
                    keystore={keystore}
                    currentNetwork={currentNetwork}
                    currentAccount={account}
                    onMsg={onMsg}
                />
            </HeaderBox>
            <ContentBox>
                <Column spacing={16}>
                    <Section aria-labelledby={tokensLabelId}>
                        <TokensGroupHeader
                            labelId={tokensLabelId}
                            onClick={null}
                            tokens={[]}
                            knownCurrencies={{}}
                        />
                        <EmptyStateWidget
                            size="regular"
                            icon={({ size }) => (
                                <Tokens size={size} color="backgroundLight" />
                            )}
                            title={
                                <FormattedMessage
                                    id="token.widget.errorState"
                                    defaultMessage="We failed to load your tokens"
                                />
                            }
                        />
                    </Section>

                    <Section>
                        <AppsGroupHeader
                            apps={[]}
                            knownCurrencies={{}}
                            onClick={null}
                        />
                        <EmptyStateWidget
                            size="regular"
                            icon={({ size }) => (
                                <Apps size={size} color="backgroundLight" />
                            )}
                            title={
                                <FormattedMessage
                                    id="app.widget.errorState"
                                    defaultMessage="We failed to load your apps"
                                />
                            }
                        />
                    </Section>

                    <Section>
                        <NFTGroupHeader
                            nftCollections={[]}
                            knownCurrencies={{}}
                            onClick={null}
                        />
                        <EmptyStateWidget
                            size="regular"
                            icon={({ size }) => (
                                <NFT size={size} color="backgroundLight" />
                            )}
                            title={
                                <FormattedMessage
                                    id="nft.widget.errorState"
                                    defaultMessage="We failed to load your NFTs"
                                />
                            }
                        />
                    </Section>

                    <Row spacing={0} alignX="center">
                        <Tertiary
                            color="on_light"
                            size="regular"
                            onClick={() =>
                                onMsg({ type: 'reload_button_click' })
                            }
                        >
                            <FormattedMessage
                                id="account.view.error.refreshAssets"
                                defaultMessage="Refresh"
                            />
                        </Tertiary>
                    </Row>
                </Column>
            </ContentBox>
        </Screen>
    )
}
