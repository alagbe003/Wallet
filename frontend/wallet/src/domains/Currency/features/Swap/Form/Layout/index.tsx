import { Big } from 'big.js'
import { FormattedMessage, useIntl } from 'react-intl'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { Avatar as CurrencyAvatar } from 'src/domains/Currency/components/Avatar'
import {
    SwapQuote,
    SwapQuoteRequest,
    SwapRoute,
} from 'src/domains/Currency/domains/SwapQuote'
import { applyRate } from '@zeal/domains/FXRate/helpers/applyRate'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Money } from '@zeal/domains/Money'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import {
    FormattedTokenBalances,
    useFormatTokenBalance,
} from 'src/domains/Money/components/FormattedTokenBalances'
import { FancyButton } from 'src/domains/Network/components/FancyButton'
import { noop, notReachable } from '@zeal/toolkit'
import { LoadedReloadableData } from '@zeal/toolkit/LoadableData/LoadedReloadableData'
import { Button, IconButton } from 'src/uikit'
import { Avatar } from 'src/uikit/Avatar'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { Column2 } from 'src/uikit/Column2'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { LightArrowDown2 } from 'src/uikit/Icon/LightArrowDown2'
import { QuestionCircle } from 'src/uikit/Icon/QuestionCircle'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Row } from '@zeal/uikit/Row'
import { Spacer2 } from 'src/uikit/Spacer2'
import { TabHeader } from '@zeal/uikit/TabHeader'
import { Text2 } from 'src/uikit/Text2'
import { getRoute, validate } from '../validation'
import { ErrorMessage } from './ErrorMessage'
import { Route } from './Route'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { AmountInput2 } from 'src/uikit/Input/AmountInput2'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { NetworkMap } from '@zeal/domains/Network'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { NextStepSeparator } from 'src/uikit/NextStepSeparator'

type Props = {
    pollable: LoadedReloadableData<SwapQuote, SwapQuoteRequest>
    keystoreMap: KeyStoreMap
    networkMap: NetworkMap

    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_select_network_click' }
    | { type: 'on_to_currency_click' }
    | { type: 'on_from_currency_click' }
    | { type: 'on_amount_change'; amount: string | null }
    | { type: 'on_swap_continue_clicked'; route: SwapRoute }
    | { type: 'on_try_again_clicked' }
    | MsgOf<typeof Route>

export const Layout = ({ keystoreMap, pollable, networkMap, onMsg }: Props) => {
    const { formatMessage } = useIntl()
    const validationResult = validate({ pollable })
    const formatTokenBalance = useFormatTokenBalance()

    const errors = validate({ pollable }).getFailureReason() || {}

    const { fromCurrency, portfolio, toCurrency } = pollable.params

    const knownCurrencies = pollable.data.knownCurrencies

    const route: SwapRoute | null = getRoute(pollable)

    const toAmount =
        route && toCurrency
            ? formatTokenBalance({
                  money: { amount: route.toAmount, currencyId: toCurrency.id },
                  knownCurrencies,
              })
            : null

    const fromToken =
        portfolio.tokens.find(
            (token) => token.balance.currencyId === fromCurrency.id
        ) || null

    const fromAmountInDefaultCurrency: Money | null =
        fromToken?.rate && pollable.params.amount
            ? applyRate(
                  {
                      amount: amountToBigint(
                          pollable.params.amount,
                          fromCurrency.fraction
                      ),
                      currencyId: fromCurrency.id,
                  },
                  fromToken.rate,
                  knownCurrencies
              )
            : null

    const networkSelector = (
        <FancyButton
            rounded={false}
            network={findNetworkByHexChainId(
                fromCurrency.networkHexChainId,
                networkMap
            )}
            onClick={() =>
                onMsg({
                    type: 'on_select_network_click',
                })
            }
        />
    )

    return (
        <Layout2 background="light" padding="form">
            <ActionBar
                keystore={getKeyStore({
                    keyStoreMap: keystoreMap,
                    address: pollable.params.fromAccount.address,
                })}
                account={pollable.params.fromAccount}
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
                        id="currency.swap.header"
                        defaultMessage="Swap"
                    />
                </TabHeader>

                <Column2 spacing={12} style={{ flex: '1' }}>
                    <Column2 spacing={4}>
                        <AmountInput2
                            top={networkSelector}
                            content={{
                                topLeft: (
                                    <IconButton
                                        onClick={() => {
                                            onMsg({
                                                type: 'on_from_currency_click',
                                            })
                                        }}
                                    >
                                        <Row spacing={4}>
                                            <CurrencyAvatar
                                                key={fromCurrency.id}
                                                rightBadge={() => null}
                                                currency={fromCurrency}
                                                size={24}
                                            />
                                            <Text2
                                                variant="title3"
                                                color="textPrimary"
                                                weight="medium"
                                            >
                                                {fromCurrency.code}
                                            </Text2>

                                            <LightArrowDown2 size={18} />
                                        </Row>
                                    </IconButton>
                                ),
                                topRight: (
                                    <AmountInput2.Input
                                        onChange={(amount) =>
                                            onMsg({
                                                type: 'on_amount_change',
                                                amount,
                                            })
                                        }
                                        label={formatMessage({
                                            id: 'currency.swap.amount_to_swap',
                                            defaultMessage: 'Amount to swap',
                                        })}
                                        prefix=""
                                        fraction={fromCurrency.fraction}
                                        autoFocus
                                        amount={pollable.params.amount || null}
                                    />
                                ),
                                bottomRight: fromAmountInDefaultCurrency && (
                                    <Text2
                                        variant="footnote"
                                        color="textSecondary"
                                        weight="regular"
                                    >
                                        <FormattedTokenBalanceInDefaultCurrency
                                            knownCurrencies={
                                                pollable.data.knownCurrencies
                                            }
                                            money={fromAmountInDefaultCurrency}
                                        />
                                    </Text2>
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
                                                            pollable.data
                                                                .knownCurrencies
                                                        }
                                                    />
                                                ),
                                            }}
                                        />
                                    </Tertiary>
                                ),
                            }}
                            state={errors.fromToken ? 'error' : 'normal'}
                        />

                        <NextStepSeparator />

                        <AmountInput2
                            top={networkSelector}
                            content={{
                                topRight: (
                                    <AmountInput2.Input
                                        label={formatMessage({
                                            id: 'currency.swap.destination_amount',
                                            defaultMessage:
                                                'Destination amount',
                                        })}
                                        prefix=""
                                        readOnly
                                        onChange={noop}
                                        amount={toAmount}
                                        fraction={toCurrency?.fraction ?? 0}
                                    />
                                ),
                                topLeft: (
                                    <IconButton
                                        onClick={() => {
                                            onMsg({
                                                type: 'on_to_currency_click',
                                            })
                                        }}
                                    >
                                        <Row spacing={4}>
                                            {toCurrency ? (
                                                <>
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
                                                    <LightArrowDown2
                                                        size={18}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <Avatar
                                                        size={24}
                                                        icon={
                                                            <QuestionCircle
                                                                size={24}
                                                            />
                                                        }
                                                    />
                                                    <Text2
                                                        variant="title3"
                                                        color="textPrimary"
                                                        weight="medium"
                                                    >
                                                        <FormattedMessage
                                                            id="currency.swap.select_to_token"
                                                            defaultMessage="Select token"
                                                        />
                                                    </Text2>
                                                    <LightArrowDown2
                                                        size={18}
                                                    />
                                                </>
                                            )}
                                        </Row>
                                    </IconButton>
                                ),
                                bottomRight: route?.priceInDefaultCurrency && (
                                    <Text2
                                        variant="footnote"
                                        color="textSecondary"
                                        weight="regular"
                                    >
                                        <FormattedTokenBalanceInDefaultCurrency
                                            knownCurrencies={
                                                pollable.data.knownCurrencies
                                            }
                                            money={route.priceInDefaultCurrency}
                                        />
                                    </Text2>
                                ),
                            }}
                            state="normal"
                        />
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
                                        type: 'on_swap_continue_clicked',
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
