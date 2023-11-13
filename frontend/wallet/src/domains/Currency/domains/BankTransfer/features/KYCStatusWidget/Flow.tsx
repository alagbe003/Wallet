import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import {
    KYCStatusChangedEvent,
    UnblockLoginSignature,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { fetchBankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { fetchUnblockEvents } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchUnblockEvents'
import { useCaptureErrorOnce } from 'src/domains/Error/hooks/useCaptureErrorOnce'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { notReachable } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Column2 } from 'src/uikit/Column2'
import { Group } from 'src/uikit/Group'
import { BoldId } from 'src/uikit/Icon/BoldID'
import { Row } from '@zeal/uikit/Row'
import { Skeleton as UISkeleton } from 'src/uikit/Skeleton'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Text2 } from 'src/uikit/Text2'
import { Status } from './Status'

type Props = {
    unblockLoginSignature: UnblockLoginSignature
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof Status>

const fetch = async ({
    unblockLoginSignature,
}: {
    unblockLoginSignature: UnblockLoginSignature
    signal?: AbortSignal
}): Promise<KYCStatusChangedEvent | null> => {
    const bankTransferCurrencies = await fetchBankTransferCurrencies()

    const events = await fetchUnblockEvents({
        unblockLoginSignature,
        bankTransferCurrencies,
    })

    const kycEvents = events
        .filter((event): event is KYCStatusChangedEvent => {
            switch (event.type) {
                case 'kyc_event_status_changed':
                    return true
                case 'unblock_offramp_in_progress':
                case 'unblock_offramp_fiat_transfer_issued':
                case 'unblock_offramp_success':
                case 'unblock_offramp_on_hold':
                case 'unblock_offramp_failed':
                case 'unblock_onramp_transfer_received':
                case 'unblock_onramp_crypto_transfer_issued':
                case 'unblock_onramp_process_completed':
                case 'unblock_onramp_transfer_in_review':
                case 'unblock_onramp_transfer_approved':
                    return false

                /* istanbul ignore next */
                default:
                    return notReachable(event)
            }
        })
        .sort((a, b) => b.createdAt - a.createdAt)

    return kycEvents[0] || null
}

export const Flow = ({ unblockLoginSignature, onMsg }: Props) => {
    const captureErrorOnce = useCaptureErrorOnce()
    const [pollable] = usePollableData(
        fetch,
        {
            type: 'loading',
            params: {
                unblockLoginSignature,
            },
        },
        {
            stopIf: (pollable) => {
                switch (pollable.type) {
                    case 'loaded':
                        if (!pollable.data) {
                            return false
                        }

                        switch (pollable.data.status.type) {
                            case 'not_started':
                            case 'in_progress':
                                return false

                            case 'approved':
                            case 'paused':
                            case 'failed':
                                return true

                            /* istanbul ignore next */
                            default:
                                return notReachable(pollable.data.status)
                        }
                    case 'subsequent_failed':
                    case 'error':
                    case 'loading':
                    case 'reloading':
                        return false

                    /* istanbul ignore next */
                    default:
                        return notReachable(pollable)
                }
            },
            pollIntervalMilliseconds: 5000,
        }
    )

    useEffect(() => {
        switch (pollable.type) {
            case 'subsequent_failed':
            case 'error':
                captureErrorOnce(parseAppError(pollable.error))
                break

            case 'loaded':
            case 'reloading':
            case 'loading':
                break

            /* istanbul ignore next */
            default:
                notReachable(pollable)
        }
    }, [pollable, captureErrorOnce])

    switch (pollable.type) {
        case 'error':
        case 'loading':
            return <Skeleton />

        case 'reloading':
        case 'subsequent_failed':
        case 'loaded':
            return pollable.data ? (
                <Status status={pollable.data.status} onMsg={onMsg} />
            ) : (
                <Skeleton />
            )

        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}

const Skeleton = () => {
    return (
        <Group variant="default">
            <Column2 spacing={12}>
                <Row spacing={12}>
                    <BoldId size={32} color="iconDefault" />
                    <Column2 spacing={4}>
                        <Text2
                            variant="callout"
                            weight="medium"
                            color="textPrimary"
                        >
                            <FormattedMessage
                                id="bank_transfer.kyc_status_widget.title"
                                defaultMessage="Verifying identity"
                            />
                        </Text2>

                        <Row spacing={8}>
                            <Text2
                                variant="footnote"
                                weight="regular"
                                color="textSecondary"
                            >
                                <FormattedMessage
                                    id="bank_transfer.kyc_status_widget.subtitle"
                                    defaultMessage="Bank transfers"
                                />
                            </Text2>

                            <Spacer2 />

                            <UISkeleton
                                variant="default"
                                width={55}
                                height={15}
                            />
                        </Row>
                    </Column2>
                </Row>

                <UISkeleton variant="default" width="100%" height={8} />
            </Column2>
        </Group>
    )
}
