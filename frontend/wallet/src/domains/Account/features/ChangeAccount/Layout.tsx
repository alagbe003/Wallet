import { AlternativeProvider } from '@zeal/domains/Main'
import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { ActiveAccountsSection } from 'src/domains/Account/components/ActiveAccountsSection'
import { EmptySearch } from 'src/domains/Account/components/EmptySearch'
import { EmptySearchForValidAddress } from 'src/domains/Account/components/EmptySearchForValidAddress'
import { TrackedAccountsSection } from 'src/domains/Account/components/TrackedAccountsSection'
import { UnlockedListItem } from 'src/domains/Account/components/UnlockedListItem'
import { validateAccountSearch } from '@zeal/domains/Account/helpers/validateAccountSearch'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Button } from '@zeal/uikit/Button'
import { IconButton } from '@zeal/uikit/IconButton'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Avatar } from 'src/uikit/Avatar'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Column2 } from 'src/uikit/Column2'
import { Group, Section } from 'src/uikit/Group'
import { GroupHeader } from '@zeal/uikit/Group'
import { Checkbox } from 'src/uikit/Icon/Checkbox'
import { CustomMetamask } from '@zeal/uikit/Icon/CustomMetamask'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { OutlineSearch } from 'src/uikit/Icon/OutlineSearch'
import { SolidInterfacePlus } from 'src/uikit/Icon/SolidInterfacePlus'
import { Input2 } from 'src/uikit/Input/Input2'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Row } from '@zeal/uikit/Row'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

type Props = {
    accounts: AccountsMap
    portfolios: PortfolioMap
    keystores: KeyStoreMap
    alternativeProvider: AlternativeProvider
    selectedProvider: { type: 'zeal'; account: Account } | { type: 'metamask' }
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'account_item_clicked'; account: Account }
    | { type: 'add_new_account_click' }
    | { type: 'track_account_click'; address: Address }
    | { type: 'other_provider_selected' }
    | MsgOf<typeof ActiveAccountsSection>
    | MsgOf<typeof TrackedAccountsSection>
    | MsgOf<typeof EmptySearch>
    | MsgOf<typeof EmptySearchForValidAddress>

export const Layout = ({
    accounts,
    keystores,
    selectedProvider,
    alternativeProvider,
    onMsg,
    portfolios,
    currencyHiddenMap,
}: Props) => {
    const [search, setSearch] = useState<string>('')

    const { formatMessage } = useIntl()

    const searchResult = validateAccountSearch({
        accountsMap: accounts,
        keystoreMap: keystores,
        search,
        portfolioMap: portfolios,
        currencyHiddenMap,
    })
    return (
        <Layout2 background="light" padding="form">
            <Column2 spacing={16} style={{ flex: '1' }}>
                <Column2 style={{ flex: '0 0 auto' }} spacing={16}>
                    <Column2 spacing={0} style={{ flex: '0 0 auto' }}>
                        <ActionBar
                            left={
                                <IconButton
                                    onClick={() => onMsg({ type: 'close' })}
                                >
                                    <BackIcon size={24} />
                                </IconButton>
                            }
                        />
                        <Row spacing={4}>
                            <Text
                                variant="title3"
                                weight="semi_bold"
                                color="textPrimary"
                                id="accounts-layout-label"
                            >
                                <FormattedMessage
                                    id="storage.manageAccounts.title"
                                    defaultMessage="Wallets"
                                />
                            </Text>
                            <Spacer />
                            <Tertiary
                                color="on_light"
                                size="regular"
                                onClick={() =>
                                    onMsg({ type: 'add_new_account_click' })
                                }
                            >
                                <Avatar
                                    backgroundColor="surfaceDefault"
                                    size={28}
                                    icon={<SolidInterfacePlus size={28} />}
                                />
                            </Tertiary>
                        </Row>
                    </Column2>
                    <Input2
                        leftIcon={
                            <OutlineSearch size={24} color="iconDefault" />
                        }
                        rightIcon={<RightIcon searchResult={searchResult} />}
                        variant="regular"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.currentTarget.value)
                        }}
                        state="normal"
                        placeholder={formatMessage({
                            id: 'address_book.change_account.search_placeholder',
                            defaultMessage: 'Add or search address',
                        })}
                    />
                </Column2>
                <Column2
                    spacing={0}
                    style={{ overflowY: 'auto', flex: '1 1 auto' }}
                >
                    {(() => {
                        switch (searchResult.type) {
                            case 'accounts_not_found':
                                return <EmptySearch />

                            case 'accounts_not_found_search_valid_address':
                                return <EmptySearchForValidAddress />

                            case 'grouped_accounts': {
                                const { active, tracked } = searchResult

                                return (
                                    <Column2 spacing={24}>
                                        <ActiveAccountsSection
                                            accounts={active}
                                            listItem={({ account }) => (
                                                <UnlockedListItem
                                                    currencyHiddenMap={
                                                        currencyHiddenMap
                                                    }
                                                    selectionVariant="default"
                                                    key={account.address}
                                                    account={account}
                                                    selected={(() => {
                                                        switch (
                                                            selectedProvider.type
                                                        ) {
                                                            case 'metamask':
                                                                return false
                                                            case 'zeal':
                                                                return (
                                                                    selectedProvider
                                                                        .account
                                                                        .address ===
                                                                    account.address
                                                                )

                                                            default:
                                                                return notReachable(
                                                                    selectedProvider
                                                                )
                                                        }
                                                    })()}
                                                    keyStore={getKeyStore({
                                                        keyStoreMap: keystores,
                                                        address:
                                                            account.address,
                                                    })}
                                                    portfolio={
                                                        portfolios[
                                                            account.address
                                                        ]
                                                    }
                                                    onMsg={onMsg}
                                                />
                                            )}
                                            onMsg={onMsg}
                                        />

                                        {(() => {
                                            switch (alternativeProvider) {
                                                case 'metamask':
                                                    return (
                                                        <Section
                                                            style={{
                                                                flex: '0 0 auto',
                                                            }}
                                                        >
                                                            <GroupHeader
                                                                right={null}
                                                                left={
                                                                    <FormattedMessage
                                                                        id="account.other_providers"
                                                                        defaultMessage="Other providers"
                                                                    />
                                                                }
                                                            />

                                                            <Group variant="default">
                                                                <ListItem2
                                                                    size="regular"
                                                                    aria-selected={(() => {
                                                                        switch (
                                                                            selectedProvider.type
                                                                        ) {
                                                                            case 'zeal':
                                                                                return false
                                                                            case 'metamask':
                                                                                return true

                                                                            default:
                                                                                return notReachable(
                                                                                    selectedProvider
                                                                                )
                                                                        }
                                                                    })()}
                                                                    avatar={({
                                                                        size,
                                                                    }) => (
                                                                        <CustomMetamask
                                                                            size={
                                                                                size
                                                                            }
                                                                        />
                                                                    )}
                                                                    primaryText="MetaMask"
                                                                    shortText={
                                                                        <FormattedMessage
                                                                            id="account.connect_with_metamask"
                                                                            defaultMessage="Connect with MetaMask"
                                                                        />
                                                                    }
                                                                    onClick={() =>
                                                                        onMsg({
                                                                            type: 'other_provider_selected',
                                                                        })
                                                                    }
                                                                />
                                                            </Group>
                                                        </Section>
                                                    )
                                                case 'provider_unavailable':
                                                    return null

                                                default:
                                                    return notReachable(
                                                        alternativeProvider
                                                    )
                                            }
                                        })()}

                                        <TrackedAccountsSection
                                            accounts={tracked}
                                            listItem={({ account }) => (
                                                <UnlockedListItem
                                                    currencyHiddenMap={
                                                        currencyHiddenMap
                                                    }
                                                    selectionVariant="default"
                                                    key={account.address}
                                                    account={account}
                                                    selected={(() => {
                                                        switch (
                                                            selectedProvider.type
                                                        ) {
                                                            case 'metamask':
                                                                return false
                                                            case 'zeal':
                                                                return (
                                                                    selectedProvider
                                                                        .account
                                                                        .address ===
                                                                    account.address
                                                                )

                                                            default:
                                                                return notReachable(
                                                                    selectedProvider
                                                                )
                                                        }
                                                    })()}
                                                    keyStore={getKeyStore({
                                                        keyStoreMap: keystores,
                                                        address:
                                                            account.address,
                                                    })}
                                                    portfolio={
                                                        portfolios[
                                                            account.address
                                                        ]
                                                    }
                                                    onMsg={onMsg}
                                                />
                                            )}
                                            onMsg={onMsg}
                                        />
                                    </Column2>
                                )
                            }

                            /* istanbul ignore next */
                            default:
                                return notReachable(searchResult)
                        }
                    })()}
                </Column2>
            </Column2>
            <CTA onMsg={onMsg} searchResult={searchResult} />
        </Layout2>
    )
}

const CTA = ({
    searchResult,
    onMsg,
}: {
    searchResult: ReturnType<typeof validateAccountSearch>
    onMsg: (msg: Msg) => void
}) => {
    switch (searchResult.type) {
        case 'accounts_not_found':
            return null
        case 'accounts_not_found_search_valid_address':
            return (
                <Button
                    size="regular"
                    variant="primary"
                    onClick={() =>
                        onMsg({
                            type: 'track_account_click',
                            address: searchResult.address,
                        })
                    }
                >
                    <FormattedMessage
                        id="address_book.change_account.cta"
                        defaultMessage="Track wallet"
                    />
                </Button>
            )
        case 'grouped_accounts':
            return null
        /* istanbul ignore next */
        default:
            return notReachable(searchResult)
    }
}

const RightIcon = ({
    searchResult,
}: {
    searchResult: ReturnType<typeof validateAccountSearch>
}) => {
    switch (searchResult.type) {
        case 'accounts_not_found':
            return null
        case 'accounts_not_found_search_valid_address':
            return <Checkbox color="iconAccent2" size={24} />
        case 'grouped_accounts':
            return null
        /* istanbul ignore next */
        default:
            return notReachable(searchResult)
    }
}
