import { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { Avatar } from 'src/domains/Currency/components/Avatar'
import { OnRampTransactionCryptoTransferIssuedEvent } from '@zeal/domains/Currency/domains/BankTransfer'
import { ON_RAMP_SERVICE_TIME_MS } from '@zeal/domains/Currency/domains/BankTransfer/constants'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { NetworkMap } from '@zeal/domains/Network'
import { Badge } from '@zeal/domains/Network/components/Badge'
import { notReachable } from '@zeal/toolkit'
import { Column2 } from 'src/uikit/Column2'
import { Section } from 'src/uikit/Group'
import { GroupHeader } from '@zeal/uikit/Group'
import { BoldTickRound } from 'src/uikit/Icon/BoldTickRound'
import { Content } from 'src/uikit/Layout/Content'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Progress2 } from 'src/uikit/Progress/Progress2'
import { Spinner } from 'src/uikit/Spinner'
import { useReadableDuration } from '@zeal/toolkit/Date/useReadableDuration'

type Props = {
    event: OnRampTransactionCryptoTransferIssuedEvent
    now: number
    startedAt: number
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
}

export const CryptoTransferIssued = ({
    event,
    now,
    startedAt,
    knownCurrencies,
    networkMap,
}: Props) => {
    const { formatMessage } = useIntl()
    const formatHumanReadableDuration = useReadableDuration()
    const fiatCurrency = useCurrencyById(event.fiat.currencyId, knownCurrencies)
    const cryptoCurrency = useCurrencyById(
        event.crypto.currencyId,
        knownCurrencies
    )

    useEffect(() => {
        if (!fiatCurrency) {
            captureError(
                new ImperativeError(
                    `Failed to find fiat currency ${event.fiat.currencyId} for the event trx uuid ${event.transactionUuid}`
                )
            )
        }
    }, [fiatCurrency, event])

    useEffect(() => {
        if (!cryptoCurrency) {
            captureError(
                new ImperativeError(
                    `Failed to find crypto currency ${event.crypto.currencyId} for the event trx uuid ${event.transactionUuid}`
                )
            )
        } else {
            switch (cryptoCurrency.type) {
                case 'FiatCurrency':
                    captureError(
                        new ImperativeError(
                            `cryptoCurrency ${event.crypto.currencyId} appears to be fiat currency trx uuid ${event.transactionUuid}`
                        )
                    )
                    break

                case 'CryptoCurrency':
                    // Expected outcome
                    break

                default:
                    return notReachable(cryptoCurrency)
            }
        }
    }, [cryptoCurrency, event])

    return (
        <Content
            header={
                <Content.Header
                    title={
                        <FormattedMessage
                            id="currency.bankTransfer.deposit_status.title"
                            defaultMessage="Deposit"
                        />
                    }
                />
            }
            footer={
                <Progress2
                    initialProgress={0.2}
                    progress={0.7}
                    title={
                        <FormattedMessage
                            id="MonitorOnRamp.sendingToYourWallet"
                            defaultMessage="Sending to your wallet"
                        />
                    }
                    right={`${formatHumanReadableDuration(
                        now - startedAt,
                        'floor'
                    )} / ${formatHumanReadableDuration(
                        ON_RAMP_SERVICE_TIME_MS
                    )}`}
                    variant="neutral"
                />
            }
        >
            <Column2 spacing={16}>
                {fiatCurrency && (
                    <Section>
                        <GroupHeader
                            left={
                                <FormattedMessage
                                    id="MonitorOnRamp.from"
                                    defaultMessage="From"
                                />
                            }
                            right={null}
                        />
                        <ListItem2
                            aria-selected={false}
                            size="large"
                            primaryText={fiatCurrency.code}
                            avatar={({ size }) => (
                                <Avatar
                                    rightBadge={() => null}
                                    size={size}
                                    currency={fiatCurrency}
                                />
                            )}
                            side={{
                                title: (
                                    <>
                                        -
                                        <FormattedTokenBalances
                                            money={event.fiat}
                                            knownCurrencies={knownCurrencies}
                                        />
                                    </>
                                ),
                                rightIcon: ({ size }) => (
                                    <BoldTickRound
                                        aria-label={formatMessage({
                                            id: 'on_ramp.fiat_completed',
                                            defaultMessage: 'Completed',
                                        })}
                                        size={size}
                                        color="iconStatusSuccess"
                                    />
                                ),
                            }}
                        />
                    </Section>
                )}

                {cryptoCurrency && (
                    <Section>
                        <GroupHeader
                            left={
                                <FormattedMessage
                                    id="MonitorOnRamp.to"
                                    defaultMessage="To"
                                />
                            }
                            right={null}
                        />
                        <ListItem2
                            aria-selected={false}
                            size="large"
                            primaryText={cryptoCurrency.code}
                            avatar={({ size }) => (
                                <Avatar
                                    rightBadge={({ size }) => {
                                        switch (cryptoCurrency.type) {
                                            case 'FiatCurrency':
                                                return null

                                            case 'CryptoCurrency':
                                                return (
                                                    <Badge
                                                        network={
                                                            networkMap[
                                                                cryptoCurrency
                                                                    .networkHexChainId
                                                            ]
                                                        }
                                                        size={size}
                                                    />
                                                )

                                            default:
                                                return notReachable(
                                                    cryptoCurrency
                                                )
                                        }
                                    }}
                                    size={size}
                                    currency={cryptoCurrency}
                                />
                            )}
                            side={{
                                title: (
                                    <>
                                        +
                                        <FormattedTokenBalances
                                            money={event.crypto}
                                            knownCurrencies={knownCurrencies}
                                        />
                                    </>
                                ),
                                rightIcon: ({ size }) => (
                                    <Spinner
                                        size={size}
                                        color="iconStatusNeutral"
                                    />
                                ),
                            }}
                        />
                    </Section>
                )}
            </Column2>
        </Content>
    )
}
