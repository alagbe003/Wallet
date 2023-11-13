import Big from 'big.js'
import { Money } from '@zeal/domains/Money'

export const mulByNumber = (a: Money, b: number): Money => ({
    amount: BigInt(Big(a.amount.toString()).mul(b).toFixed(0)),
    currencyId: a.currencyId,
})
