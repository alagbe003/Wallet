import { useState } from 'react'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { failure, Result, success } from '@zeal/toolkit/Result'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Button, IconButton } from 'src/uikit'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Header } from 'src/uikit/Header'
import { FormattedMessage } from 'react-intl'
import { Column2 } from 'src/uikit/Column2'
import { Group } from 'src/uikit/Group'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { BoldAddWallet } from 'src/uikit/Icon/BoldAddWallet'
import { values } from '@zeal/toolkit/Object'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { UnlockedListItem } from 'src/domains/Account/components/UnlockedListItem'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { notReachable } from '@zeal/toolkit'
import { Spacer2 } from 'src/uikit/Spacer2'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { InfoCard } from '@zeal/uikit/InfoCard'

type Props = {
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_back_button_clicked' }
    | { type: 'on_add_wallet_click' }
    | { type: 'on_continue_click'; account: Account }

type Form = {
    selectedAccount: Account | null
}

type FormError = {
    submit?: { type: 'you_need_to_select_account_to_proceed' }
}

type ValidForm = {
    selectedAccount: Account
}

const validate = (form: Form): Result<FormError, ValidForm> => {
    return form.selectedAccount
        ? success({ selectedAccount: form.selectedAccount })
        : failure({ submit: { type: 'you_need_to_select_account_to_proceed' } })
}

const getActiveAccounts = (
    accountsMap: AccountsMap,
    keyStoreMap: KeyStoreMap
): Account[] => {
    const accounts = values(accountsMap)
    return accounts.filter((account) => {
        const keyStore = getKeyStore({
            keyStoreMap,
            address: account.address,
        })
        switch (keyStore.type) {
            case 'track_only':
                return false
            case 'private_key_store':
            case 'ledger':
            case 'secret_phrase_key':
            case 'trezor':
            case 'safe_v0':
                return true
            /* istanbul ignore next */
            default:
                return notReachable(keyStore)
        }
    })
}

export const Layout = ({
    accountsMap,
    keystoreMap,
    portfolioMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const [form, setForm] = useState<Form>({ selectedAccount: null })

    const result = validate(form)
    const errors = result.getFailureReason() || {}

    const activeAccounts = getActiveAccounts(accountsMap, keystoreMap)

    return (
        <form
            style={{ width: '100%', height: '100%', display: 'flex' }}
            onSubmit={(e) => {
                e.preventDefault()
                const result = validate(form)
                switch (result.type) {
                    case 'Failure':
                        break
                    case 'Success':
                        onMsg({
                            type: 'on_continue_click',
                            account: result.data.selectedAccount,
                        })
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(result)
                }
            }}
        >
            <Layout2 padding="form" background="light">
                <ActionBar
                    left={
                        <IconButton
                            onClick={() =>
                                onMsg({ type: 'on_back_button_clicked' })
                            }
                        >
                            <BackIcon size={24} />
                        </IconButton>
                    }
                />

                <Column2 spacing={24} style={{ flex: '1' }}>
                    <Header
                        title={
                            <FormattedMessage
                                id="bank_transfers.choose-wallet.title"
                                defaultMessage="Choose wallet"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="bank_transfers.choose-wallet.title"
                                defaultMessage="Choose the wallet you want to link your bank account to for direct transfers. "
                            />
                        }
                    />

                    <Column2 spacing={12} style={{ flex: '1' }}>
                        <Column2 spacing={12} style={{ overflowY: 'auto' }}>
                            {activeAccounts.length === 0 ? null : (
                                <Group
                                    variant="default"
                                    style={{ flex: '0 0 auto' }}
                                >
                                    {activeAccounts.map((account) => (
                                        <UnlockedListItem
                                            currencyHiddenMap={
                                                currencyHiddenMap
                                            }
                                            selectionVariant="checkbox"
                                            key={account.address}
                                            account={account}
                                            selected={
                                                form.selectedAccount
                                                    ?.address ===
                                                account.address
                                            }
                                            keyStore={getKeyStore({
                                                keyStoreMap: keystoreMap,
                                                address: account.address,
                                            })}
                                            portfolio={
                                                portfolioMap[account.address]
                                            }
                                            onMsg={(msg) => {
                                                switch (msg.type) {
                                                    case 'account_item_clicked':
                                                        setForm({
                                                            selectedAccount:
                                                                msg.account,
                                                        })
                                                        break
                                                    /* istanbul ignore next */
                                                    default:
                                                        return notReachable(
                                                            msg.type
                                                        )
                                                }
                                            }}
                                        />
                                    ))}
                                </Group>
                            )}

                            <Group
                                variant="default"
                                style={{ flex: '0 0 auto' }}
                            >
                                <ListItem2
                                    size="regular"
                                    aria-selected={false}
                                    avatar={({ size }) => (
                                        <BoldAddWallet
                                            size={size}
                                            color="textSecondary"
                                        />
                                    )}
                                    primaryText={
                                        <FormattedMessage
                                            id="bank_transfers.choose-wallet.test"
                                            defaultMessage="Add wallet"
                                        />
                                    }
                                    onClick={() =>
                                        onMsg({ type: 'on_add_wallet_click' })
                                    }
                                />
                            </Group>
                        </Column2>

                        <Spacer2 />

                        <Column2 spacing={8} style={{ flex: '0 0 auto' }}>
                            <InfoCard
                                title={
                                    <FormattedMessage
                                        id="bank_transfers.choose-wallet.warning.title"
                                        defaultMessage="Choose your wallet wisely"
                                    />
                                }
                                subtitle={
                                    <FormattedMessage
                                        id="bank_transfers.choose-wallet.warning.subtitle"
                                        defaultMessage="You can only link one wallet at a time. You won’t be able to change the linked wallet."
                                    />
                                }
                                variant="warning"
                            />

                            <Button
                                size="regular"
                                disabled={!!errors.submit}
                                variant="primary"
                                type="submit"
                            >
                                <FormattedMessage
                                    id="bank_transfers.choose-wallet.continue"
                                    defaultMessage="Continue"
                                />
                            </Button>
                        </Column2>
                    </Column2>
                </Column2>
            </Layout2>
        </form>
    )
}
