import { UnblockSessionExpired } from '@zeal/domains/Error'
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

const UNBLOCK_UNAUTHROIZED_MESSAGE = 'Unauthorized'

export const parseUnblockSessionExpired = (
    input: unknown
): Result<unknown, UnblockSessionExpired> =>
    parseHttpError(input)
        .andThen((err) =>
            object(err.data).andThen((obj) =>
                shape({
                    statusCode: match(err.status, 401),
                    message: string(obj.message).andThen((msg) =>
                        msg.match(UNBLOCK_UNAUTHROIZED_MESSAGE)
                            ? success(msg)
                            : failure({
                                  type: 'unauthorized_message_does_not_match_regexp',
                                  msg,
                              })
                    ),
                })
            )
        )
        .map(() => ({ type: 'unblock_session_expired' } as const))
