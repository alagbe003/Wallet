import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Address } from '@zeal/domains/Address'
import { fetchBalanceOf } from '@zeal/domains/Address/api/fetchBalanceOf'
import { fetchContractFraction } from '@zeal/domains/Address/api/fetchContractFraction'
import { fetchContractSymbol } from '@zeal/domains/Address/api/fetchContractSymbol'
import { ValidationError as AddressValidationError } from '@zeal/domains/Address/helpers/fromString'
import { CryptoCurrency } from '@zeal/domains/Currency'
import { initCustomCurrency } from '@zeal/domains/Currency/helpers/initCustomCurrency'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { Name } from 'src/domains/Network/components/Name'
import { notReachable } from '@zeal/toolkit'
import {
    LazyLoadableData,
    useLazyLoadableData,
} from '@zeal/toolkit/LoadableData/LazyLoadableData'
import {
    EmptyStringError,
    Result,
    StringValueNotNumberError,
    failure,
    nonEmptyString,
    number,
    shape,
    success,
} from '@zeal/toolkit/Result'
import { Button, IconButton } from 'src/uikit'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Avatar } from 'src/uikit/Avatar'
import { Column2 } from 'src/uikit/Column2'
import { BoldDelete } from 'src/uikit/Icon/BoldDelete'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { QuestionCircle } from 'src/uikit/Icon/QuestionCircle'
import { Input2 } from 'src/uikit/Input/Input2'
import { IntegerInput } from 'src/uikit/Input/IntegerInput'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Row } from '@zeal/uikit/Row'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    network: Network
    networkRPCMap: NetworkRPCMap
    currency: CryptoCurrency | null
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'custom_currency_delete_click'
          currency: CryptoCurrency
      }
    | {
          type: 'on_custom_currency_updated'
          currency: CryptoCurrency
      }

type Loadable = LazyLoadableData<
    { fraction: number; symbol: string },
    { address: Address }
>

type Form = {
    id: string
    fraction: number | null
    symbol: string | null
}

const fetch = async ({
    address,
    network,
    networkRPCMap,
}: {
    network: Network
    networkRPCMap: NetworkRPCMap
    address: string
}): Promise<{ fraction: number; symbol: string }> => {
    const [fraction, symbol] = await Promise.all([
        fetchContractFraction({
            contract: address,
            network,
            networkRPCMap,
        }),
        fetchContractSymbol({
            contract: address,
            network,
            networkRPCMap,
        }),
        fetchBalanceOf({
            contract: address,
            network,
            networkRPCMap,
            account: '0x1111111111111111111111111111111111111111',
        }),
    ])
    return {
        fraction,
        symbol,
    }
}

type FormError = {
    address?: AddressValidationError
    submit?:
        | StringValueNotNumberError
        | EmptyStringError
        | AddressValidationError
        | { type: 'should_be_gt_zero' }
        | { type: 'value_is_not_a_number'; value: unknown }
}

const validateAddress = ({
    loadable,
}: {
    loadable: Loadable
}): Result<AddressValidationError, Address> => {
    switch (loadable.type) {
        case 'not_asked':
        case 'loading':
        case 'error':
            return failure({ type: 'not_a_valid_address' })
        case 'loaded':
            return success(loadable.params.address)
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}

const validateFraction = (
    fraction: number | null
): Result<
    | { type: 'should_be_gt_zero' }
    | { type: 'value_is_not_a_number'; value: unknown },
    number
> => {
    return number(fraction).andThen((f) => {
        return f > 0
            ? success(f)
            : failure({ type: 'should_be_gt_zero' as const })
    })
}

const validateOnSubmit = ({
    form,
    loadable,
    network,
}: {
    form: Form
    loadable: Loadable
    network: Network
}): Result<FormError, CryptoCurrency> => {
    return shape({
        address: validateAddress({ loadable }),
        symbol: nonEmptyString(form.symbol),
        fraction: validateFraction(form.fraction),
        submit: nonEmptyString(form.symbol)
            .andThen(() => validateFraction(form.fraction))
            .andThen(() => validateAddress({ loadable })),
    }).map(({ address, symbol, fraction }) =>
        initCustomCurrency({
            id: form.id,
            address,
            symbol,
            fraction,
            networkHexChainId: network.hexChainId,
            icon: null,
        })
    )
}

export const Layout = ({ onMsg, network, networkRPCMap, currency }: Props) => {
    const [isSubmitted, setSubmitted] = useState<boolean>(false)
    const [form, setForm] = useState<Form>(() => ({
        fraction: currency?.fraction || null,
        symbol: currency?.symbol || null,
        id: currency?.id || crypto.randomUUID(),
    }))
    const [loadable, setLoadable] = useLazyLoadableData(
        fetch,
        currency
            ? {
                  type: 'loading' as const,
                  params: {
                      address: currency.address,
                      network,
                      networkRPCMap,
                  },
              }
            : {
                  type: 'not_asked' as const,
              }
    )

    const errors = isSubmitted
        ? validateOnSubmit({
              form,
              loadable,
              network,
          }).getFailureReason() || {}
        : {}

    useEffect(() => {
        switch (loadable.type) {
            case 'not_asked':
            case 'loading':
            case 'error':
                break
            case 'loaded':
                setForm((form) => {
                    return {
                        fraction: form?.fraction ?? loadable.data.fraction,
                        symbol: form?.symbol ?? loadable.data.symbol,
                        id: form.id,
                    }
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [loadable])

    return (
        <Layout2 padding="form" background="light">
            <ActionBar
                left={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <BackIcon size={24} />
                    </IconButton>
                }
                right={
                    currency ? (
                        <IconButton
                            onClick={() =>
                                onMsg({
                                    type: 'custom_currency_delete_click',
                                    currency: currency,
                                })
                            }
                        >
                            <BoldDelete size={24} />
                        </IconButton>
                    ) : null
                }
            />
            <Column2 style={{ flex: '1 0 auto' }} spacing={16}>
                <Row spacing={16}>
                    <Avatar size={64}>
                        <QuestionCircle size={64} color="iconDefault" />
                    </Avatar>
                    <Column2 spacing={3}>
                        {form.symbol ? (
                            <Text2
                                variant="title3"
                                weight="semi_bold"
                                color="textPrimary"
                            >
                                {form.symbol}
                            </Text2>
                        ) : (
                            <Text2
                                variant="title3"
                                weight="semi_bold"
                                color="textSecondary"
                            >
                                <FormattedMessage
                                    id="currency.add_currency.add_token"
                                    defaultMessage="Add token"
                                />
                            </Text2>
                        )}
                        <Text2
                            variant="paragraph"
                            weight="medium"
                            color="textSecondary"
                        >
                            <Name
                                currentNetwork={{
                                    type: 'specific_network',
                                    network,
                                }}
                            />
                        </Text2>
                    </Column2>
                </Row>
                <Column2 spacing={16}>
                    <Column2 spacing={8}>
                        <Text2
                            variant="paragraph"
                            weight="regular"
                            color="textSecondary"
                        >
                            <FormattedMessage
                                id="currency.add_currency.token_feild"
                                defaultMessage="Token address"
                            />
                        </Text2>
                        <Input2
                            variant="regular"
                            value={loadable.params?.address || ''}
                            onChange={(e) => {
                                setLoadable({
                                    type: 'loading',
                                    params: {
                                        network,
                                        networkRPCMap,
                                        address: e.target.value,
                                    },
                                })
                            }}
                            state={errors.address ? 'error' : 'normal'}
                            message={
                                errors.address ? (
                                    <FormattedMessage
                                        id="currency.add_currency.not_a_valid_address"
                                        defaultMessage="This is not a valid token address"
                                    />
                                ) : null
                            }
                            placeholder="0x0000..0000"
                        />
                    </Column2>

                    <Column2 spacing={8}>
                        <Text2
                            variant="paragraph"
                            weight="regular"
                            color="textSecondary"
                        >
                            <FormattedMessage
                                id="currency.add_currency.token_symbol_feild"
                                defaultMessage="Token symbol"
                            />
                        </Text2>

                        <Input2
                            variant="regular"
                            value={form.symbol || ''}
                            onChange={(e) => {
                                setForm({
                                    ...form,
                                    symbol: e.target.value,
                                })
                            }}
                            state="normal"
                            placeholder="ETH"
                        />
                    </Column2>

                    <Column2 spacing={8}>
                        <Text2
                            variant="paragraph"
                            weight="regular"
                            color="textSecondary"
                        >
                            <FormattedMessage
                                id="currency.add_currency.token_decimals_feild"
                                defaultMessage="Token decimals"
                            />
                        </Text2>

                        <IntegerInput
                            integerString={
                                (form.fraction && form.fraction.toString(10)) ||
                                '0'
                            }
                            onChange={(value) => {
                                const num = Number(value)
                                setForm({
                                    ...form,
                                    fraction: Number.isNaN(num) ? null : num,
                                })
                            }}
                        >
                            {({ onChange, value }) => (
                                <Input2
                                    variant="regular"
                                    value={value}
                                    onChange={onChange}
                                    state="normal"
                                    placeholder="18"
                                />
                            )}
                        </IntegerInput>
                    </Column2>
                </Column2>
            </Column2>
            <Button
                disabled={!!errors.submit}
                variant="primary"
                size="regular"
                type="submit"
                onClick={() => {
                    setSubmitted(true)
                    const res = validateOnSubmit({
                        form,
                        loadable,
                        network,
                    })

                    switch (res.type) {
                        case 'Failure':
                            break
                        case 'Success':
                            onMsg({
                                type: 'on_custom_currency_updated',
                                currency: res.data,
                            })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(res)
                    }
                }}
            >
                <FormattedMessage
                    id="currency.add_currency.add_token"
                    defaultMessage="Add token"
                />
            </Button>
        </Layout2>
    )
}
