import { FormattedMessage } from 'react-intl'
import { KycStatus } from '@zeal/domains/Currency/domains/BankTransfer'
import { notReachable } from '@zeal/toolkit'
import { IconButton } from 'src/uikit'
import { Avatar } from 'src/uikit/Avatar'
import { Column2 } from 'src/uikit/Column2'
import { Group } from 'src/uikit/Group'
import { BoldCrossMedium } from 'src/uikit/Icon/BoldCrossMedium'
import { BoldId } from 'src/uikit/Icon/BoldID'
import { OutOfFlow } from 'src/uikit/OutOfFlow'
import { ProgressThin } from 'src/uikit/ProgressThin'
import { Row } from '@zeal/uikit/Row'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Text2 } from 'src/uikit/Text2'

export type Props = {
    status: KycStatus
    onMsg: (msg: Msg) => void
}

// TODO: what is the correct animation time? 300 is used in some other places.
const ANIMATION_TIME_MS = 300

const pendingProgress = 0.4

export type Msg =
    | { type: 'on_dismiss_kyc_button_clicked' }
    | { type: 'on_click' }

export const Layout = ({ status, onMsg }: Props) => {
    // TODO: move DIV into uikit component, if it does not exist yet
    return (
        <div
            onClick={() => {
                onMsg({ type: 'on_click' })
            }}
            role="button"
            style={{ cursor: 'pointer' }}
        >
            <Group variant="default">
                <Column2 spacing={12}>
                    <Row spacing={12}>
                        <Avatar
                            size={32}
                            icon={<BoldId size={32} color="iconDefault" />}
                        />

                        <Column2 spacing={4}>
                            <Row spacing={0}>
                                <Text2
                                    variant="paragraph"
                                    color="textPrimary"
                                    weight="regular"
                                >
                                    <FormattedMessage
                                        id="kyc_status.title"
                                        defaultMessage="Verifying identity"
                                    />
                                </Text2>

                                <Spacer2 />

                                <OutOfFlow align="bottomRight">
                                    {(() => {
                                        switch (status.type) {
                                            case 'not_started':
                                            case 'in_progress':
                                                return null
                                            case 'approved':
                                            case 'paused':
                                            case 'failed':
                                                return (
                                                    <IconButton
                                                        onClick={(ev) => {
                                                            ev.stopPropagation()
                                                            onMsg({
                                                                type: 'on_dismiss_kyc_button_clicked',
                                                            })
                                                        }}
                                                    >
                                                        <BoldCrossMedium
                                                            size={24}
                                                        />
                                                    </IconButton>
                                                )
                                            default:
                                                return notReachable(status)
                                        }
                                    })()}
                                </OutOfFlow>
                            </Row>

                            <Row spacing={0}>
                                <Text2
                                    variant="footnote"
                                    color="textSecondary"
                                    weight="regular"
                                >
                                    <FormattedMessage
                                        id="kyc_status.subtitle"
                                        defaultMessage="Bank transfers"
                                    />
                                </Text2>

                                <Spacer2 />

                                {(() => {
                                    switch (status.type) {
                                        case 'not_started':
                                        case 'in_progress':
                                            return null

                                        case 'failed':
                                            return (
                                                <Text2
                                                    variant="footnote"
                                                    color="textStatusCriticalOnColor"
                                                    weight="regular"
                                                >
                                                    <FormattedMessage
                                                        id="kyc_status.failed_status"
                                                        defaultMessage="Failed"
                                                    />
                                                </Text2>
                                            )

                                        case 'paused':
                                            return (
                                                <Text2
                                                    variant="footnote"
                                                    color="textStatusWarningOnColor"
                                                    weight="regular"
                                                >
                                                    <FormattedMessage
                                                        id="kyc_status.paused_status"
                                                        defaultMessage="Paused"
                                                    />
                                                </Text2>
                                            )

                                        case 'approved':
                                            return (
                                                <Text2
                                                    variant="footnote"
                                                    color="textStatusSuccessOnColor"
                                                    weight="regular"
                                                >
                                                    <FormattedMessage
                                                        id="kyc_status.completed_status"
                                                        defaultMessage="Complete"
                                                    />
                                                </Text2>
                                            )
                                        default:
                                            return notReachable(status)
                                    }
                                })()}
                            </Row>
                        </Column2>
                    </Row>

                    {(() => {
                        switch (status.type) {
                            case 'in_progress':
                            case 'not_started':
                                return (
                                    <ProgressThin
                                        background="neutral"
                                        initialProgress={null}
                                        progress={pendingProgress}
                                        animationTimeMs={ANIMATION_TIME_MS}
                                    />
                                )
                            case 'paused':
                                return (
                                    <ProgressThin
                                        background="warning"
                                        initialProgress={pendingProgress}
                                        progress={1}
                                        animationTimeMs={ANIMATION_TIME_MS}
                                    />
                                )
                            case 'failed':
                                return (
                                    <ProgressThin
                                        background="critical"
                                        initialProgress={pendingProgress}
                                        progress={1}
                                        animationTimeMs={ANIMATION_TIME_MS}
                                    />
                                )
                            case 'approved':
                                return (
                                    <ProgressThin
                                        background="success"
                                        initialProgress={pendingProgress}
                                        progress={1}
                                        animationTimeMs={ANIMATION_TIME_MS}
                                    />
                                )
                            default:
                                return notReachable(status)
                        }
                    })()}
                </Column2>
            </Group>
        </div>
    )
}
