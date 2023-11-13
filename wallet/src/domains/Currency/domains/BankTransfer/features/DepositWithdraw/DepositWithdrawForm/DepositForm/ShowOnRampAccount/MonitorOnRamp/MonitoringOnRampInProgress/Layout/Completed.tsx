import { useEffect, useState } from 'react'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { OnRampTransactionProcessCompletedEvent } from '@zeal/domains/Currency/domains/BankTransfer'
import { notReachable } from '@zeal/toolkit'
import { Content } from 'src/uikit/Layout/Content'
import { FormattedMessage, useIntl } from 'react-intl'
import { Progress2 } from 'src/uikit/Progress/Progress2'
import { CheckMarkCircle } from 'src/uikit/Icon/CheckMarkCircle'
import { Button } from 'src/uikit'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { ImperativeError } from '@zeal/domains/Error'
import { Section } from 'src/uikit/Group'
import { GroupHeader } from '@zeal/uikit/Group'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Avatar } from 'src/domains/Currency/components/Avatar'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { BoldTickRound } from 'src/uikit/Icon/BoldTickRound'
import { Column2 } from 'src/uikit/Column2'
import { Badge } from '@zeal/domains/Network/components/Badge'
import { NetworkMap } from '@zeal/domains/Network'

type Props = {
    event: OnRampTransactionProcessCompletedEvent
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'on_on_ramp_transfer_success_close_click'
    event: OnRampTransactionProcessCompletedEvent
}

type State = { type: 'success_animation' } | { type: 'final_screen' }

export const Completed = ({
    event,
    knownCurrencies,
    onMsg,
    networkMap,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'success_animation' })
    const { formatMessage } = useIntl()

    const cryptoCurrency = useCurrencyById(
        event.crypto.currencyId,
        knownCurrencies
    )
    const fiatCurrency = useCurrencyById(event.fiat.currencyId, knownCurrencies)

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

    switch (state.type) {
        case 'success_animation':
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
                            initialProgress={0.8}
                            progress={1}
                            title={
                                <FormattedMessage
                                    id="currency.bankTransfer.on_ramp.complete"
                                    defaultMessage="Complete"
                                />
                            }
                            variant="success"
                            right={
                                <CheckMarkCircle
                                    size={20}
                                    color="iconStatusSuccessOnColor"
                                />
                            }
                        />
                    }
                >
                    <Content.Splash
                        onAnimationComplete={() =>
                            setState({ type: 'final_screen' })
                        }
                        variant="success"
                        title={
                            <FormattedMessage
                                id="currency.bankTransfer.deposit_status.success"
                                defaultMessage="Received in your wallet"
                            />
                        }
                    />
                </Content>
            )

        case 'final_screen':
            return (
                <>
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
                            fiatCurrency && cryptoCurrency ? (
                                <Progress2
                                    variant="success"
                                    title={
                                        <FormattedMessage
                                            id="currency.bankTransfer.deposit_status.finished.title"
                                            defaultMessage="You've received {crypto}"
                                            values={{
                                                crypto: cryptoCurrency.code,
                                            }}
                                        />
                                    }
                                    subtitle={
                                        <FormattedMessage
                                            id="currency.bankTransfer.deposit_status.finished.subtitle"
                                            defaultMessage="Your bank transfer has successfully transferred {fiat} to {crypto}."
                                            values={{
                                                fiat: fiatCurrency.code,
                                                crypto: cryptoCurrency.code,
                                            }}
                                        />
                                    }
                                    initialProgress={1}
                                    progress={1}
                                />
                            ) : null
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
                                                        knownCurrencies={
                                                            knownCurrencies
                                                        }
                                                    />
                                                </>
                                            ),
                                            rightIcon: ({ size }) => (
                                                <BoldTickRound
                                                    aria-label={formatMessage({
                                                        id: 'on_ramp.fiat_completed',
                                                        defaultMessage:
                                                            'Completed',
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
                                                    switch (
                                                        cryptoCurrency.type
                                                    ) {
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
                                                        knownCurrencies={
                                                            knownCurrencies
                                                        }
                                                    />
                                                </>
                                            ),
                                            rightIcon: ({ size }) => (
                                                <BoldTickRound
                                                    aria-label={formatMessage({
                                                        id: 'on_ramp.fiat_completed',
                                                        defaultMessage:
                                                            'Completed',
                                                    })}
                                                    size={size}
                                                    color="iconStatusSuccess"
                                                />
                                            ),
                                        }}
                                    />
                                </Section>
                            )}
                        </Column2>
                    </Content>

                    <Button
                        size="regular"
                        variant="primary"
                        onClick={() =>
                            onMsg({
                                type: 'on_on_ramp_transfer_success_close_click',
                                event,
                            })
                        }
                    >
                        <FormattedMessage
                            id="actions.close"
                            defaultMessage="Close"
                        />
                    </Button>
                </>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
