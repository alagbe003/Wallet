import { notReachable } from '@zeal/toolkit'
import { SubmitedTransaction } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { Text2 } from 'src/uikit/Text2'
import { FormattedDate } from 'react-intl'
import { useReadableDuration } from '@zeal/toolkit/Date/useReadableDuration'

type Props = {
    nowTimestampMs: number
    submittedTransaction: SubmitedTransaction
}

export const Timing = ({ nowTimestampMs, submittedTransaction }: Props) => {
    const formatHumanReadableDuration = useReadableDuration()

    switch (submittedTransaction.state) {
        case 'queued':
        case 'included_in_block':
            return (
                <Text2
                    variant="footnote"
                    weight="regular"
                    color="textStatusNeutralOnColor"
                    whiteSpace="nowrap"
                >
                    {formatHumanReadableDuration(
                        nowTimestampMs - submittedTransaction.queuedAt,
                        'floor'
                    )}
                </Text2>
            )
        case 'completed':
            return (
                <Text2
                    variant="footnote"
                    weight="regular"
                    color="textStatusSuccessOnColor"
                    whiteSpace="nowrap"
                >
                    <FormattedDate
                        value={submittedTransaction.completedAt}
                        month="short"
                        day="2-digit"
                        hour="2-digit"
                        minute="2-digit"
                        hour12={false}
                    />
                </Text2>
            )
        case 'failed':
            return (
                <Text2
                    variant="footnote"
                    weight="regular"
                    color="textStatusCriticalOnColor"
                    whiteSpace="nowrap"
                >
                    <FormattedDate
                        value={submittedTransaction.failedAt}
                        month="short"
                        day="2-digit"
                        hour="2-digit"
                        minute="2-digit"
                        hour12={false}
                    />
                </Text2>
            )
        /* istanbul ignore next */
        default:
            return notReachable(submittedTransaction)
    }
}
