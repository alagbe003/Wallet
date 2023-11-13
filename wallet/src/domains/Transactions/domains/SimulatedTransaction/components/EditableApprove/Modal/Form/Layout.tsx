import { ApprovalTransaction } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import {
    failure,
    required,
    RequiredError,
    Result,
    shape,
    success,
} from '@zeal/toolkit/Result'
import { useState } from 'react'
import { Header } from 'src/uikit/Header'
import { FormattedMessage, useIntl } from 'react-intl'
import { Popup } from 'src/uikit/Popup'
import { Button, IconButton } from 'src/uikit'
import { Column2 } from 'src/uikit/Column2'
import { Row } from '@zeal/uikit/Row'
import { Text2 } from 'src/uikit/Text2'
import { InfoCircle } from 'src/uikit/Icon/InfoCircle'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Toggle } from '@zeal/uikit/Toggle'
import { Input2 } from 'src/uikit/Input/Input2'
import { noop, notReachable } from '@zeal/toolkit'
import { FloatInput } from 'src/uikit/Input/FloatInput'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { Currency, KnownCurrencies } from '@zeal/domains/Currency'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { useFormatTokenBalance } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { Money } from '@zeal/domains/Money'
import { Refresh } from 'src/uikit/Icon/Refresh'
import { updateApprovalAmount } from 'src/domains/Transactions/domains/SimulatedTransaction/helpers/updateApprovalAmount'
import { BoldDangerTriangle } from 'src/uikit/Icon/BoldDangerTriangle'
import { LightArrowRight2 } from 'src/uikit/Icon/LightArrowRight2'

type Props = {
    originalEthSendTransaction: EthSendTransaction
    knownCurrencies: KnownCurrencies
    transaction: ApprovalTransaction
    onMsg: (msg: Msg) => void
}

type Msg =
    | {
          type: 'close'
      }
    | {
          type: 'on_edit_approval_form_submit'
          updatedEthSendTransaction: EthSendTransaction
      }
    | { type: 'on_spend_limit_info_click' }
    | { type: 'on_high_spend_limit_warning_click' }

type SpendLimit = {
    type: 'limited' | 'unlimited'
    limit: string | null
}

type Form = {
    spendLimit: SpendLimit
}

type SpendLimitError = {
    type: 'limit_too_high'
}

type FormErrors = {
    spendLimit?: SpendLimitError
    submit?: RequiredError
}

const UNLIMITED_VALUE = Number.MAX_SAFE_INTEGER.toString()

const validateLimit = (
    spendLimit: SpendLimit
): Result<SpendLimitError, SpendLimit> => {
    if (!spendLimit) {
        return success(spendLimit)
    }

    switch (spendLimit.type) {
        case 'limited':
            return success(spendLimit)
        case 'unlimited':
            return failure({ type: 'limit_too_high' })
        /* istanbul ignore next */
        default:
            return notReachable(spendLimit.type)
    }
}

const validateAsUserTypes = ({
    form,
}: {
    form: Form
}): Result<FormErrors, unknown> =>
    shape({
        spendLimit: validateLimit(form.spendLimit),
        submit: required(form.spendLimit.limit),
    })

const validateOnSubmit = ({
    form,
    originalEthSendTransaction,
    approvalTransaction,
    currency,
}: {
    form: Form
    originalEthSendTransaction: EthSendTransaction
    approvalTransaction: ApprovalTransaction
    currency: Currency
}): Result<FormErrors, EthSendTransaction> =>
    shape({
        spendLimit: required(form.spendLimit.limit),
    }).map((result) =>
        updateApprovalAmount({
            originalEthSendTransaction,
            approvalTransaction,
            currency,
            newSpendLimit: result.spendLimit,
        })
    )

const calculateInitialForm = ({
    transaction,
    knownCurrencies,
    format,
}: {
    transaction: ApprovalTransaction
    knownCurrencies: KnownCurrencies
    format: (params: {
        money: Money
        knownCurrencies: KnownCurrencies
    }) => string | null
}): Form => {
    switch (transaction.amount.type) {
        case 'Limited':
            return {
                spendLimit: {
                    type: 'limited',
                    limit: format({
                        money: transaction.amount.amount,
                        knownCurrencies,
                    }),
                },
            }
        case 'Unlimited':
            return {
                spendLimit: { type: 'unlimited', limit: UNLIMITED_VALUE },
            }
        /* istanbul ignore next */
        default:
            return notReachable(transaction.amount)
    }
}

export const Layout = ({
    originalEthSendTransaction,
    knownCurrencies,
    transaction,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()

    const format = useFormatTokenBalance()
    const initialForm = calculateInitialForm({
        transaction,
        knownCurrencies,
        format,
    })

    const [form, setForm] = useState<Form>(initialForm)
    const currency = useCurrencyById(
        transaction.amount.amount.currencyId,
        knownCurrencies
    )

    if (!currency) {
        return null
    }

    const errors = validateAsUserTypes({ form }).getFailureReason() || {}

    const isUnlimited = ((): boolean => {
        switch (form.spendLimit.type) {
            case 'limited':
                return false
            case 'unlimited':
                return true
            /* istanbul ignore next */
            default:
                return notReachable(form.spendLimit.type)
        }
    })()

    return (
        <Popup.Layout onMsg={onMsg} aria-labelledby="edit-permissions-label">
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    const result = validateOnSubmit({
                        form,
                        originalEthSendTransaction,
                        approvalTransaction: transaction,
                        currency,
                    })

                    switch (result.type) {
                        case 'Failure':
                            break
                        case 'Success':
                            onMsg({
                                type: 'on_edit_approval_form_submit',
                                updatedEthSendTransaction: result.data,
                            })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(result)
                    }
                }}
            >
                <Column2 spacing={24}>
                    <Header
                        titleId="edit-permissions-label"
                        title={
                            <FormattedMessage
                                id="approval.spend-limit.edit-modal.title"
                                defaultMessage="Edit permissions"
                            />
                        }
                    />
                    <Popup.Content>
                        <Column2 spacing={8}>
                            <Row spacing={4}>
                                <Text2
                                    id="spend-limit-amount-label"
                                    variant="paragraph"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="approval.spend-limit.edit-modal.limit-label"
                                        defaultMessage="Spend limit"
                                    />
                                </Text2>
                                <IconButton
                                    aria-label={formatMessage({
                                        id: 'approval.spend_limit_info',
                                        defaultMessage: 'What is spend limit?',
                                    })}
                                    onClick={() =>
                                        onMsg({
                                            type: 'on_spend_limit_info_click',
                                        })
                                    }
                                >
                                    <InfoCircle size={16} />
                                </IconButton>
                                <Spacer2 />
                                <Toggle
                                    title={
                                        <FormattedMessage
                                            id="approval.spend-limit.edit-modal.set-to-unlimited"
                                            defaultMessage="Set to Unlimited"
                                        />
                                    }
                                    size="small"
                                    checked={isUnlimited}
                                    onClick={() =>
                                        setForm(() =>
                                            isUnlimited
                                                ? {
                                                      spendLimit: {
                                                          type: 'limited',
                                                          limit: null,
                                                      },
                                                  }
                                                : {
                                                      spendLimit: {
                                                          type: 'unlimited',
                                                          limit: UNLIMITED_VALUE,
                                                      },
                                                  }
                                        )
                                    }
                                />
                            </Row>
                            {isUnlimited ? (
                                <Input2
                                    aria-labelledby="spend-limit-amount-label"
                                    disabled
                                    variant="regular"
                                    value="Unlimited"
                                    onChange={noop}
                                    state="normal"
                                    message={
                                        <Tertiary
                                            color="warning"
                                            size="small"
                                            onClick={() =>
                                                onMsg({
                                                    type: 'on_high_spend_limit_warning_click',
                                                })
                                            }
                                        >
                                            <BoldDangerTriangle size={14} />
                                            <FormattedMessage
                                                id="approval.spend-limit.edit-modal.max-limit-error"
                                                defaultMessage="Warning, high limit"
                                            />
                                            <LightArrowRight2 size={14} />
                                        </Tertiary>
                                    }
                                    placeholder="Unlimited"
                                    sideMessage={
                                        <Tertiary
                                            color="on_light"
                                            size="small"
                                            disabled={
                                                form.spendLimit.limit ===
                                                initialForm.spendLimit.limit
                                            }
                                            onClick={() =>
                                                setForm({
                                                    spendLimit:
                                                        initialForm.spendLimit,
                                                })
                                            }
                                        >
                                            <Refresh size={14} />
                                            <FormattedMessage
                                                id="approval.spend-limit.edit-modal.revert"
                                                defaultMessage="Revert changes"
                                            />
                                        </Tertiary>
                                    }
                                />
                            ) : (
                                <FloatInput
                                    prefix=""
                                    value={form.spendLimit.limit}
                                    fraction={currency.fraction}
                                    onChange={(value) =>
                                        setForm({
                                            spendLimit: {
                                                type: 'limited',
                                                limit: value,
                                            },
                                        })
                                    }
                                >
                                    {({ value, onChange }) => (
                                        <Input2
                                            aria-labelledby="spend-limit-amount-label"
                                            autoFocus
                                            onChange={onChange}
                                            state="normal"
                                            placeholder="Limit"
                                            variant="regular"
                                            value={value}
                                            sideMessage={
                                                <Tertiary
                                                    color="on_light"
                                                    size="small"
                                                    disabled={
                                                        form.spendLimit ===
                                                        initialForm.spendLimit
                                                    }
                                                    onClick={() =>
                                                        setForm({
                                                            spendLimit:
                                                                initialForm.spendLimit,
                                                        })
                                                    }
                                                >
                                                    <Refresh size={14} />
                                                    <FormattedMessage
                                                        id="approval.spend-limit.edit-modal.revert"
                                                        defaultMessage="Revert changes"
                                                    />
                                                </Tertiary>
                                            }
                                        />
                                    )}
                                </FloatInput>
                            )}
                        </Column2>
                    </Popup.Content>
                    <Popup.Actions>
                        <Button
                            size="regular"
                            variant="secondary"
                            onClick={(ev) => {
                                ev.preventDefault()
                                onMsg({ type: 'close' })
                            }}
                        >
                            <FormattedMessage
                                id="approval.spend-limit.edit-modal.cancel"
                                defaultMessage="Cancel"
                            />
                        </Button>
                        <Button
                            type="submit"
                            size="regular"
                            variant="primary"
                            disabled={!!errors.submit}
                        >
                            <FormattedMessage
                                id="approval.spend-limit.edit-modal.submit"
                                defaultMessage="Save changes"
                            />
                        </Button>
                    </Popup.Actions>
                </Column2>
            </form>
        </Popup.Layout>
    )
}
