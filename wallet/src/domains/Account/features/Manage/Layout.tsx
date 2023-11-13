import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { ActiveAccountsSection } from 'src/domains/Account/components/ActiveAccountsSection'
import { EmptySearch } from 'src/domains/Account/components/EmptySearch'
import { EmptySearchForValidAddress } from 'src/domains/Account/components/EmptySearchForValidAddress'
import {
    ListItem,
    Msg as AccountListItemMsg,
} from 'src/domains/Account/components/ListItem'
import { TrackedAccountsSection } from 'src/domains/Account/components/TrackedAccountsSection'
import { validateAccountSearch } from '@zeal/domains/Account/helpers/validateAccountSearch'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { noop, notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Button } from '@zeal/uikit/Button'
import { IconButton } from '@zeal/uikit/IconButton'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Avatar } from '@zeal/uikit/Avatar'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Column } from '@zeal/uikit/Column'
import { Checkbox } from '@zeal/uikit/Icon/Checkbox'
import { InfoCircle } from '@zeal/uikit/Icon/InfoCircle'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { OutlineSearch } from '@zeal/uikit/Icon/OutlineSearch'
import { SolidInterfacePlus } from 'src/uikit/Icon/SolidInterfacePlus'
import { Screen } from '@zeal/uikit/Screen'
import { Row } from '@zeal/uikit/Row'
import { Spacer } from '@zeal/uikit/Spacer'
import { Input } from '@zeal/uikit/Input'
import { Text } from '@zeal/uikit/Text'
import { Actions } from '@zeal/uikit/Actions'

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
        <Screen background="light" padding="form">
            <Column spacing={16} fill>
                <Column spacing={16}>
                    <Column spacing={0}>
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
                            <Spacer />
                            <Tertiary
                                color="on_light"
                                size="regular"
                                onClick={() =>
                                    onMsg({ type: 'add_new_account_click' })
                                }
                            >
                                <Avatar
                                    border="secondary"
                                    backgroundColor="surfaceDefault"
                                    size={28}
                                >
                                    <SolidInterfacePlus size={28} />
                                </Avatar>
                            </Tertiary>
                        </Row>
                    </Column>
                    <Input
                        onSubmitEditing={noop}
                        leftIcon={
                            <OutlineSearch size={24} color="iconDefault" />
                        }
                        rightIcon={<RightIcon searchResult={searchResult} />}
                        variant="regular"
                        value={search}
                        onChange={(e) => {
                            setSearch(e)
                        }}
                        state="normal"
                        placeholder={formatMessage({
                            id: 'address_book.change_account.search_placeholder',
                            defaultMessage: 'Add or search address',
                        })}
                    />
                </Column>
                <Column spacing={0}>
                    {(() => {
                        switch (searchResult.type) {
                            case 'accounts_not_found':
                                return <EmptySearch />

                            case 'accounts_not_found_search_valid_address':
                                return <EmptySearchForValidAddress />

                            case 'grouped_accounts': {
                                const { active, tracked } = searchResult

                                return (
                                    <Column spacing={24}>
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
                                    </Column>
                                )
                            }

                            /* istanbul ignore next */
                            default:
                                return notReachable(searchResult)
                        }
                    })()}
                </Column>
            </Column>
            <CTA onMsg={onMsg} searchResult={searchResult} />
        </Screen>
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
                <Actions>
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
                </Actions>
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
