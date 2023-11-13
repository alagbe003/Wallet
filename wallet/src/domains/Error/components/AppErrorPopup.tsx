import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { AppError } from '@zeal/domains/Error'
import { captureAppError } from '@zeal/domains/Error/helpers/captureAppError'
import { useLiveRef } from '@zeal/toolkit'
import { Button } from 'src/uikit'
import { DangerCircle } from 'src/uikit/Icon/DangerCircle'
import { Popup } from 'src/uikit/Popup'

import { Header } from 'src/uikit/Header'
import { Title } from './Title'

type Props = {
    error: AppError
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' } | { type: 'try_again_clicked' }

export const AppErrorPopup = ({ error, onMsg }: Props) => {
    const liveError = useLiveRef(error)

    // We hold actual error in ref, but if type somehow changes - we report
    // This will prevent report spamming, since we usually do parsing in render
    useEffect(() => {
        captureAppError(liveError.current, { source: 'app_error_popup' })
    }, [liveError, liveError.current.type])

    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                icon={({ size, color }) => (
                    <DangerCircle size={size} color={color} />
                )}
                title={<Title error={error} />}
                subtitle={
                    <FormattedMessage
                        id="error.unknown_error.subtitle"
                        defaultMessage="Sorry! Our system seems to be having issues. Retry once and if it doesn’t work please report on our Discord for support and updates."
                    />
                }
            />
            <Popup.Actions>
                <Button
                    variant="secondary"
                    size="regular"
                    onClick={() => onMsg({ type: 'close' })}
                >
                    <FormattedMessage
                        id="action.cancel"
                        defaultMessage="Cancel"
                    />
                </Button>

                <Button
                    variant="primary"
                    size="regular"
                    onClick={() => onMsg({ type: 'try_again_clicked' })}
                >
                    <FormattedMessage
                        id="action.retry"
                        defaultMessage="Retry"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}
