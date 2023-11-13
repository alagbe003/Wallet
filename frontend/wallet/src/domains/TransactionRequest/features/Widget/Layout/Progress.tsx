import React from 'react'
import { SubmitedTransaction } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { notReachable } from '@zeal/toolkit'
import { ProgressThin } from 'src/uikit/Progress'

type Props = {
    submitedTransaction: SubmitedTransaction
}

const progress = (submitedTransaction: SubmitedTransaction) => {
    switch (submitedTransaction.state) {
        case 'queued':
            return 0.6

        case 'included_in_block':
            return 0.8

        case 'completed':
        case 'failed':
            return 1

        default:
            return notReachable(submitedTransaction)
    }
}

const background = (
    submitedTransaction: SubmitedTransaction
): React.ComponentProps<typeof ProgressThin>['background'] => {
    switch (submitedTransaction.state) {
        case 'queued':
        case 'included_in_block':
            return 'neutral'

        case 'completed':
            return 'success'

        case 'failed':
            return 'critical'

        default:
            return notReachable(submitedTransaction)
    }
}

export const Progress = ({ submitedTransaction }: Props) => (
    <ProgressThin
        progress={progress(submitedTransaction)}
        initialProgress={null}
        animationTimeMs={300}
        background={background(submitedTransaction)}
    />
)
