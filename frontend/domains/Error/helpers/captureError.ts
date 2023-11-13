import { parseAppError } from '../parsers/parseAppError'

import { captureAppError } from './captureAppError'

type Params = {
    extra?: Record<string, unknown>
}

export const captureError = (error: unknown, params?: Params): void =>
    captureAppError(parseAppError(error), {
        source: 'manually_captured',
        extra: params?.extra,
    })
