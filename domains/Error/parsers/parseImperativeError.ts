import { ImperativeError } from '@zeal/domains/Error'
import { failure, Result, success } from '@zeal/toolkit/Result'

export const parseImperativeError = (
    input: unknown
): Result<unknown, ImperativeError> =>
    input instanceof ImperativeError && input.isImperativeError
        ? success(input)
        : failure('not_correct_instance')
