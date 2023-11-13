import { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { Avatar } from 'src/domains/Currency/components/Avatar'
import {
    OnRampTransactionOutsideTransferInReviewEvent,
    OnRampTransactionTransferApprovedEvent,
    OnRampTransactionTransferReceivedEvent,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { ON_RAMP_SERVICE_TIME_MS } from '@zeal/domains/Currency/domains/BankTransfer/constants'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { NetworkMap } from '@zeal/domains/Network'
import { Badge } from '@zeal/domains/Network/components/Badge'
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
    networkMap: NetworkMap
    event:
        | OnRampTransactionTransferReceivedEvent
        | OnRampTransactionOutsideTransferInReviewEvent
        | OnRampTransactionTransferApprovedEvent
    now: number
    startedAt: number
    form: OnRampFeeParams
    knownCurrencies: KnownCurrencies
}

export const TransferReceivedOrInReview = ({
    event,
    form,
    knownCurrencies,
    networkMap,
    now,
    startedAt,
}: Props) => {
    const { formatMessage } = useIntl()
    const fiatCurrency = useCurrencyById(event.fiat.currencyId, knownCurrencies)
    const formatHumanReadableDuration = useReadableDuration()

    useEffect(() => {
        if (!fiatCurrency) {
            captureError(
                new ImperativeError(
                    `Failed to find fiat currency ${event.fiat.currencyId} for the event trx uuid ${event.transactionUuid}`
                )
            )
        }
    }, [fiatCurrency, event])

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
                    initialProgress={0.1}
                    progress={0.2}
                    title={
                        <FormattedMessage
                            id="MonitorOnRamp.fundsReceived"
                            defaultMessage="Funds received"
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
                        primaryText={form.outputCurrency.code}
                        avatar={({ size }) => (
                            <Avatar
                                rightBadge={({ size }) => (
                                    <Badge
                                        network={
                                            networkMap[
                                                form.outputCurrency
                                                    .networkHexChainId
                                            ]
                                        }
                                        size={size}
                                    />
                                )}
                                size={size}
                                currency={form.outputCurrency}
                            />
                        )}
                        side={{
                            rightIcon: ({ size }) => (
                                <Spinner
                                    size={size}
                                    color="iconStatusNeutral"
                                />
                            ),
                        }}
                    />
                </Section>
            </Column2>
        </Content>
    )
}
