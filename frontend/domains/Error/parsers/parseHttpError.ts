import { HttpError } from '@zeal/domains/Error'
import { failure, Result, success } from '@zeal/toolkit/Result'

export const parseHttpError = (input: unknown): Result<unknown, HttpError> =>
    input instanceof HttpError && input.isHttpError
        ? success(input)
        : failure('not_correct_instance')
