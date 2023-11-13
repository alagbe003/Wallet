import { OnRampTransactionEvent } from '@zeal/domains/Currency/domains/BankTransfer'
import { notReachable } from '@zeal/toolkit'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { Column2 } from 'src/uikit/Column2'
import { Row } from '@zeal/uikit/Row'
import { Text2 } from 'src/uikit/Text2'
import { FormattedMessage } from 'react-intl'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Group } from 'src/uikit/Group'
import { BoldDownload } from 'src/uikit/Icon/BoldDownload'
import {
    CryptoCurrency,
    CurrencyId,
    FiatCurrency,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { ImperativeError } from '@zeal/domains/Error'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { ExternalLink } from 'src/uikit/Icon/ExternalLink'
import { ProgressThin } from 'src/uikit/ProgressThin'
import React from 'react'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { NetworkMap } from '@zeal/domains/Network'
import { getExplorerLink } from '@zeal/domains/Transactions/domains/TransactionHash/helpers/getExplorerLink'

type Props = {
    event: OnRampTransactionEvent
    bankTransferCurrencies: BankTransferCurrencies
    networkMap: NetworkMap
}

const getFiatCurrency = (
    currencyId: CurrencyId,
    knownCurrencies: KnownCurrencies
): FiatCurrency => {
    const currency = knownCurrencies[currencyId] || null

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
    currencyId: CurrencyId,
    knownCurrencies: KnownCurrencies
): CryptoCurrency => {
    const currency = knownCurrencies[currencyId] || null

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

const getProgress = (event: OnRampTransactionEvent): number => {
    switch (event.type) {
        case 'unblock_onramp_transfer_received':
        case 'unblock_onramp_transfer_in_review':
            return 0.2
        case 'unblock_onramp_transfer_approved':
            return 0.5
        case 'unblock_onramp_crypto_transfer_issued':
            return 0.7
        case 'unblock_onramp_process_completed':
            return 1
        /* istanbul ignore next */
        default:
            return notReachable(event)
    }
}

const getProgressColour = (
    event: OnRampTransactionEvent
): React.ComponentProps<typeof ProgressThin>['background'] => {
    switch (event.type) {
        case 'unblock_onramp_transfer_received':
        case 'unblock_onramp_transfer_in_review':
        case 'unblock_onramp_crypto_transfer_issued':
        case 'unblock_onramp_transfer_approved':
            return 'neutral'
        case 'unblock_onramp_process_completed':
            return 'success'
        /* istanbul ignore next */
        default:
            return notReachable(event)
    }
}

export const Layout = ({
    event,
    bankTransferCurrencies,
    networkMap,
}: Props) => {
    return (
        <Group variant="default">
            <Column2 spacing={12}>
                <Row spacing={12}>
                    <BoldDownload size={32} color="iconDefault" />
                    <Column2 spacing={4}>
                        <Text2
                            variant="callout"
                            weight="medium"
                            color="textPrimary"
                        >
                            <FormattedMessage
                                id="bank-transfer.deposit.widget.title"
                                defaultMessage="Deposit"
                            />
                        </Text2>

                        <Row spacing={8}>
                            <Text2
                                variant="footnote"
                                weight="regular"
                                color="textSecondary"
                            >
                                <Subtitle
                                    event={event}
                                    bankTransferCurrencies={
                                        bankTransferCurrencies
                                    }
                                />
                            </Text2>

                            <Spacer2 />

                            <Status
                                event={event}
                                networkMap={networkMap}
                                bankTransferCurrencies={bankTransferCurrencies}
                            />
                        </Row>
                    </Column2>
                </Row>
                <Progress event={event} />
            </Column2>
        </Group>
    )
}

const Subtitle = ({
    event,
    bankTransferCurrencies,
}: {
    event: OnRampTransactionEvent
    bankTransferCurrencies: BankTransferCurrencies
}) => {
    const fiatCurrency = getFiatCurrency(
        event.fiat.currencyId,
        bankTransferCurrencies.knownCurrencies
    )
    switch (event.type) {
        case 'unblock_onramp_transfer_received':
        case 'unblock_onramp_transfer_in_review':
        case 'unblock_onramp_transfer_approved':
            return <>{fiatCurrency.code}</>
        case 'unblock_onramp_crypto_transfer_issued':
        case 'unblock_onramp_process_completed':
            const cryptoCurrency = getCryptoCurrency(
                event.crypto.currencyId,
                bankTransferCurrencies.knownCurrencies
            )
            return (
                <FormattedMessage
                    id="bank-transfer.deposit.widget.subtitle"
                    defaultMessage="{from} to {to}"
                    values={{
                        from: fiatCurrency.code,
                        to: cryptoCurrency.code,
                    }}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(event)
    }
}

const Status = ({ event, bankTransferCurrencies, networkMap }: Props) => {
    switch (event.type) {
        case 'unblock_onramp_transfer_received':
        case 'unblock_onramp_transfer_in_review':
        case 'unblock_onramp_transfer_approved':
            return (
                <Text2
                    variant="footnote"
                    weight="regular"
                    color="textStatusNeutralOnColor"
                >
                    <FormattedMessage
                        id="bank-transfer.deposit.widget.status.transfer-received"
                        defaultMessage="Funds received"
                    />
                </Text2>
            )
        case 'unblock_onramp_crypto_transfer_issued': {
            const cryptoCurrency = getCryptoCurrency(
                event.crypto.currencyId,
                bankTransferCurrencies.knownCurrencies
            )
            const network = findNetworkByHexChainId(
                cryptoCurrency.networkHexChainId,
                networkMap
            )
            const explorerLink = getExplorerLink(
                { transactionHash: event.transactionHash },
                network
            )
            return (
                <Row spacing={8}>
                    <Text2
                        variant="footnote"
                        weight="regular"
                        color="textStatusNeutralOnColor"
                    >
                        <FormattedMessage
                            id="bank-transfer.deposit.widget.status.transfer-received"
                            defaultMessage="Sending to wallet"
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
        }
        case 'unblock_onramp_process_completed': {
            const cryptoCurrency = getCryptoCurrency(
                event.crypto.currencyId,
                bankTransferCurrencies.knownCurrencies
            )
            const network = findNetworkByHexChainId(
                cryptoCurrency.networkHexChainId,
                networkMap
            )
            const explorerLink = getExplorerLink(
                { transactionHash: event.transactionHash },
                network
            )
            return (
                <Row spacing={8}>
                    <Text2
                        variant="footnote"
                        weight="regular"
                        color="textStatusSuccessOnColor"
                    >
                        <FormattedMessage
                            id="bank-transfer.deposit.widget.status.complete"
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
        }

        /* istanbul ignore next */
        default:
            return notReachable(event)
    }
}

const Progress = ({ event }: { event: OnRampTransactionEvent }) => {
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
