import { bigint, object, Result, shape, string } from '@zeal/toolkit/Result'
import { Money } from '@zeal/domains/Money'

export const parse = (input: unknown): Result<unknown, Money> =>
    object(input).andThen((obj) =>
        shape({
            amount: bigint(obj.amount),
            currencyId: string(obj.currencyId),
        })
    )
