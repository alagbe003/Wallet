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
import { Button, IconButton } from 'src/uikit'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column2 } from 'src/uikit/Column2'
import { Checkbox } from 'src/uikit/Icon/Checkbox'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { OutlineSearch } from 'src/uikit/Icon/OutlineSearch'
import { Input2 } from 'src/uikit/Input/Input2'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Row } from '@zeal/uikit/Row'
import { Text2 } from 'src/uikit/Text2'

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
        <Layout2
            background="light"
            padding="form"
            aria-labelledby="send-to-layout"
        >
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
                                id="send-to-layout"
                            >
                                <FormattedMessage
                                    id="SendERC20.send_to"
                                    defaultMessage="Send to"
                                />
                            </Text2>
                        </Row>
                    </Column2>

                    <Input2
                        autoFocus
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
