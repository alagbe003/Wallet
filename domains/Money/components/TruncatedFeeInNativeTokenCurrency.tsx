import React from 'react'
import { FormattedMessage } from 'react-intl'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { Money } from '@zeal/domains/Money'
import { FormattedTokenBalances } from './FormattedTokenBalances'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { isGreaterThan } from '@zeal/domains/Money/helpers/compare'
import { FormattedFeeInNativeTokenCurrency } from './FormattedFeeInNativeTokenCurrency'

export type Props = {
    money: Money
    knownCurrencies: KnownCurrencies
}

const MIN_TRUNCATE_LIMIT = '0.001'

export const TruncatedFeeInNativeTokenCurrency = ({
    knownCurrencies,
    money,
}: Props) => {
    const currency = useCurrencyById(money.currencyId, knownCurrencies)

    if (!currency) {
        return null
    }

    const truncateLimit: Money = {
        currencyId: currency.id,
        amount: amountToBigint(MIN_TRUNCATE_LIMIT, currency.fraction),
    }

    return isGreaterThan(truncateLimit, money) ? (
        <FormattedMessage
            id="money.FormattedFeeInNativeTokenCurrency.truncated"
            defaultMessage="&lt; {limit} {code}"
            values={{
                limit: (
                    <FormattedTokenBalances
                        knownCurrencies={knownCurrencies}
                        money={truncateLimit}
                    />
                ),
                code: currency.code,
            }}
        />
    ) : (
        <FormattedFeeInNativeTokenCurrency
            knownCurrencies={knownCurrencies}
            money={money}
        />
    )
}
