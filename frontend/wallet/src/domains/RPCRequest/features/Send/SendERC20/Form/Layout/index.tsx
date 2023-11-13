import { FormattedMessage, useIntl } from 'react-intl'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { Address } from '@zeal/domains/Address'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { FXRate } from '@zeal/domains/FXRate'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Money } from '@zeal/domains/Money'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Badge } from 'src/domains/Network/components/Badge'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { Token } from '@zeal/domains/Token'
import { Avatar as TokenAvatar } from '@zeal/domains/Token/components/Avatar'
import { notReachable } from '@zeal/toolkit'
import { Button } from 'src/uikit/Button'
import { IconButton } from '@zeal/uikit/IconButton'
import { Avatar } from '@zeal/uikit/Avatar'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { CloseCross } from '@zeal/uikit/Icon/CloseCross'
import { CustomAccountAddress } from '@zeal/uikit/Icon/CustomAccountAddress'
import { LightArrowDown2 } from '@zeal/uikit/Icon/LightArrowDown2'
import { QuestionCircle } from '@zeal/uikit/Icon/QuestionCircle'
import { AmountInput2 } from 'src/uikit/Input/AmountInput2'
import { Screen } from '@zeal/uikit/Screen'
import { ListItem } from '@zeal/uikit/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { validate } from '../validation'
import { BalanceButton } from './BalanceButton'
import { SecondaryAmountButton } from './SecondaryAmountButton'
import { ToAddress } from './ToAddress'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { NextStepSeparator } from '@zeal/uikit/NextStepSeparator'

type Props = {
    form: Form
    knownCurrencies: KnownCurrencies
    accountsMap: AccountsMap
    fxRate: FXRate | null
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    account: Account
    feePresetMap: FeePresetMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | {
          type: 'close'
      }
    | {
          type: 'on_select_token'
      }
    | {
          type: 'on_select_to_address'
      }
    | {
          type: 'on_submit_form'
          request: EthSendTransaction
          network: Network
      }
    | {
          type: 'on_form_change'
          form: Form
      }

export type Form =
    | {
          type: 'amount_in_tokens'
          token: Token | null
          amount: string | null
          toAddress: Address | null
      }
    | {
          type: 'amount_in_default_currency'
          token: Token
          amount: string | null
          fxRate: FXRate
          priceInDefaultCurrency: Money
          toAddress: Address | null
      }

const getPrefix = (form: Form): string => {
    switch (form.type) {
        case 'amount_in_tokens':
            return ''
        case 'amount_in_default_currency':
            return '$'
        /* istanbul ignore next */
        default:
            return notReachable(form)
    }
}

export const Layout = ({
    form,
    knownCurrencies,
    networkMap,
    networkRPCMap,
    account,
    fxRate,
    accountsMap,
    keyStoreMap,
    feePresetMap,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    const errors =
        validate({
            form,
            networkMap,
            account,
            knownCurrencies,
        }).getFailureReason() || {}

    const prefix = getPrefix(form)

    return (
        <Screen padding="form" background="light">
            <ActionBar
                right={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <CloseCross size={24} />
                    </IconButton>
                }
                network={null}
                account={account}
                keystore={getKeyStore({
                    keyStoreMap: keyStoreMap,
                    address: account.address,
                })}
            />
            <Column spacing={16} alignY="stretch">
                <Column spacing={16}>
                    <Text
                        variant="title3"
                        weight="semi_bold"
                        color="textPrimary"
                    >
                        <FormattedMessage
                            id="send_token.form.title"
                            defaultMessage="Send"
                        />
                    </Text>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault()

                            const result = validate({
                                account,
                                form,
                                knownCurrencies,
                                networkMap,
                            })

                            switch (result.type) {
                                case 'Failure':
                                    break
                                case 'Success':
                                    onMsg({
                                        type: 'on_submit_form',
                                        request: result.data.request,
                                        network: result.data.network,
                                    })
                                    break

                                /* istanbul ignore next */
                                default:
                                    return notReachable(result)
                            }
                        }}
                        id="send-form"
                    >
                        <Column spacing={4}>
                            <AmountInput2
                                content={{
                                    topLeft: (
                                        <IconButton
                                            onClick={() => {
                                                onMsg({
                                                    type: 'on_select_token',
                                                })
                                            }}
                                        >
                                            <Row spacing={4}>
                                                {form.token ? (
                                                    <>
                                                        <TokenAvatar
                                                            key={
                                                                form.token
                                                                    .balance
                                                                    .currencyId
                                                            }
                                                            token={form.token}
                                                            knownCurrencies={
                                                                knownCurrencies
                                                            }
                                                            size={24}
                                                            rightBadge={(
                                                                (
                                                                    token: Token
                                                                ) =>
                                                                ({ size }) =>
                                                                    (
                                                                        <Badge
                                                                            size={
                                                                                size
                                                                            }
                                                                            network={findNetworkByHexChainId(
                                                                                token.networkHexId,
                                                                                networkMap
                                                                            )}
                                                                        />
                                                                    )
                                                            )(form.token)}
                                                        />
                                                        <Text
                                                            variant="title3"
                                                            color="textPrimary"
                                                            weight="medium"
                                                        >
                                                            {
                                                                knownCurrencies[
                                                                    form.token
                                                                        .balance
                                                                        .currencyId
                                                                ].code
                                                            }
                                                        </Text>
                                                        <LightArrowDown2
                                                            size={18}
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Avatar size={24}>
                                                            <QuestionCircle
                                                                size={24}
                                                            />
                                                        </Avatar>
                                                        <Text
                                                            variant="title3"
                                                            color="textPrimary"
                                                            weight="medium"
                                                        >
                                                            <FormattedMessage
                                                                id="send_token.form.select-token"
                                                                defaultMessage="Select token"
                                                            />
                                                        </Text>
                                                        <LightArrowDown2
                                                            size={18}
                                                        />
                                                    </>
                                                )}
                                            </Row>
                                        </IconButton>
                                    ),
                                    topRight: (
                                        <AmountInput2.Input
                                            label={formatMessage({
                                                id: 'send_token.form.send-amount',
                                                defaultMessage: 'Send amount',
                                            })}
                                            fraction={
                                                form.token
                                                    ? knownCurrencies[
                                                          form.token.balance
                                                              .currencyId
                                                      ].fraction
                                                    : 0
                                            }
                                            autoFocus
                                            readOnly={form.token === null}
                                            prefix={prefix}
                                            amount={form.amount}
                                            onChange={(newValue) => {
                                                onMsg({
                                                    type: 'on_form_change',
                                                    form: {
                                                        ...form,
                                                        amount: newValue,
                                                    },
                                                })
                                            }}
                                        />
                                    ),
                                    bottomLeft: form.token && (
                                        <BalanceButton
                                            feePresetMap={feePresetMap}
                                            state={
                                                errors.amount
                                                    ? 'error'
                                                    : 'normal'
                                            }
                                            networkMap={networkMap}
                                            networkRPCMap={networkRPCMap}
                                            knownCurrencies={knownCurrencies}
                                            account={account}
                                            token={form.token}
                                            onClick={(maxAmount) =>
                                                onMsg({
                                                    type: 'on_form_change',
                                                    form: {
                                                        ...form,
                                                        type: 'amount_in_tokens',
                                                        amount: maxAmount,
                                                    },
                                                })
                                            }
                                        />
                                    ),
                                    bottomRight: fxRate &&
                                        form.token?.priceInDefaultCurrency && (
                                            <SecondaryAmountButton
                                                form={form}
                                                fxRate={fxRate}
                                                knownCurrencies={
                                                    knownCurrencies
                                                }
                                                onClick={(
                                                    (
                                                        token,
                                                        priceInDefaultCurrency
                                                    ) =>
                                                    (amount) => {
                                                        switch (form.type) {
                                                            case 'amount_in_tokens':
                                                                onMsg({
                                                                    type: 'on_form_change',
                                                                    form: {
                                                                        ...form,
                                                                        type: 'amount_in_default_currency',
                                                                        token,
                                                                        amount,
                                                                        fxRate,
                                                                        priceInDefaultCurrency,
                                                                    },
                                                                })
                                                                break
                                                            case 'amount_in_default_currency':
                                                                onMsg({
                                                                    type: 'on_form_change',
                                                                    form: {
                                                                        ...form,
                                                                        type: 'amount_in_tokens',
                                                                        amount,
                                                                    },
                                                                })
                                                                break
                                                            /* istanbul ignore next */
                                                            default:
                                                                return notReachable(
                                                                    form
                                                                )
                                                        }
                                                    }
                                                )(
                                                    form.token,
                                                    form.token
                                                        .priceInDefaultCurrency
                                                )}
                                            />
                                        ),
                                }}
                                state={
                                    form.token
                                        ? errors.amount
                                            ? 'error'
                                            : 'normal'
                                        : 'normal'
                                }
                            />

                            <NextStepSeparator />

                            <Group variant="default">
                                {form.toAddress ? (
                                    <ToAddress
                                        address={form.toAddress}
                                        keyStoreMap={keyStoreMap}
                                        accountsMap={accountsMap}
                                        onClick={() =>
                                            onMsg({
                                                type: 'on_select_to_address',
                                            })
                                        }
                                    />
                                ) : (
                                    <ListItem
                                        size="large"
                                        aria-selected={false}
                                        avatar={({ size }) => (
                                            <Avatar
                                                size={size}
                                                border="secondary"
                                            >
                                                <CustomAccountAddress
                                                    size={24}
                                                    color="iconDefault"
                                                />
                                            </Avatar>
                                        )}
                                        primaryText={
                                            <FormattedMessage
                                                id="send_token.form.select-address"
                                                defaultMessage="Select address"
                                            />
                                        }
                                        side={{
                                            rightIcon: ({ size }) => (
                                                <LightArrowDown2
                                                    size={size}
                                                    color="iconDefault"
                                                />
                                            ),
                                        }}
                                        onClick={() =>
                                            onMsg({
                                                type: 'on_select_to_address',
                                            })
                                        }
                                    />
                                )}
                            </Group>
                        </Column>
                    </form>
                </Column>
                <Button
                    type="submit"
                    size="regular"
                    variant="primary"
                    form="send-form"
                    disabled={!!errors.submit}
                >
                    <FormattedMessage
                        id="actions.continue"
                        defaultMessage="Continue"
                    />
                </Button>
            </Column>
        </Screen>
    )
}
