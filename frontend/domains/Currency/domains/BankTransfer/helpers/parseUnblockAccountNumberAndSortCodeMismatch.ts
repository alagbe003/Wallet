import { UnblockAccountNumberAndSortCodeMismatch } from '@zeal/domains/Error'
import { parseHttpError } from '@zeal/domains/Error/parsers/parseHttpError'
import {
    Result,
    failure,
    match,
    object,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

export const parseUnblockAccountNumberAndSortCodeMismatch = (
    input: unknown
): Result<unknown, UnblockAccountNumberAndSortCodeMismatch> => {
    return parseHttpError(input)
        .map((err) => err.data)
        .andThen((data) => object(data))
        .andThen((obj) => {
            return shape({
                statusCode: match(obj.statusCode, 400),
                message: string(obj.message).andThen((msg) =>
                    msg.match('BENEFICIARY_DETAILS_INVALID') &&
                    msg.match('accountNumber_sortCode_mismatch')
                        ? success(msg)
                        : failure({
                              type: 'message_does_not_match_regexp',
                              msg,
                          })
                ),
            })
        })
        .map(
            () =>
                ({
                    type: 'unblock_account_number_and_sort_code_mismatch',
                } as const)
        )
}
