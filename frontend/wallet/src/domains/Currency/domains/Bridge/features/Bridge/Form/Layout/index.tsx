import Big from 'big.js'
import { FormattedMessage, useIntl } from 'react-intl'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { CryptoCurrency } from '@zeal/domains/Currency'
import { CurrenciesMatrix } from 'src/domains/Currency/api/fetchCurrenciesMatrix'
import { Avatar as CurrencyAvatar } from 'src/domains/Currency/components/Avatar'
import {
    BridgePollable,
    BridgeRequest,
} from '@zeal/domains/Currency/domains/Bridge'
import { applyRate } from '@zeal/domains/FXRate/helpers/applyRate'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Money } from '@zeal/domains/Money'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import {
    FormattedTokenBalances,
    useFormatTokenBalance,
} from 'src/domains/Money/components/FormattedTokenBalances'
import { FancyButton as NetworkFancyButton } from 'src/domains/Network/components/FancyButton'
import { Portfolio } from '@zeal/domains/Portfolio'
import { noop, notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'
import { Button, IconButton } from 'src/uikit'
import { FancyButton } from '@zeal/uikit/FancyButton'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { Column2 } from 'src/uikit/Column2'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { LightArrowDown2 } from 'src/uikit/Icon/LightArrowDown2'
import { SolidInterfacePlus } from 'src/uikit/Icon/SolidInterfacePlus'
import { AmountInput2 } from 'src/uikit/Input/AmountInput2'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from 'src/uikit/Skeleton'
import { Spacer2 } from 'src/uikit/Spacer2'
import { TabHeader } from '@zeal/uikit/TabHeader'
import { Text2 } from 'src/uikit/Text2'
import { ErrorMessage } from './ErrorMessage'
import { Route } from './Route'
import { getBridgeRouteRequest, validateOnSubmit } from './validation'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { getNativeTokenAddress } from '@zeal/domains/Network/helpers/getNativeTokenAddress'
import { NetworkMap } from '@zeal/domains/Network'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { NextStepSeparator } from 'src/uikit/NextStepSeparator'

type Props = {
    portfolio: Portfolio
    keystoreMap: KeyStoreMap
    pollable: BridgePollable
    currenciesMatrix: CurrenciesMatrix
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_from_network_click' }
    | { type: 'on_to_network_click' }
    | { type: 'on_from_currency_click' }
    | { type: 'on_to_currency_click' }
    | { type: 'on_refuel_add_click' }
    | { type: 'on_refuel_remove_click' }
    | { type: 'on_amount_change'; amount: string | null }
    | { type: 'on_bridge_continue_clicked'; route: BridgeRequest }
    | MsgOf<typeof Route>

export const Layout = ({
    pollable,
    portfolio,
    keystoreMap,
    currenciesMatrix,
    networkMap,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    const formatTokenBalance = useFormatTokenBalance()
    const { fromAccount, fromCurrency, toCurrency, knownCurrencies } =
        pollable.params

    const fromNetwork = findNetworkByHexChainId(
        fromCurrency.networkHexChainId,
        networkMap
    )
    const toNetwork = findNetworkByHexChainId(
        toCurrency.networkHexChainId,
        networkMap
    )

    const refuelAvailable =
        currenciesMatrix.currencies[fromNetwork.hexChainId]?.[
            toNetwork.hexChainId
        ]?.canRefuel || false

    const validationResult = validateOnSubmit({ pollable, portfolio })
    const errors = validationResult.getFailureReason() || {}

    const bridgeRequest = getBridgeRouteRequest({ pollable })

    const toAmount = bridgeRequest
        ? formatTokenBalance({
              money: bridgeRequest.route.to,
              knownCurrencies,
          })
        : null

    const fromToken =
        portfolio.tokens.find(
            (token) => token.balance.currencyId === fromCurrency.id
        ) || null

    const fromAmountInDefaultCurrency: Money | null =
        fromToken?.rate && pollable.params.fromAmount
            ? applyRate(
                  {
                      amount: amountToBigint(
                          pollable.params.fromAmount,
                          fromCurrency.fraction
                      ),
                      currencyId: fromCurrency.id,
                  },
                  fromToken.rate,
                  knownCurrencies
              )
            : null

    const refuelCurrency =
        (bridgeRequest &&
            values(bridgeRequest.knownCurrencies).find(
                (currency): currency is CryptoCurrency => {
                    switch (currency.type) {
                        case 'FiatCurrency':
                            return false
                        case 'CryptoCurrency':
                            return (
                                currency.address ===
                                    getNativeTokenAddress(toNetwork) &&
                                currency.networkHexChainId ===
                                    toCurrency.networkHexChainId
                            )
                        /* istanbul ignore next */
                        default:
                            return notReachable(currency)
                    }
                }
            )) ||
        null

    const isRefuelAvailable =
        refuelAvailable &&
        refuelCurrency &&
        !pollable.params.refuel &&
        refuelCurrency.id !== toCurrency.id

    return (
        <Layout2 background="light" padding="form">
            <ActionBar
                keystore={getKeyStore({
                    keyStoreMap: keystoreMap,
                    address: fromAccount.address,
                })}
                account={fromAccount}
                network={null}
                right={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <CloseCross size={24} />
                    </IconButton>
                }
            />

            <Column2 spacing={16} style={{ flex: '1' }}>
                <TabHeader selected>
                    <FormattedMessage
                        id="currency.bridge.header"
                        defaultMessage="Bridge"
                    />
                </TabHeader>

                <Column2 spacing={12} style={{ flex: '1' }}>
                    <Column2 spacing={8}>
                        <Column2 spacing={4}>
                            <AmountInput2
                                state={errors.fromToken ? 'error' : 'normal'}
                                top={
                                    <NetworkFancyButton
                                        rounded={false}
                                        network={fromNetwork}
                                        onClick={() =>
                                            onMsg({
                                                type: 'on_from_network_click',
                                            })
                                        }
                                    />
                                }
                                content={{
                                    topLeft: (
                                        <IconButton
                                            onClick={() => {
                                                onMsg({
                                                    type: 'on_from_currency_click',
                                                })
                                            }}
                                        >
                                            <Row shrink={false} spacing={4}>
                                                <CurrencyAvatar
                                                    key={fromCurrency.id}
                                                    currency={fromCurrency}
                                                    size={24}
                                                    rightBadge={() => null}
                                                />
                                                <Text2
                                                    variant="title3"
                                                    color="textPrimary"
                                                    weight="medium"
                                                >
                                                    {fromCurrency.code}
                                                </Text2>
                                                <LightArrowDown2
                                                    size={18}
                                                    color="iconDefault"
                                                />
                                            </Row>
                                        </IconButton>
                                    ),
                                    topRight: (
                                        <AmountInput2.Input
                                            label={formatMessage({
                                                id: 'currency.bridge.header',
                                                defaultMessage:
                                                    'Amount to bridge',
                                            })}
                                            amount={
                                                pollable.params.fromAmount ||
                                                null
                                            }
                                            fraction={fromCurrency.fraction}
                                            onChange={(amount) =>
                                                onMsg({
                                                    type: 'on_amount_change',
                                                    amount,
                                                })
                                            }
                                            autoFocus
                                            prefix=""
                                        />
                                    ),
                                    bottomLeft: fromToken && (
                                        <Tertiary
                                            color={
                                                errors.fromToken?.type ===
                                                'not_enough_balance'
                                                    ? 'critical'
                                                    : 'on_light'
                                            }
                                            size="regular"
                                            onClick={() => {
                                                onMsg({
                                                    type: 'on_amount_change',
                                                    amount: Big(
                                                        fromToken.balance.amount.toString(
                                                            10
                                                        )
                                                    )
                                                        .div(
                                                            Big(10).pow(
                                                                fromCurrency.fraction
                                                            )
                                                        )
                                                        .toFixed(
                                                            fromCurrency.fraction
                                                        ),
                                                })
                                            }}
                                        >
                                            <FormattedMessage
                                                id="currency.swap.max_label"
                                                defaultMessage="Balance {amount}"
                                                values={{
                                                    amount: (
                                                        <FormattedTokenBalances
                                                            money={
                                                                fromToken.balance
                                                            }
                                                            knownCurrencies={
                                                                knownCurrencies
                                                            }
                                                        />
                                                    ),
                                                }}
                                            />
                                        </Tertiary>
                                    ),
                                    bottomRight:
                                        fromAmountInDefaultCurrency && (
                                            <Text2
                                                variant="footnote"
                                                color="textSecondary"
                                                weight="regular"
                                            >
                                                <FormattedTokenBalanceInDefaultCurrency
                                                    knownCurrencies={
                                                        knownCurrencies
                                                    }
                                                    money={
                                                        fromAmountInDefaultCurrency
                                                    }
                                                />
                                            </Text2>
                                        ),
                                }}
                                bottom={
                                    pollable.params.refuel && (
                                        <RefuelFrom
                                            pollable={pollable}
                                            onRemoveRefuelClick={() =>
                                                onMsg({
                                                    type: 'on_refuel_remove_click',
                                                })
                                            }
                                        />
                                    )
                                }
                            />

                            <NextStepSeparator />

                            <AmountInput2
                                state="normal"
                                top={
                                    <NetworkFancyButton
                                        rounded={false}
                                        network={toNetwork}
                                        onClick={() =>
                                            onMsg({
                                                type: 'on_to_network_click',
                                            })
                                        }
                                    />
                                }
                                content={{
                                    topLeft: (
                                        <IconButton
                                            onClick={() => {
                                                onMsg({
                                                    type: 'on_to_currency_click',
                                                })
                                            }}
                                        >
                                            <CurrencyAvatar
                                                key={toCurrency.id}
                                                currency={toCurrency}
                                                size={24}
                                                rightBadge={() => null}
                                            />
                                            <Text2
                                                variant="title3"
                                                color="textPrimary"
                                                weight="medium"
                                            >
                                                {toCurrency.code}
                                            </Text2>

                                            <LightArrowDown2 size={18} />
                                        </IconButton>
                                    ),
                                    topRight: (() => {
                                        switch (pollable.type) {
                                            case 'loading':
                                            case 'reloading':
                                                return (
                                                    <AmountInput2.InputSkeleton />
                                                )
                                            case 'loaded':
                                            case 'subsequent_failed':
                                            case 'error':
                                                return (
                                                    <AmountInput2.Input
                                                        label={formatMessage({
                                                            id: 'currency.swap.destination_amount',
                                                            defaultMessage:
                                                                'Destination amount',
                                                        })}
                                                        amount={toAmount}
                                                        fraction={
                                                            toCurrency.fraction ??
                                                            0
                                                        }
                                                        onChange={noop}
                                                        prefix=""
                                                        readOnly
                                                    />
                                                )
                                            /* istanbul ignore next */
                                            default:
                                                return notReachable(pollable)
                                        }
                                    })(),
                                    bottomRight: bridgeRequest?.route
                                        .toPriceInDefaultCurrency && (
                                        <Text2
                                            variant="footnote"
                                            color="textSecondary"
                                            weight="regular"
                                        >
                                            <FormattedTokenBalanceInDefaultCurrency
                                                knownCurrencies={
                                                    knownCurrencies
                                                }
                                                money={
                                                    bridgeRequest?.route
                                                        .toPriceInDefaultCurrency
                                                }
                                            />
                                        </Text2>
                                    ),
                                }}
                                bottom={
                                    pollable.params.refuel && (
                                        <RefuelTo
                                            pollable={pollable}
                                            onRemoveRefuelClick={() =>
                                                onMsg({
                                                    type: 'on_refuel_remove_click',
                                                })
                                            }
                                        />
                                    )
                                }
                            />
                        </Column2>

                        {isRefuelAvailable && (
                            <Row spacing={8} alignX="end">
                                <FancyButton
                                    right={null}
                                    color="secondary"
                                    rounded
                                    left={
                                        <Row spacing={4}>
                                            <SolidInterfacePlus size={16} />

                                            <FormattedMessage
                                                id="currency.bridge.topup"
                                                defaultMessage="Top up {symbol}"
                                                values={{
                                                    symbol: refuelCurrency.symbol,
                                                }}
                                            />
                                        </Row>
                                    }
                                    onClick={() =>
                                        onMsg({
                                            type: 'on_refuel_add_click',
                                        })
                                    }
                                />
                            </Row>
                        )}
                    </Column2>

                    <Spacer2 />

                    <Route pollable={pollable} onMsg={onMsg} />

                    <Button
                        variant="primary"
                        size="regular"
                        disabled={!!errors.submit}
                        onClick={() => {
                            switch (validationResult.type) {
                                case 'Failure':
                                    break
                                case 'Success':
                                    onMsg({
                                        type: 'on_bridge_continue_clicked',
                                        route: validationResult.data,
                                    })
                                    break
                                /* istanbul ignore next */
                                default:
                                    notReachable(validationResult)
                            }
                        }}
                    >
                        {(() => {
                            switch (validationResult.type) {
                                case 'Failure':
                                    return (
                                        <ErrorMessage
                                            error={
                                                validationResult.reason.submit
                                            }
                                        />
                                    )
                                case 'Success':
                                    return (
                                        <FormattedMessage
                                            id="action.continue"
                                            defaultMessage="Continue"
                                        />
                                    )
                                /* istanbul ignore next */
                                default:
                                    return notReachable(validationResult)
                            }
                        })()}
                    </Button>
                </Column2>
            </Column2>
        </Layout2>
    )
}

const RefuelSkeleton = () => (
    <Row spacing={8}>
        <Skeleton variant="default" width={35} height={16} />
        <Spacer2 />
        <Skeleton variant="default" width={55} height={16} />
    </Row>
)
const RefuelFrom = ({
    pollable,
    onRemoveRefuelClick,
}: {
    pollable: BridgePollable
    onRemoveRefuelClick: () => void
}) => {
    const { formatMessage } = useIntl()
    if (!pollable.params.refuel) {
        return null
    }

    switch (pollable.type) {
        case 'loaded': {
            const bridgeRequest = getBridgeRouteRequest({ pollable })

            if (!bridgeRequest) {
                return null
            }

            const refuel = bridgeRequest.route.refuel

            if (!refuel) {
                return null
            }

            const knownCurrencies = bridgeRequest.knownCurrencies
            const currency = knownCurrencies[refuel.from.currencyId]

            return (
                currency && (
                    <Row
                        spacing={8}
                        aria-labelledby="refuel-from-label"
                        aria-describedby="refuel-from-description"
                    >
                        <Row spacing={4}>
                            <CurrencyAvatar
                                rightBadge={() => null}
                                size={20}
                                currency={currency}
                            />

                            <Text2
                                id="refuel-from-label"
                                color="textPrimary"
                                variant="paragraph"
                                weight="regular"
                            >
                                {currency.symbol}
                            </Text2>
                        </Row>

                        <Spacer2 />

                        <Text2
                            color="textPrimary"
                            variant="paragraph"
                            weight="regular"
                            id="refuel-from-description"
                        >
                            -
                            <FormattedTokenBalances
                                knownCurrencies={knownCurrencies}
                                money={refuel.from}
                            />
                        </Text2>

                        <Tertiary
                            color="on_light"
                            size="regular"
                            onClick={onRemoveRefuelClick}
                            aria-label={formatMessage({
                                id: 'bridge.remove_topup',
                                defaultMessage: 'Remove Topup',
                            })}
                        >
                            <CloseCross size={20} />
                        </Tertiary>
                    </Row>
                )
            )
        }
        case 'reloading':
        case 'loading':
            return <RefuelSkeleton />

        case 'subsequent_failed':
        case 'error':
            return null

        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}

const RefuelTo = ({
    pollable,
    onRemoveRefuelClick,
}: {
    pollable: BridgePollable
    onRemoveRefuelClick: () => void
}) => {
    const { formatMessage } = useIntl()
    if (!pollable.params.refuel) {
        return null
    }

    switch (pollable.type) {
        case 'loaded': {
            const bridgeRequest = getBridgeRouteRequest({ pollable })

            if (!bridgeRequest) {
                return null
            }

            const refuel = bridgeRequest.route.refuel

            if (!refuel) {
                return null
            }

            const knownCurrencies = bridgeRequest.knownCurrencies
            const currency = knownCurrencies[refuel.to.currencyId]

            return (
                currency && (
                    <Row
                        spacing={8}
                        aria-labelledby="refuel-to-label"
                        aria-describedby="refuel-to-description"
                    >
                        <Row spacing={4}>
                            <CurrencyAvatar
                                rightBadge={() => null}
                                size={20}
                                currency={currency}
                            />

                            <Text2
                                color="textPrimary"
                                variant="paragraph"
                                weight="regular"
                                id="refuel-to-label"
                            >
                                {currency.symbol}
                            </Text2>
                        </Row>

                        <Spacer2 />

                        <Text2
                            color="textPrimary"
                            variant="paragraph"
                            weight="regular"
                            id="refuel-to-description"
                        >
                            +
                            <FormattedTokenBalances
                                knownCurrencies={knownCurrencies}
                                money={refuel.to}
                            />
                        </Text2>

                        <Tertiary
                            color="on_light"
                            size="regular"
                            aria-label={formatMessage({
                                id: 'bridge.remove_topup',
                                defaultMessage: 'Remove Topup',
                            })}
                            onClick={onRemoveRefuelClick}
                        >
                            <CloseCross size={20} />
                        </Tertiary>
                    </Row>
                )
            )
        }
        case 'reloading':
        case 'loading':
            return <RefuelSkeleton />

        case 'subsequent_failed':
        case 'error':
            return null

        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}
