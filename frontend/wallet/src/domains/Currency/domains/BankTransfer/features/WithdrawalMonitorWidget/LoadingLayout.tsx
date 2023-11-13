import { SubmittedOfframpTransaction } from '@zeal/domains/Currency/domains/BankTransfer'
import { Group } from 'src/uikit/Group'
import { Column2 } from 'src/uikit/Column2'
import { Row } from '@zeal/uikit/Row'
import { BoldUpload } from 'src/uikit/Icon/BoldUpload'
import { Text2 } from 'src/uikit/Text2'
import { FormattedMessage } from 'react-intl'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Skeleton } from 'src/uikit/Skeleton'
import React from 'react'
import { CryptoCurrency, FiatCurrency } from '@zeal/domains/Currency'
import { ImperativeError } from '@zeal/domains/Error'
import { notReachable } from '@zeal/toolkit'

const getFiatCurrency = (
    submittedTransaction: SubmittedOfframpTransaction
): FiatCurrency => {
    const { withdrawalRequest } = submittedTransaction

    const currencyId = (() => {
        switch (withdrawalRequest.type) {
            case 'incomplete_withdrawal_request':
                return withdrawalRequest.currencyId
            case 'full_withdrawal_request':
                return withdrawalRequest.toAmount.currencyId
            /* istanbul ignore next */
            default:
                return notReachable(withdrawalRequest)
        }
    })()

    const currency = withdrawalRequest.knownCurrencies[currencyId] || null

    if (!currency) {
        throw new ImperativeError(`Fiat currency with ID ${currency} not found`)
    }

    switch (currency.type) {
        case 'FiatCurrency':
            return currency
        case 'CryptoCurrency':
            throw new ImperativeError(
                `Expected fiat currency for ID ${currency}, but got Cryptocurrency`
            )
        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}

const getCryptoCurrency = (
    submittedTransaction: SubmittedOfframpTransaction
): CryptoCurrency => {
    const { withdrawalRequest } = submittedTransaction

    const currency =
        withdrawalRequest.knownCurrencies[
            withdrawalRequest.fromAmount.currencyId
        ] || null

    if (!currency) {
        throw new ImperativeError(
            `Crypto currency with ID ${currency} not found`
        )
    }

    switch (currency.type) {
        case 'FiatCurrency':
            throw new ImperativeError(
                `Expected crypto currency for ID ${currency}, but got FiatCurrency`
            )
        case 'CryptoCurrency':
            return currency
        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}

export const LoadingLayout = ({
    submittedTransaction,
}: {
    submittedTransaction: SubmittedOfframpTransaction
}) => {
    const cryptoCurrency = getCryptoCurrency(submittedTransaction)
    const fiatCurrency = getFiatCurrency(submittedTransaction)

    return (
        <Group variant="default">
            <Column2 spacing={12}>
                <Row spacing={12}>
                    <BoldUpload size={32} color="iconDefault" />
                    <Column2 spacing={4}>
                        <Text2
                            variant="callout"
                            weight="medium"
                            color="textPrimary"
                        >
                            <FormattedMessage
                                id="bank-transfer.withdrawal.widget.title"
                                defaultMessage="Withdrawal"
                            />
                        </Text2>

                        <Row spacing={8}>
                            <Text2
                                variant="footnote"
                                weight="regular"
                                color="textSecondary"
                            >
                                <FormattedMessage
                                    id="bank-transfer.withdrawal.widget.subtitle"
                                    defaultMessage="{from} to {to}"
                                    values={{
                                        from: cryptoCurrency.symbol,
                                        to: fiatCurrency.code,
                                    }}
                                />
                            </Text2>

                            <Spacer2 />

                            <Skeleton
                                variant="default"
                                width={55}
                                height={15}
                            />
                        </Row>
                    </Column2>
                </Row>
                <Skeleton variant="default" width="100%" height={8} />
            </Column2>
        </Group>
    )
}
