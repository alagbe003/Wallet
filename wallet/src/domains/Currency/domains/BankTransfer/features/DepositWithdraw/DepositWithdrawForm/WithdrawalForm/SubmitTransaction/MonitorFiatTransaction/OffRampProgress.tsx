import { ComponentProps } from 'react'
import { FormattedMessage } from 'react-intl'
import {
    OffRampTransactionEvent,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { OFF_RAMP_SERVICE_TIME_MS } from '@zeal/domains/Currency/domains/BankTransfer/constants'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { Network } from '@zeal/domains/Network'
import { getExplorerLink } from '@zeal/domains/Transactions/domains/TransactionHash/helpers/getExplorerLink'
import { notReachable } from '@zeal/toolkit'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { ExternalLink } from 'src/uikit/Icon/ExternalLink'
import { Progress2 } from 'src/uikit/Progress/Progress2'
import { Row } from '@zeal/uikit/Row'
import { Text2 } from 'src/uikit/Text2'
import { useReadableDuration } from '@zeal/toolkit/Date/useReadableDuration'

type Props = {
    startedAt: number
    now: number
    network: Network
    withdrawalRequest: WithdrawalRequest
    offRampTransactionEvent: OffRampTransactionEvent | null
    transactionHash: string
}

export const OffRampProgress = ({
    now,
    offRampTransactionEvent,
    startedAt,
    withdrawalRequest,
    transactionHash,
    network,
}: Props) => {
    const formatHumanReadableDuration = useReadableDuration()

    const rightSide = (
        <Row spacing={8}>
            <Text2>
                {`${formatHumanReadableDuration(
                    now - startedAt,
                    'floor'
                )} / ${formatHumanReadableDuration(OFF_RAMP_SERVICE_TIME_MS)}`}
            </Text2>

            <TransactionLink
                network={network}
                offRampTransactionEvent={offRampTransactionEvent}
                transactionHash={transactionHash}
            />
        </Row>
    )

    const title = (
        <Title
            offRampTransactionEvent={offRampTransactionEvent}
            withdrawalRequest={withdrawalRequest}
        />
    )

    if (!offRampTransactionEvent) {
        return (
            <Progress2
                variant="neutral"
                title={title}
                right={rightSide}
                initialProgress={0}
                progress={0.3}
            />
        )
    }

    switch (offRampTransactionEvent.type) {
        case 'unblock_offramp_in_progress':
            return (
                <Progress2
                    variant="neutral"
                    title={title}
                    right={rightSide}
                    initialProgress={0.3}
                    progress={0.6}
                />
            )

        case 'unblock_offramp_fiat_transfer_issued':
            return (
                <Progress2
                    variant="neutral"
                    title={title}
                    right={rightSide}
                    initialProgress={0.6}
                    progress={0.8}
                />
            )

        case 'unblock_offramp_success':
            return (
                <Progress2
                    variant="success"
                    title={title}
                    right={
                        <TransactionLink
                            network={network}
                            offRampTransactionEvent={offRampTransactionEvent}
                            transactionHash={transactionHash}
                        />
                    }
                    initialProgress={0.8}
                    progress={1}
                />
            )
        case 'unblock_offramp_on_hold':
            return (
                <Progress2
                    variant="warning"
                    title={title}
                    right={rightSide}
                    initialProgress={1}
                    progress={1}
                />
            )

        case 'unblock_offramp_failed':
            return (
                <Progress2
                    variant="critical"
                    title={title}
                    right={rightSide}
                    initialProgress={1}
                    progress={1}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(offRampTransactionEvent)
    }
}

const TransactionLink = ({
    transactionHash,
    network,
    offRampTransactionEvent,
}: {
    transactionHash: string
    network: Network
    offRampTransactionEvent: OffRampTransactionEvent | null
}) => {
    const link = getExplorerLink({ transactionHash }, network)

    const linkColor = ((): ComponentProps<typeof Tertiary>['color'] => {
        if (!offRampTransactionEvent) {
            return 'neutral'
        }

        switch (offRampTransactionEvent.type) {
            case 'unblock_offramp_in_progress':
            case 'unblock_offramp_fiat_transfer_issued':
            case 'unblock_offramp_on_hold':
                return 'neutral'

            case 'unblock_offramp_success':
                return 'success'

            case 'unblock_offramp_failed':
                return 'critical'

            default:
                return notReachable(offRampTransactionEvent)
        }
    })()

    return (
        <Tertiary
            size="regular"
            color={linkColor}
            onClick={() => window.open(link)}
        >
            <Row spacing={4} alignY="center">
                <Text2>0x</Text2>

                <ExternalLink size={14} />
            </Row>
        </Tertiary>
    )
}

const Title = ({
    offRampTransactionEvent,
    withdrawalRequest,
}: {
    withdrawalRequest: WithdrawalRequest
    offRampTransactionEvent: OffRampTransactionEvent | null
}) => {
    const toCurrency = useCurrencyById(
        (() => {
            switch (withdrawalRequest.type) {
                case 'full_withdrawal_request':
                    return withdrawalRequest.toAmount.currencyId
                case 'incomplete_withdrawal_request':
                    return withdrawalRequest.currencyId
                default:
                    return notReachable(withdrawalRequest)
            }
        })(),
        withdrawalRequest.knownCurrencies
    )

    if (!offRampTransactionEvent) {
        return (
            <FormattedMessage
                id="currency.bankTransfer.off_ramp.transferring_to_currency"
                defaultMessage="Transferring to {toCurrency}"
                values={{ toCurrency: toCurrency?.code }}
            />
        )
    }

    switch (offRampTransactionEvent.type) {
        case 'unblock_offramp_in_progress':
            return (
                <FormattedMessage
                    id="currency.bankTransfer.off_ramp.transferring_to_currency"
                    defaultMessage="Transferring to {toCurrency}"
                    values={{ toCurrency: toCurrency?.code }}
                />
            )

        case 'unblock_offramp_fiat_transfer_issued':
            return (
                <FormattedMessage
                    id="currency.bankTransfer.off_ramp.fiat_transfer_issued"
                    defaultMessage="Sending to your bank"
                />
            )

        case 'unblock_offramp_success':
            return (
                <FormattedMessage
                    id="currency.bankTransfer.off_ramp.complete"
                    defaultMessage="Complete"
                />
            )

        case 'unblock_offramp_on_hold':
            return (
                <FormattedMessage
                    id="currency.bankTransfer.off_ramp.transfer_on_hold"
                    defaultMessage="Transfer on hold"
                />
            )

        case 'unblock_offramp_failed':
            return (
                <FormattedMessage
                    id="currency.bankTransfer.off_ramp.transfer_failed"
                    defaultMessage="Transfer failed"
                />
            )

        default:
            return notReachable(offRampTransactionEvent)
    }
}
