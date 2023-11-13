import once from 'lodash.once'
import { useState } from 'react'
import { captureError } from '@zeal/domains/Error/helpers/captureError'

export const useCaptureErrorOnce = () => {
    const [captureErrorOnce] = useState<typeof captureError>(() =>
        once(captureError)
    )

    return captureErrorOnce
}
