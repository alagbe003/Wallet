import Big from 'big.js'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { ImperativeError } from '@zeal/domains/Error'
import { FXRate } from '@zeal/domains/FXRate'
import { Money } from '@zeal/domains/Money'

export const applyRate = (
    baseAmount: Money,
    rate: FXRate,
    currencies: KnownCurrencies
): Money => {
    const base = currencies[rate.base] || null
    const quote = currencies[rate.quote] || null

    if (!base || !quote) {
        throw new ImperativeError(
            'Base or Quote currency is missing in dictionary'
        )
    }

    const amount = BigInt(
        Big(baseAmount.amount.toString())
            .div(Big(10).pow(base.fraction))
            .mul(rate.rate.toString())
            .toFixed(0)
    )

    return {
        amount,
        currencyId: quote.id,
    }
}
