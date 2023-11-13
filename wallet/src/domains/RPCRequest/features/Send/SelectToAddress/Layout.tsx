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
import { noop, notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Button } from '@zeal/uikit/Button'
import { IconButton } from '@zeal/uikit/IconButton'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { Checkbox } from '@zeal/uikit/Icon/Checkbox'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { OutlineSearch } from '@zeal/uikit/Icon/OutlineSearch'
import { Input } from '@zeal/uikit/Input'
import { Screen } from '@zeal/uikit/Screen'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'
import { ScrollView } from 'react-native'
import { Actions } from '@zeal/uikit/Actions'

type Props = {
    account: Account
    toAddress: Address | null
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}
type Msg =
    | { type: 'close' }
    | { type: 'on_continue_clicked'; address: Address }
    | MsgOf<typeof ActiveAccountsSection>
    | MsgOf<typeof TrackedAccountsSection>
    | MsgOf<typeof EmptySearch>
    | MsgOf<typeof EmptySearchForValidAddress>
    | MsgOf<typeof UnlockedListItem>

export const Layout = ({
    account,
    accountsMap,
    keyStoreMap,
    portfolioMap,
    toAddress,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    const [search, setSearch] = useState<string>('')

    const { [account.address]: _, ...otherAccountsMap } = accountsMap

    const searchResult = validateAccountSearch({
        accountsMap: otherAccountsMap,
        keystoreMap: keyStoreMap,
        search,
        portfolioMap,
        currencyHiddenMap,
    })

    return (
        <Screen
            background="light"
            padding="form"
            aria-labelledby="send-to-layout"
        >
            <Column spacing={16} shrink fill>
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
                            id="send-to-layout"
                        >
                            <FormattedMessage
                                id="SendERC20.send_to"
                                defaultMessage="Send to"
                            />
                        </Text>
                    </Row>
                </Column>

                <Input
                    autoFocus
                    leftIcon={<OutlineSearch size={24} color="iconDefault" />}
                    rightIcon={<RightIcon searchResult={searchResult} />}
                    variant="regular"
                    value={search}
                    onChange={(value) => {
                        setSearch(value)
                    }}
                    state="normal"
                    placeholder={formatMessage({
                        id: 'address_book.change_account.search_placeholder',
                        defaultMessage: 'Add or search address',
                    })}
                    onSubmitEditing={noop}
                />

                <ScrollView>
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
                                                <UnlockedListItem
                                                    currencyHiddenMap={
                                                        currencyHiddenMap
                                                    }
                                                    selectionVariant="default"
                                                    key={account.address}
                                                    account={account}
                                                    selected={
                                                        toAddress ===
                                                        account.address
                                                    }
                                                    keyStore={getKeyStore({
                                                        keyStoreMap,
                                                        address:
                                                            account.address,
                                                    })}
                                                    portfolio={
                                                        portfolioMap[
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
                                                <UnlockedListItem
                                                    currencyHiddenMap={
                                                        currencyHiddenMap
                                                    }
                                                    selectionVariant="default"
                                                    key={account.address}
                                                    account={account}
                                                    selected={
                                                        toAddress ===
                                                        account.address
                                                    }
                                                    keyStore={getKeyStore({
                                                        keyStoreMap,
                                                        address:
                                                            account.address,
                                                    })}
                                                    portfolio={
                                                        portfolioMap[
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
                </ScrollView>

                <Actions>
                    <CTA onMsg={onMsg} searchResult={searchResult} />
                </Actions>
            </Column>
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
                <Button
                    size="regular"
                    variant="primary"
                    onClick={() => {
                        onMsg({
                            type: 'on_continue_clicked',
                            address: searchResult.address,
                        })
                    }}
                >
                    <FormattedMessage
                        id="actions.continue"
                        defaultMessage="Continue"
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
