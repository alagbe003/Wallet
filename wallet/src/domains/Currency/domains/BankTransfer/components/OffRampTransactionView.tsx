import { FormattedMessage, useIntl } from 'react-intl'
import {
    CryptoCurrency,
    CurrencyId,
    FiatCurrency,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { Avatar } from 'src/domains/Currency/components/Avatar'
import {
    OffRampTransactionEvent,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { ImperativeError } from '@zeal/domains/Error'
import { FormattedFiatCurrency } from '@zeal/domains/Money/components/FormattedFiatCurrency'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { NetworkMap } from '@zeal/domains/Network'
import { FancyButton } from 'src/domains/Network/components/FancyButton'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { notReachable } from '@zeal/toolkit'
import { Column2 } from 'src/uikit/Column2'
import { Section } from 'src/uikit/Group'
import { GroupHeader } from '@zeal/uikit/Group'
import { BoldDangerTriangle } from 'src/uikit/Icon/BoldDangerTriangle'
import { BoldTickRound } from 'src/uikit/Icon/BoldTickRound'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Spinner } from 'src/uikit/Spinner'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    variant:
        | {
              type: 'status'
              offRampTransactionEvent: OffRampTransactionEvent | null
          }
        | { type: 'no_status' }
    withdrawalRequest: WithdrawalRequest
    networkMap: NetworkMap
}
export type Msg = { type: 'close' }

export const OffRampTransactionView = ({
    withdrawalRequest,
    networkMap,
    variant,
}: Props) => {
    const { formatMessage } = useIntl()
    const { knownCurrencies } = withdrawalRequest

    const fromCurrency = getCryptoCurrency({
        cryptoCurrencyId: withdrawalRequest.fromAmount.currencyId,
        knownCurrencies,
    })

    const toCurrency = getFiatCurrency({
        fiatCurrencyId: (() => {
            switch (withdrawalRequest.type) {
                case 'full_withdrawal_request':
                    return withdrawalRequest.toAmount.currencyId
                case 'incomplete_withdrawal_request':
                    return withdrawalRequest.currencyId
                default:
                    return notReachable(withdrawalRequest)
            }
        })(),
        knownCurrencies,
    })

    const fromNetwork = findNetworkByHexChainId(
        fromCurrency.networkHexChainId,
        networkMap
    )

    return (
        <Column2 spacing={16}>
            <Section>
                <GroupHeader
                    left={
                        <FormattedMessage
                            id="currency.withdrawal.amount_from"
                            defaultMessage="From"
                        />
                    }
                    right={
                        <FancyButton
                            rounded={true}
                            network={fromNetwork}
                            onClick={null}
                        />
                    }
                />
                <ListItem2
                    aria-selected={false}
                    size="regular"
                    primaryText={fromCurrency.code}
                    avatar={({ size }) => (
                        <Avatar
                            rightBadge={() => null}
                            size={size}
                            currency={fromCurrency}
                        />
                    )}
                    side={{
                        title: (
                            <>
                                -
                                <FormattedTokenBalances
                                    money={withdrawalRequest.fromAmount}
                                    knownCurrencies={knownCurrencies}
                                />
                            </>
                        ),
                        rightIcon: ({ size }) => {
                            switch (variant.type) {
                                case 'status':
                                    return (
                                        <BoldTickRound
                                            aria-label={formatMessage({
                                                id: 'withdrawal_request.completed',
                                                defaultMessage: 'Completed',
                                            })}
                                            size={size}
                                            color="iconStatusSuccess"
                                        />
                                    )
                                case 'no_status':
                                    return null

                                default:
                                    return notReachable(variant)
                            }
                        },
                    }}
                />
            </Section>
            <Section>
                <GroupHeader
                    left={
                        <FormattedMessage
                            id="currency.withdrawal.amount_to"
                            defaultMessage="To"
                        />
                    }
                    right={null}
                />
                <ListItem2
                    aria-selected={false}
                    size="regular"
                    primaryText={toCurrency.code}
                    avatar={({ size }) => (
                        <Avatar
                            rightBadge={() => null}
                            size={size}
                            currency={toCurrency}
                        />
                    )}
                    side={{
                        title: (() => {
                            switch (withdrawalRequest.type) {
                                case 'full_withdrawal_request':
                                    return (
                                        <>
                                            +
                                            <FormattedFiatCurrency
                                                money={
                                                    withdrawalRequest.toAmount
                                                }
                                                knownCurrencies={
                                                    knownCurrencies
                                                }
                                                minimumFractionDigits={2}
                                            />
                                        </>
                                    )

                                case 'incomplete_withdrawal_request':
                                    return (
                                        <Text2
                                            variant="paragraph"
                                            color="textDisabled"
                                            weight="regular"
                                        >
                                            unknown
                                        </Text2>
                                    )

                                default:
                                    return notReachable(withdrawalRequest)
                            }
                        })(),
                        rightIcon: ({ size }) => {
                            switch (variant.type) {
                                case 'status':
                                    return (
                                        <FiatStatusIcon
                                            transactionEvent={
                                                variant.offRampTransactionEvent
                                            }
                                            size={size}
                                        />
                                    )
                                case 'no_status':
                                    return null

                                default:
                                    return notReachable(variant)
                            }
                        },
                    }}
                />
            </Section>
        </Column2>
    )
}

const FiatStatusIcon = ({
    transactionEvent,
    size,
}: {
    transactionEvent: OffRampTransactionEvent | null
    size: number
}) => {
    const { formatMessage } = useIntl()

    if (!transactionEvent) {
        return (
            <Spinner
                aria-label={formatMessage({
                    id: 'withdrawal_request.pending',
                    defaultMessage: 'Pending',
                })}
                size={size}
                color="iconStatusNeutral"
            />
        )
    }

    switch (transactionEvent.type) {
        case 'unblock_offramp_in_progress':
        case 'unblock_offramp_fiat_transfer_issued':
        case 'unblock_offramp_on_hold':
            return (
                <Spinner
                    aria-label={formatMessage({
                        id: 'withdrawal_request.pending',
                        defaultMessage: 'Pending',
                    })}
                    size={size}
                    color="iconStatusNeutral"
                />
            )

        case 'unblock_offramp_success':
            return (
                <BoldTickRound
                    aria-label={formatMessage({
                        id: 'withdrawal_request.completed',
                        defaultMessage: 'Completed',
                    })}
                    size={size}
                    color="iconStatusSuccess"
                />
            )

        case 'unblock_offramp_failed':
            return (
                <BoldDangerTriangle
                    aria-label={formatMessage({
                        id: 'withdrawal_request.failed',
                        defaultMessage: 'Failed',
                    })}
                    size={size}
                    color="iconStatusCritical"
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(transactionEvent)
    }
}

const getCryptoCurrency = ({
    cryptoCurrencyId,
    knownCurrencies,
}: {
    cryptoCurrencyId: CurrencyId
    knownCurrencies: KnownCurrencies
}): CryptoCurrency => {
    const currency = knownCurrencies[cryptoCurrencyId]
    if (!currency) {
        throw new ImperativeError('currency is missing in `knownCurrencies`')
    }

    switch (currency.type) {
        case 'FiatCurrency':
            throw new ImperativeError('Fiat currency can not be here')

        case 'CryptoCurrency':
            return currency
        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}

const getFiatCurrency = ({
    fiatCurrencyId,
    knownCurrencies,
}: {
    fiatCurrencyId: CurrencyId
    knownCurrencies: KnownCurrencies
}): FiatCurrency => {
    const currency = knownCurrencies[fiatCurrencyId]
    if (!currency) {
        throw new ImperativeError('currency is missing in `knownCurrencies`')
    }

    switch (currency.type) {
        case 'CryptoCurrency':
            throw new ImperativeError('Fiat currency can not be here')

        case 'FiatCurrency':
            return currency
        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}
