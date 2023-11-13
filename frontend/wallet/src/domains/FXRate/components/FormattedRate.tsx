import { useIntl } from 'react-intl'
import { FXRate } from '@zeal/domains/FXRate'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { Big } from 'big.js'
import { useCurrenciesByRate } from '@zeal/domains/Currency/hooks/useCurrenciesByRate'

const MIN_AMOUNT = new Big('0.1')
const MIN_SIGNIFICANT_NUMBER = 2

type Props = {
    rate: FXRate
    knownCurriencies: KnownCurrencies
}

export const FormattedRate = ({ knownCurriencies, rate }: Props) => {
    const { formatNumber } = useIntl()
    const { quote: currency } = useCurrenciesByRate(rate, knownCurriencies)

    const amount = new Big(rate.rate.toString()).div(
        Math.pow(10, currency.rateFraction)
    )

    const amountToFormat = amount.gte(MIN_AMOUNT)
        ? amount.toFixed(MIN_SIGNIFICANT_NUMBER, 0)
        : amount.toPrecision(MIN_SIGNIFICANT_NUMBER, 0)

    return (
        <>
            {formatNumber(parseFloat(amountToFormat), {
                style: 'currency',
                currency: currency.code,
                minimumFractionDigits: 2,
                maximumFractionDigits: currency.rateFraction,
            })}
        </>
    )
}
