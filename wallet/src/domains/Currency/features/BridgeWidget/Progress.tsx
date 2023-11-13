import React from 'react'
import { notReachable } from '@zeal/toolkit'
import { ProgressThin } from '@zeal/uikit/ProgressThin'
import {
    BridgeSubmitted,
    BridgeSubmittedStatus,
} from '@zeal/domains/Currency/domains/Bridge'

type Props = {
    nowTimestampMs: number
    bridgeSubmitted: BridgeSubmitted
    bridgeSubmittedStatus: BridgeSubmittedStatus
}

const getProgressColor = (
    bridgeSubmitted: BridgeSubmitted,
    bridgeSubmittedStatus: BridgeSubmittedStatus
): React.ComponentProps<typeof ProgressThin>['background'] => {
    switch (bridgeSubmittedStatus.targetTransaction.type) {
        case 'pending':
        case 'not_started':
            return 'neutral'
        case 'completed':
            if (!bridgeSubmitted.route.refuel) {
                return 'success'
            }

            if (!bridgeSubmittedStatus.refuel) {
                return 'neutral'
            }

            switch (bridgeSubmittedStatus.refuel.type) {
                case 'pending':
                case 'not_started':
                    return 'neutral'

                case 'completed':
                    return 'success'

                /* istanbul ignore next */
                default:
                    return notReachable(bridgeSubmittedStatus.refuel.type)
            }

        /* istanbul ignore next */
        default:
            return notReachable(bridgeSubmittedStatus.targetTransaction.type)
    }
}

const getProgress = (
    nowTimestampMs: number,
    bridgeSubmitted: BridgeSubmitted,
    bridgeSubmittedStatus: BridgeSubmittedStatus
): number => {
    const timePassed = nowTimestampMs - bridgeSubmitted.submittedAtMS
    const timePassedPercentage = Math.min(
        1,
        timePassed / bridgeSubmitted.route.serviceTimeMs
    )

    switch (bridgeSubmittedStatus.targetTransaction.type) {
        case 'pending':
        case 'not_started':
            return timePassedPercentage
        case 'completed':
            if (!bridgeSubmitted.route.refuel) {
                return 1
            }

            if (!bridgeSubmittedStatus.refuel) {
                return timePassedPercentage
            }

            switch (bridgeSubmittedStatus.refuel.type) {
                case 'pending':
                case 'not_started':
                    return timePassedPercentage

                case 'completed':
                    return 1

                /* istanbul ignore next */
                default:
                    return notReachable(bridgeSubmittedStatus.refuel.type)
            }

        /* istanbul ignore next */
        default:
            return notReachable(bridgeSubmittedStatus.targetTransaction.type)
    }
}

export const Progress = ({
    nowTimestampMs,
    bridgeSubmitted,
    bridgeSubmittedStatus,
}: Props) => {
    const color = getProgressColor(bridgeSubmitted, bridgeSubmittedStatus)
    const progress = getProgress(
        nowTimestampMs,
        bridgeSubmitted,
        bridgeSubmittedStatus
    )

    return (
        <ProgressThin
            animationTimeMs={300}
            initialProgress={null}
            progress={progress}
            background={color}
        />
    )
}
