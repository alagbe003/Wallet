import React from 'react'
import Big from 'big.js'
import { useIntl } from 'react-intl'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { Money } from '@zeal/domains/Money'

export type Props = {
    money: Money
    knownCurrencies: KnownCurrencies
}

const MAX_FRACTION_DIGITS = 2

export const FormattedFeeInDefaultCurrency = ({
    knownCurrencies,
    money,
}: Props) => {
    const { formatNumber } = useIntl()
    const currency = useCurrencyById(money.currencyId, knownCurrencies)

    if (!currency) {
        return null
    }

    const power = BigInt(10) ** BigInt(currency.fraction)

    const amount = new Big(money.amount.toString())
        .div(new Big(power.toString()))
        .toNumber()

    return (
        <>
            {formatNumber(amount < 0.01 ? 0.01 : amount, {
                style: 'currency',
                currency: currency.code,
                maximumFractionDigits: MAX_FRACTION_DIGITS,
            })}
        </>
    )
}
