import {
    OffRampTransactionEvent,
    SubmittedOfframpTransaction,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { NetworkMap } from '@zeal/domains/Network'
import { CryptoCurrency, FiatCurrency } from '@zeal/domains/Currency'
import { ImperativeError } from '@zeal/domains/Error'
import { notReachable } from '@zeal/toolkit'
import React from 'react'
import { ProgressThin } from 'src/uikit/ProgressThin'
import { FormattedMessage } from 'react-intl'
import { Text2 } from 'src/uikit/Text2'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { getExplorerLink } from '@zeal/domains/Transactions/domains/TransactionHash/helpers/getExplorerLink'
import { Row } from '@zeal/uikit/Row'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { ExternalLink } from 'src/uikit/Icon/ExternalLink'
import { Group } from 'src/uikit/Group'
import { Column2 } from 'src/uikit/Column2'
import { Spacer2 } from 'src/uikit/Spacer2'
import { BoldUpload } from 'src/uikit/Icon/BoldUpload'

type Props = {
    event: OffRampTransactionEvent
    submittedTransaction: SubmittedOfframpTransaction
    networkMap: NetworkMap
}

const getFiatCurrency = (
    submittedTransaction: SubmittedOfframpTransaction
): FiatCurrency => {
    const { withdrawalRequest } = submittedTransaction

    const currencyId = (() => {
        switch (withdrawalRequest.type) {
            case 'incomplete_withdrawal_request':
                return withdrawalRequest.currencyId
            case 'full_withdrawal_request':
                return withdrawalRequest.toAmount.currencyId
            /* istanbul ignore next */
            default:
                return notReachable(withdrawalRequest)
        }
    })()

    const currency = withdrawalRequest.knownCurrencies[currencyId] || null

    if (!currency) {
        throw new ImperativeError(`Fiat currency with ID ${currency} not found`)
    }

    switch (currency.type) {
        case 'FiatCurrency':
            return currency
        case 'CryptoCurrency':
            throw new ImperativeError(
                `Expected fiat currency for ID ${currency}, but got Cryptocurrency`
            )
        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}

const getCryptoCurrency = (
    submittedTransaction: SubmittedOfframpTransaction
): CryptoCurrency => {
    const { withdrawalRequest } = submittedTransaction

    const currency =
        withdrawalRequest.knownCurrencies[
            withdrawalRequest.fromAmount.currencyId
        ] || null

    if (!currency) {
        throw new ImperativeError(
            `Crypto currency with ID ${currency} not found`
        )
    }

    switch (currency.type) {
        case 'FiatCurrency':
            throw new ImperativeError(
                `Expected crypto currency for ID ${currency}, but got FiatCurrency`
            )
        case 'CryptoCurrency':
            return currency
        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}

const getProgress = (event: OffRampTransactionEvent): number => {
    switch (event.type) {
        case 'unblock_offramp_in_progress':
            return 0.6
        case 'unblock_offramp_fiat_transfer_issued':
            return 0.8
        case 'unblock_offramp_on_hold':
        case 'unblock_offramp_success':
        case 'unblock_offramp_failed':
            return 1
        /* istanbul ignore next */
        default:
            return notReachable(event)
    }
}

const getProgressColour = (
    event: OffRampTransactionEvent
): React.ComponentProps<typeof ProgressThin>['background'] => {
    switch (event.type) {
        case 'unblock_offramp_in_progress':
        case 'unblock_offramp_fiat_transfer_issued':
            return 'neutral'
        case 'unblock_offramp_on_hold':
            return 'warning'
        case 'unblock_offramp_success':
            return 'success'
        case 'unblock_offramp_failed':
            return 'critical'

        /* istanbul ignore next */
        default:
            return notReachable(event)
    }
}

export const Layout = ({ event, submittedTransaction, networkMap }: Props) => {
    const cryptoCurrency = getCryptoCurrency(submittedTransaction)
    const fiatCurrency = getFiatCurrency(submittedTransaction)

    return (
        <Group variant="default">
            <Column2 spacing={12}>
                <Row spacing={12}>
                    <BoldUpload size={32} color="iconDefault" />
                    <Column2 spacing={4}>
                        <Text2
                            variant="callout"
                            weight="medium"
                            color="textPrimary"
                        >
                            <FormattedMessage
                                id="bank-transfer.withdrawal.widget.title"
                                defaultMessage="Withdrawal"
                            />
                        </Text2>

                        <Row spacing={8}>
                            <Text2
                                variant="footnote"
                                weight="regular"
                                color="textSecondary"
                            >
                                <FormattedMessage
                                    id="bank-transfer.withdrawal.widget.subtitle"
                                    defaultMessage="{from} to {to}"
                                    values={{
                                        from: cryptoCurrency.code,
                                        to: fiatCurrency.code,
                                    }}
                                />
                            </Text2>

                            <Spacer2 />

                            <Status
                                event={event}
                                networkMap={networkMap}
                                cryptoCurrency={cryptoCurrency}
                            />
                        </Row>
                    </Column2>
                </Row>
                <Progress event={event} />
            </Column2>
        </Group>
    )
}

const Status = ({
    event,
    networkMap,
    cryptoCurrency,
}: {
    event: OffRampTransactionEvent
    networkMap: NetworkMap
    cryptoCurrency: CryptoCurrency
}) => {
    const explorerLink = getExplorerLink(
        {
            transactionHash: event.transactionHash,
        },
        findNetworkByHexChainId(cryptoCurrency.networkHexChainId, networkMap)
    )

    switch (event.type) {
        case 'unblock_offramp_in_progress':
            return (
                <Row spacing={8}>
                    <Text2
                        variant="footnote"
                        weight="regular"
                        color="textStatusNeutralOnColor"
                    >
                        <FormattedMessage
                            id="bank-transfer.withdrawal.widget.status.in-progress"
                            defaultMessage="Making transfer"
                        />
                    </Text2>

                    <Text2
                        variant="footnote"
                        weight="regular"
                        color="textStatusNeutralOnColor"
                    >
                        <Tertiary
                            size="small"
                            color="neutral"
                            onClick={() => window.open(explorerLink)}
                        >
                            <Row spacing={0}>
                                <Text2>0x</Text2>
                                <ExternalLink size={14} />
                            </Row>
                        </Tertiary>
                    </Text2>
                </Row>
            )
        case 'unblock_offramp_fiat_transfer_issued':
            return (
                <Row spacing={8}>
                    <Text2
                        variant="footnote"
                        weight="regular"
                        color="textStatusNeutralOnColor"
                    >
                        <FormattedMessage
                            id="bank-transfer.withdrawal.widget.status.fiat-transfer-issued"
                            defaultMessage="Sending to bank"
                        />
                    </Text2>

                    <Text2
                        variant="footnote"
                        weight="regular"
                        color="textStatusNeutralOnColor"
                    >
                        <Tertiary
                            size="small"
                            color="neutral"
                            onClick={() => window.open(explorerLink)}
                        >
                            <Row spacing={0}>
                                <Text2>0x</Text2>
                                <ExternalLink size={14} />
                            </Row>
                        </Tertiary>
                    </Text2>
                </Row>
            )
        case 'unblock_offramp_on_hold':
            return (
                <Row spacing={8}>
                    <Text2
                        variant="footnote"
                        weight="regular"
                        color="textStatusWarningOnColor"
                    >
                        <FormattedMessage
                            id="bank-transfer.withdrawal.widget.status.on-hold"
                            defaultMessage="Transfer on hold"
                        />
                    </Text2>

                    <Text2
                        variant="footnote"
                        weight="regular"
                        color="textStatusWarningOnColor"
                    >
                        <Tertiary
                            size="small"
                            color="warning"
                            onClick={() => window.open(explorerLink)}
                        >
                            <Row spacing={0}>
                                <Text2>0x</Text2>
                                <ExternalLink size={14} />
                            </Row>
                        </Tertiary>
                    </Text2>
                </Row>
            )
        case 'unblock_offramp_success':
            return (
                <Row spacing={8}>
                    <Text2
                        variant="footnote"
                        weight="regular"
                        color="textStatusSuccessOnColor"
                    >
                        <FormattedMessage
                            id="bank-transfer.withdrawal.widget.status.success"
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
                            onClick={() => window.open(explorerLink)}
                        >
                            <Row spacing={0}>
                                <Text2>0x</Text2>
                                <ExternalLink size={14} />
                            </Row>
                        </Tertiary>
                    </Text2>
                </Row>
            )
        case 'unblock_offramp_failed':
            return (
                <Row spacing={8}>
                    <Text2
                        variant="footnote"
                        weight="regular"
                        color="textStatusCriticalOnColor"
                    >
                        <FormattedMessage
                            id="bank-transfer.withdrawal.widget.status.failed"
                            defaultMessage="Failed"
                        />
                    </Text2>

                    <Text2
                        variant="footnote"
                        weight="regular"
                        color="textStatusCriticalOnColor"
                    >
                        <Tertiary
                            size="small"
                            color="critical"
                            onClick={() => window.open(explorerLink)}
                        >
                            <Row spacing={0}>
                                <Text2>0x</Text2>
                                <ExternalLink size={14} />
                            </Row>
                        </Tertiary>
                    </Text2>
                </Row>
            )
        /* istanbul ignore next */
        default:
            return notReachable(event)
    }
}

const Progress = ({ event }: { event: OffRampTransactionEvent }) => {
    const progress = getProgress(event)
    const colour = getProgressColour(event)

    return (
        <ProgressThin
            animationTimeMs={300}
            initialProgress={null}
            progress={progress}
            background={colour}
        />
    )
}
