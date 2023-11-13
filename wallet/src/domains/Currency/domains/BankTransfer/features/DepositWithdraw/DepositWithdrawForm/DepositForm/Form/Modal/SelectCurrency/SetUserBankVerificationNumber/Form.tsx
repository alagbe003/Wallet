import {
    EmptyStringError,
    failure,
    nonEmptyString,
    required,
    RequiredError,
    Result,
    shape,
    success,
} from '@zeal/toolkit/Result'
import { useState } from 'react'
import { notReachable } from '@zeal/toolkit/notReachable'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { Account } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { Button, IconButton } from 'src/uikit'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { Column2 } from 'src/uikit/Column2'
import { FormattedMessage } from 'react-intl'
import { Header } from 'src/uikit/Header'
import { Text2 } from 'src/uikit/Text2'
import { Input2 } from 'src/uikit/Input/Input2'
import { Spacer2 } from 'src/uikit/Spacer2'

type Props = {
    account: Account
    keyStoreMap: KeyStoreMap
    network: Network
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_form_submitted'; bankVerificationNumber: string }

type Form = {
    bankVerificationNumber?: string
}

type FormError = {
    bankVerificationNumber?: BankVerificationNumberError
    submit?: RequiredError
}

const validateAsYouType = (form: Form): Result<FormError, unknown> =>
    shape({
        submit: required(form.bankVerificationNumber),
    })

const validateOnSubmit = (form: Form): Result<FormError, string> =>
    shape({
        bankVerificationNumber: required(form.bankVerificationNumber).andThen(
            (value) => validateBankVerificationNumber(value)
        ),
        submit: required(form.bankVerificationNumber),
    }).map((validForm) => validForm.bankVerificationNumber)

const validateBankVerificationNumber = (
    value: unknown
): Result<BankVerificationNumberError, string> =>
    nonEmptyString(value).andThen((str) =>
        str.match(/^\d{11}$/)
            ? success(str)
            : failure({
                  type: 'invalid_bank_verification_number',
                  value: str,
              })
    )

type BankVerificationNumberError =
    | RequiredError
    | EmptyStringError
    | { type: 'invalid_bank_verification_number' }

export const Form = ({ onMsg, account, network, keyStoreMap }: Props) => {
    const [form, setForm] = useState<Form>({})
    const [submitted, setSubmitted] = useState<boolean>(false)

    const errors = submitted
        ? validateOnSubmit(form).getFailureReason() || {}
        : validateAsYouType(form).getFailureReason() || {}

    return (
        <form
            style={{ width: '100%', height: '100%', display: 'flex' }}
            onSubmit={(e) => {
                e.preventDefault()
                setSubmitted(true)

                const result = validateOnSubmit(form)

                switch (result.type) {
                    case 'Failure':
                        break
                    case 'Success':
                        onMsg({
                            type: 'on_form_submitted',
                            bankVerificationNumber: result.data,
                        })
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(result)
                }
            }}
        >
            <Layout2 padding="form" background="light">
                <ActionBar
                    account={account}
                    keystore={getKeyStore({
                        keyStoreMap,
                        address: account.address,
                    })}
                    network={network}
                    left={
                        <IconButton onClick={() => onMsg({ type: 'close' })}>
                            <BackIcon size={24} />
                        </IconButton>
                    }
                />
                <Column2 spacing={24}>
                    <Header
                        title={
                            <FormattedMessage
                                id="currency.bank_transfer.add_user_bvn.title"
                                defaultMessage="Add bank verification number"
                            />
                        }
                    />
                    <Column2 spacing={8}>
                        <Text2
                            variant="paragraph"
                            weight="regular"
                            color="textSecondary"
                        >
                            <FormattedMessage
                                id="currency.bank_transfer.add_user_bvn.bvn_label"
                                defaultMessage="Bank verification number (BVN)"
                            />
                        </Text2>

                        <Input2
                            onChange={(event) =>
                                setForm({
                                    bankVerificationNumber: event.target.value,
                                })
                            }
                            state={
                                errors.bankVerificationNumber
                                    ? 'error'
                                    : 'normal'
                            }
                            placeholder="98765432345"
                            variant="regular"
                            value={form.bankVerificationNumber || ''}
                            message={
                                errors.bankVerificationNumber && (
                                    <BankVerificationNumberErrorMessage
                                        error={errors.bankVerificationNumber}
                                    />
                                )
                            }
                        />
                    </Column2>
                </Column2>
                <Spacer2 />

                <Button
                    type="submit"
                    size="regular"
                    variant="primary"
                    disabled={!!errors.submit}
                >
                    <FormattedMessage
                        id="action.continue"
                        defaultMessage="Continue"
                    />
                </Button>
            </Layout2>
        </form>
    )
}

const BankVerificationNumberErrorMessage = ({
    error,
}: {
    error: BankVerificationNumberError
}) => {
    switch (error.type) {
        case 'value_is_required':
        case 'string_is_empty':
        case 'value_is_not_a_string':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.add_user_bvn.bank_verification_number_required"
                    defaultMessage="Required"
                />
            )

        case 'invalid_bank_verification_number':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.add_user_bvn.invalid_bank_verification_number"
                    defaultMessage="Invalid bank verification number"
                />
            )

        default:
            return notReachable(error)
    }
}
