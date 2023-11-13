import {
    BankAccountDetails,
    OnRampAccount,
    UnblockUser,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Button, IconButton } from 'src/uikit'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { Header } from 'src/uikit/Header'
import { Column2 } from 'src/uikit/Column2'
import { FormattedMessage, useIntl } from 'react-intl'
import { Group } from 'src/uikit/Group'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Avatar as CurrencyAvatar } from 'src/domains/Currency/components/Avatar'
import { Row } from '@zeal/uikit/Row'
import { InfoCircle } from 'src/uikit/Icon/InfoCircle'
import { notReachable } from '@zeal/toolkit'
import { Spacer2 } from 'src/uikit/Spacer2'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { CopyAccountProperty } from './components/CopyAccountProperty'
import { formatSortCode } from '@zeal/domains/Currency/domains/BankTransfer/helpers/formatSortCode'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { FormattedFiatCurrency } from '@zeal/domains/Money/components/FormattedFiatCurrency'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Account } from '@zeal/domains/Account'
import { Network } from '@zeal/domains/Network'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { formatIBAN } from '@zeal/domains/Currency/domains/BankTransfer/helpers/formatIBAN'
import { Text } from '@zeal/uikit/Text'

type Props = {
    currencies: BankTransferCurrencies
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    onRampAccount: OnRampAccount
    form: OnRampFeeParams
    unblockUser: UnblockUser
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_zeal_account_tooltip_click' }
    | { type: 'on_sent_from_bank_click' }
    | { type: 'on_back_button_clicked' }

export const Layout = ({
    onRampAccount,
    form,
    onMsg,
    currencies,
    account,
    network,
    keyStoreMap,
    unblockUser,
}: Props) => {
    const { formatMessage } = useIntl()
    const amount = amountToBigint(form.amount, form.inputCurrency.fraction)

    return (
        <Layout2 padding="form" background="light">
            <ActionBar
                network={network}
                account={account}
                keystore={getKeyStore({
                    keyStoreMap,
                    address: account.address,
                })}
                left={
                    <IconButton
                        aria-label={formatMessage({
                            id: 'actions.back',
                            defaultMessage: 'Back',
                        })}
                        onClick={() =>
                            onMsg({ type: 'on_back_button_clicked' })
                        }
                    >
                        <BackIcon size={24} />
                    </IconButton>
                }
                right={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <CloseCross size={24} />
                    </IconButton>
                }
            />
            <Column2 spacing={12}>
                <Column2 spacing={16}>
                    <Header
                        title={
                            <FormattedMessage
                                id="bank_transfers.deposit.show-account.header"
                                defaultMessage="Make transfer from your bank"
                            />
                        }
                    />
                    <Column2 spacing={8}>
                        <Text variant="paragraph" color="textSecondary">
                            <FormattedMessage
                                id="bank_transfers.deposit.show-account.send-from-bank-label"
                                defaultMessage="Send from your bank"
                            />
                        </Text>
                        <Group variant="default">
                            <ListItem2
                                aria-selected={false}
                                avatar={() => (
                                    <CurrencyAvatar
                                        key={form.inputCurrency.id}
                                        currency={form.inputCurrency}
                                        size={32}
                                        rightBadge={() => null}
                                    />
                                )}
                                size="large"
                                primaryText={form.inputCurrency.code}
                                side={{
                                    rightIcon: () => {
                                        return form.amount ? (
                                            <Text
                                                variant="callout"
                                                color="textPrimary"
                                                weight="medium"
                                            >
                                                <FormattedFiatCurrency
                                                    money={{
                                                        amount,
                                                        currencyId:
                                                            form.inputCurrency
                                                                .id,
                                                    }}
                                                    minimumFractionDigits={0}
                                                    knownCurrencies={
                                                        currencies.knownCurrencies
                                                    }
                                                />
                                            </Text>
                                        ) : null
                                    },
                                }}
                            />
                        </Group>
                    </Column2>
                </Column2>
                <Row spacing={4}>
                    <Text variant="paragraph" color="textSecondary">
                        <FormattedMessage
                            id="bank_transfers.deposit.show-account.zeal-bank-account-label"
                            defaultMessage="To your Zeal bank account"
                        />
                    </Text>
                    <IconButton
                        onClick={() =>
                            onMsg({ type: 'on_zeal_account_tooltip_click' })
                        }
                    >
                        <InfoCircle size={14} />
                    </IconButton>
                </Row>
                <Group variant="default">
                    <Column2 spacing={12}>
                        <Column2 spacing={4}>
                            <Text
                                variant="footnote"
                                color="textSecondary"
                                id="to-beneficiary-label"
                            >
                                <FormattedMessage
                                    id="bank_transfers.deposit.show-account.beneficiary"
                                    defaultMessage="To beneficiary"
                                />
                            </Text>
                            <CopyAccountProperty
                                aria-labelledby="to-beneficiary-label"
                                text={`${unblockUser.firstName} ${unblockUser.lastName}`}
                            />
                        </Column2>
                        <BankAccount
                            accountDetails={onRampAccount.bankDetails}
                        />
                    </Column2>
                </Group>
            </Column2>
            <Spacer2 />
            <Button
                size="regular"
                variant="secondary"
                type="button"
                onClick={() => onMsg({ type: 'on_sent_from_bank_click' })}
            >
                <FormattedMessage
                    id="bank_transfers.deposit.show-account.sent-from-bank"
                    defaultMessage="I've sent from my bank"
                />
            </Button>
        </Layout2>
    )
}

const BankAccount = ({
    accountDetails,
}: {
    accountDetails: BankAccountDetails
}) => {
    switch (accountDetails.type) {
        case 'uk':
            return (
                <>
                    <Column2 spacing={4}>
                        <Text
                            variant="footnote"
                            color="textSecondary"
                            id="account-number-label"
                        >
                            <FormattedMessage
                                id="bank_transfers.deposit.show-account.account-number"
                                defaultMessage="Account"
                            />
                        </Text>
                        <CopyAccountProperty
                            aria-labelledby="account-number-label"
                            text={accountDetails.accountNumber}
                        />
                    </Column2>
                    <Column2 spacing={4}>
                        <Text
                            variant="footnote"
                            color="textSecondary"
                            id="sort-code-label"
                        >
                            <FormattedMessage
                                id="bank_transfers.deposit.show-account.sort-code"
                                defaultMessage="Sort Code"
                            />
                        </Text>
                        <CopyAccountProperty
                            aria-labelledby="sort-code-label"
                            text={formatSortCode(accountDetails.sortCode)}
                        />
                    </Column2>
                </>
            )
        case 'iban':
            return (
                <Column2 spacing={4}>
                    <Text
                        variant="footnote"
                        color="textSecondary"
                        id="iban-label"
                    >
                        <FormattedMessage
                            id="bank_transfers.deposit.show-account.iban"
                            defaultMessage="IBAN"
                        />
                    </Text>
                    <CopyAccountProperty
                        aria-labelledby="iban-label"
                        text={formatIBAN(accountDetails.iban)}
                    />
                </Column2>
            )
        case 'ngn':
            return (
                <>
                    <Column2 spacing={4}>
                        <Text
                            variant="footnote"
                            color="textSecondary"
                            id="ngn-account-number-label"
                        >
                            <FormattedMessage
                                id="bank_transfers.deposit.show-account.ngn-account-number"
                                defaultMessage="Account number"
                            />
                        </Text>
                        <CopyAccountProperty
                            aria-labelledby="ngn-account-number-label"
                            text={accountDetails.accountNumber}
                        />
                    </Column2>
                    <Column2 spacing={4}>
                        <Text
                            variant="footnote"
                            color="textSecondary"
                            id="bank-code-label"
                        >
                            <FormattedMessage
                                id="bank_transfers.deposit.show-account.bank-code"
                                defaultMessage="Bank code"
                            />
                        </Text>
                        <CopyAccountProperty
                            aria-labelledby="bank-code-label"
                            text={accountDetails.bankCode}
                        />
                    </Column2>
                </>
            )
        /* istanbul ignore next */
        default:
            return notReachable(accountDetails)
    }
}
