import { FormattedMessage } from 'react-intl'
import { notReachable } from '@zeal/toolkit'
import { ExternalLink } from 'src/uikit/Icon/ExternalLink'
import { Row } from '@zeal/uikit/Row'
import { Text2 } from 'src/uikit/Text2'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import {
    BridgeSubmitted,
    BridgeSubmittedStatus,
} from '@zeal/domains/Currency/domains/Bridge'
import { openExplorerLink } from 'src/domains/Currency/domains/Bridge/helpers/openExplorerLink'
import { useReadableDuration } from 'src/toolkit/Date/useReadableDuration'

type Props = {
    nowTimestampMs: number
    bridgeSubmitted: BridgeSubmitted
    bridgeSubmittedStatus: BridgeSubmittedStatus
}

export const Status = ({
    nowTimestampMs,
    bridgeSubmitted,
    bridgeSubmittedStatus,
}: Props) => {
    switch (bridgeSubmittedStatus.targetTransaction.type) {
        case 'pending':
        case 'not_started':
            return (
                <Pending
                    bridgeSubmitted={bridgeSubmitted}
                    nowTimestampMs={nowTimestampMs}
                />
            )

        case 'completed':
            if (!bridgeSubmitted.route.refuel) {
                return <Completed bridgeSubmitted={bridgeSubmitted} />
            }

            if (!bridgeSubmittedStatus.refuel) {
                return (
                    <Pending
                        bridgeSubmitted={bridgeSubmitted}
                        nowTimestampMs={nowTimestampMs}
                    />
                )
            }

            switch (bridgeSubmittedStatus.refuel.type) {
                case 'pending':
                case 'not_started':
                    return (
                        <Pending
                            bridgeSubmitted={bridgeSubmitted}
                            nowTimestampMs={nowTimestampMs}
                        />
                    )

                case 'completed':
                    return <Completed bridgeSubmitted={bridgeSubmitted} />

                /* istanbul ignore next */
                default:
                    return notReachable(bridgeSubmittedStatus.refuel.type)
            }

        /* istanbul ignore next */
        default:
            return notReachable(bridgeSubmittedStatus.targetTransaction.type)
    }
}

const Completed = ({
    bridgeSubmitted,
}: {
    bridgeSubmitted: BridgeSubmitted
}) => {
    return (
        <Row spacing={8}>
            <Text2
                variant="footnote"
                weight="regular"
                color="textStatusSuccessOnColor"
            >
                <FormattedMessage
                    id="bridge.widget.completed"
                    defaultMessage="Complete"
                />
            </Text2>

            <Text2
                variant="footnote"
                weight="regular"
                color="textStatusSuccessOnColor"
            >
                <Tertiary
                    size="small"
                    color="success"
                    onClick={() => openExplorerLink(bridgeSubmitted)}
                >
                    <Row spacing={0}>
                        <Text2>0x</Text2>

                        <ExternalLink size={14} />
                    </Row>
                </Tertiary>
            </Text2>
        </Row>
    )
}

const Pending = ({
    bridgeSubmitted,
    nowTimestampMs,
}: {
    nowTimestampMs: number
    bridgeSubmitted: BridgeSubmitted
}) => {
    const formatHumanReadableDuration = useReadableDuration()

    return (
        <Row spacing={8}>
            <Text2 variant="footnote" weight="regular" color="textSecondary">
                {`${formatHumanReadableDuration(
                    nowTimestampMs - bridgeSubmitted.submittedAtMS,
                    'floor'
                )} / ${formatHumanReadableDuration(
                    bridgeSubmitted.route.serviceTimeMs
                )}`}
            </Text2>

            <Text2
                variant="footnote"
                weight="regular"
                color="textStatusSuccessOnColor"
            >
                <Tertiary
                    size="small"
                    color="on_light"
                    onClick={() => {
                        openExplorerLink(bridgeSubmitted)
                    }}
                >
                    <Row spacing={0}>
                        <Text2>0x</Text2>

                        <ExternalLink size={14} />
                    </Row>
                </Tertiary>
            </Text2>
        </Row>
    )
}
