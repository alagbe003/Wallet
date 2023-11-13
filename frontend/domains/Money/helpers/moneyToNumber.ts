import { Money } from '@zeal/domains/Money'
import { KnownCurrencies } from '@zeal/domains/Currency'
import Big from 'big.js'

export const moneyToNumber = (
    money: Money,
    knownCurrencies: KnownCurrencies
): number => {
    const currency = knownCurrencies[money.currencyId]

    return Big(money.amount.toString())
        .div(Big(10).pow(currency.fraction))
        .toNumber()
}
