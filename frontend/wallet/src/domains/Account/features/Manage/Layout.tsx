import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { ActiveAccountsSection } from 'src/domains/Account/components/ActiveAccountsSection'
import { EmptySearch } from 'src/domains/Account/components/EmptySearch'
import { EmptySearchForValidAddress } from 'src/domains/Account/components/EmptySearchForValidAddress'
import {
    Msg as AccountListItemMsg,
    ListItem,
} from 'src/domains/Account/components/ListItem'
import { TrackedAccountsSection } from 'src/domains/Account/components/TrackedAccountsSection'
import { validateAccountSearch } from '@zeal/domains/Account/helpers/validateAccountSearch'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Button, IconButton } from 'src/uikit'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Avatar } from 'src/uikit/Avatar'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { Column2 } from 'src/uikit/Column2'
import { Checkbox } from 'src/uikit/Icon/Checkbox'
import { InfoCircle } from 'src/uikit/Icon/InfoCircle'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { OutlineSearch } from 'src/uikit/Icon/OutlineSearch'
import { SolidInterfacePlus } from 'src/uikit/Icon/SolidInterfacePlus'
import { Input2 } from 'src/uikit/Input/Input2'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Row } from '@zeal/uikit/Row'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    accounts: AccountsMap
    portfolios: PortfolioMap
    keystoreMap: KeyStoreMap
    account: Account
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'add_new_account_click' }
    | { type: 'track_wallet_clicked' }
    | { type: 'create_new_contact_account_click'; address: Address }
    | { type: 'on_active_and_tracked_wallets_clicked' }
    | AccountListItemMsg
    | MsgOf<typeof ActiveAccountsSection>
    | MsgOf<typeof TrackedAccountsSection>
    | MsgOf<typeof EmptySearch>
    | MsgOf<typeof EmptySearchForValidAddress>

export const Layout = ({
    accounts,
    keystoreMap,
    account: selectedAccount,
    onMsg,
    portfolios,
    currencyHiddenMap,
}: Props) => {
    const [search, setSearch] = useState<string>('')

    const { formatMessage } = useIntl()

    const searchResult = validateAccountSearch({
        accountsMap: accounts,
        keystoreMap,
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
                            <Text2
                                variant="title3"
                                weight="semi_bold"
                                color="textPrimary"
                                id="accounts-layout-label"
                            >
                                <FormattedMessage
                                    id="storage.manageAccounts.title"
                                    defaultMessage="Wallets"
                                />
                            </Text2>
                            <Tertiary
                                color="on_light"
                                size="regular"
                                onClick={() =>
                                    onMsg({
                                        type: 'on_active_and_tracked_wallets_clicked',
                                    })
                                }
                            >
                                <InfoCircle size={24} />
                            </Tertiary>
                            <Spacer2 />
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
                                                <ListItem
                                                    currencyHiddenMap={
                                                        currencyHiddenMap
                                                    }
                                                    key={account.address}
                                                    account={account}
                                                    selected={
                                                        account.address ===
                                                        selectedAccount.address
                                                    }
                                                    keystore={getKeyStore({
                                                        keyStoreMap:
                                                            keystoreMap,
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

                                        <TrackedAccountsSection
                                            accounts={tracked}
                                            listItem={({ account }) => (
                                                <ListItem
                                                    currencyHiddenMap={
                                                        currencyHiddenMap
                                                    }
                                                    key={account.address}
                                                    account={account}
                                                    selected={
                                                        account.address ===
                                                        selectedAccount.address
                                                    }
                                                    keystore={getKeyStore({
                                                        keyStoreMap:
                                                            keystoreMap,
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
        case 'grouped_accounts':
            return null

        case 'accounts_not_found_search_valid_address':
            return (
                <Button
                    size="regular"
                    variant="primary"
                    onClick={() => {
                        onMsg({
                            type: 'create_new_contact_account_click',
                            address: searchResult.address,
                        })
                    }}
                >
                    <FormattedMessage
                        id="address_book.change_account.cta"
                        defaultMessage="Track wallet"
                    />
                </Button>
            )

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
        case 'grouped_accounts':
            return null

        case 'accounts_not_found_search_valid_address':
            return <Checkbox color="iconAccent2" size={24} />

        /* istanbul ignore next */
        default:
            return notReachable(searchResult)
    }
}
