import { failure, Result, success } from '@zeal/toolkit/Result'

export const tryDecodeBase64 = (
    encoded: string
): Result<{ type: 'cannot decode string'; value: string }, string> => {
    try {
        return success(window.atob(encoded))
    } catch (e) {
        return failure({ type: 'cannot decode string', value: encoded })
    }
}
