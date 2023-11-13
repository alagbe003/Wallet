import { ImperativeError } from '@zeal/domains/Error'
import { Money } from '@zeal/domains/Money'

export const compare = (a: Money, b: Money): number => {
    if (a.currencyId !== b.currencyId) {
        throw new ImperativeError(
            `You can not compare different currencies [${a.currencyId}, ${b.currencyId}]`
        )
    }

    if (a.amount < b.amount) {
        return -1
    } else if (a.amount > b.amount) {
        return 1
    } else {
        return 0
    }
}

export const isGreaterThan = (a: Money, b: Money): boolean => compare(a, b) > 0
