import {
    failure,
    nonEmptyString,
    parseDate,
    Result,
    shape,
    success,
} from '@zeal/toolkit/Result'
import { useState } from 'react'
import { PersonalDetails } from '@zeal/domains/Currency/domains/BankTransfer/api/submitUnblockKycApplication'
import { Button, IconButton } from 'src/uikit'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { Column2 } from 'src/uikit/Column2'
import { Header } from 'src/uikit/Header'
import { FormattedMessage } from 'react-intl'
import { notReachable } from '@zeal/toolkit'
import { Text2 } from 'src/uikit/Text2'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Input2 } from 'src/uikit/Input/Input2'
import { DateInput } from 'src/uikit/Input/DateInput'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { Account } from '@zeal/domains/Account'
import { Network } from '@zeal/domains/Network'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { ActionBar } from 'src/domains/Account/components/ActionBar'

export type InitialPersonalDetails = {
    firstName: string | null
    lastName: string | null
    dateOfBirth: string | null
}

type FormErrors = {
    dateOfBirth?:
        | { type: 'dob_required' }
        | { type: 'invalid_format' }
        | { type: 'must_be_past_date' }
    submit?:
        | { type: 'first_name_required' }
        | { type: 'last_name_required' }
        | { type: 'dob_required' }
        | { type: 'invalid_format' }
        | { type: 'must_be_past_date' }
}

type Msg =
    | { type: 'on_form_submitted'; completedForm: PersonalDetails }
    | { type: 'on_back_button_clicked' }
    | {
          type: 'close'
      }

type Props = {
    initialPersonalDetails: InitialPersonalDetails
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

const validateAsUserTypes = (
    form: InitialPersonalDetails
): Result<FormErrors, unknown> => {
    return shape({
        firstName: nonEmptyString(form.firstName).mapError(() => ({
            type: 'first_name_required' as const,
        })),
        lastName: nonEmptyString(form.lastName).mapError(() => ({
            type: 'last_name_required' as const,
        })),
        dateOfBirth: nonEmptyString(form.dateOfBirth).mapError(() => ({
            type: 'dob_required' as const,
        })),
    }).mapError(({ firstName, lastName, dateOfBirth }) => {
        return {
            submit: firstName || lastName || dateOfBirth,
        }
    })
}

const DATE_REG_EXP = /^\d\d\d\d-\d\d-\d\d$/

const validateDate = (
    input: string
): Result<
    { type: 'invalid_format' } | { type: 'must_be_past_date' },
    string
> => {
    if (!input.match(DATE_REG_EXP)) {
        return failure({ type: 'invalid_format' as const })
    }

    return parseDate(input)
        .mapError(() => ({
            type: 'invalid_format' as const,
        }))
        .andThen((date) => {
            if (date.valueOf() >= Date.now()) {
                return failure({ type: 'must_be_past_date' as const })
            }
            return success(input)
        })
}

const validateOnSubmit = (
    form: InitialPersonalDetails
): Result<FormErrors, PersonalDetails> => {
    return shape({
        firstName: nonEmptyString(form.firstName).mapError(() => ({
            type: 'first_name_required' as const,
        })),
        lastName: nonEmptyString(form.lastName).mapError(() => ({
            type: 'last_name_required' as const,
        })),
        dateOfBirth: nonEmptyString(form.dateOfBirth)
            .mapError(() => ({
                type: 'dob_required' as const,
            }))
            .andThen((date) => validateDate(date)),
    }).mapError(({ firstName, lastName, dateOfBirth }) => {
        return {
            dateOfBirth,
            submit: firstName || lastName || dateOfBirth,
        }
    })
}

export const PersonalDetailsForm = ({
    initialPersonalDetails,
    account,
    network,
    keyStoreMap,
    onMsg,
}: Props) => {
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
    const [form, setForm] = useState<InitialPersonalDetails>(
        initialPersonalDetails
    )

    const errors = isSubmitted
        ? validateOnSubmit(form).getFailureReason() || {}
        : validateAsUserTypes(form).getFailureReason() || {}

    return (
        <Layout2 padding="form" background="light">
            <ActionBar
                network={network}
                account={account}
                keystore={getKeyStore({
                    keyStoreMap,
                    address: account.address,
                })}
                left={
                    <IconButton
                        onClick={() =>
                            onMsg({ type: 'on_back_button_clicked' })
                        }
                    >
                        <BackIcon size={24} />
                    </IconButton>
                }
                right={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <CloseCross size={24} />
                    </IconButton>
                }
            />

            <Column2 spacing={24}>
                <Header
                    title={
                        <FormattedMessage
                            id="bank_transfer.personal_details.title"
                            defaultMessage="Your details"
                        />
                    }
                />

                <form
                    id="submit-personal-details-form"
                    onSubmit={async (e) => {
                        e.preventDefault()
                        setIsSubmitted(true)

                        const validation = validateOnSubmit(form)

                        switch (validation.type) {
                            case 'Failure':
                                break

                            case 'Success': {
                                onMsg({
                                    type: 'on_form_submitted',
                                    completedForm: validation.data,
                                })
                                break
                            }

                            default:
                                notReachable(validation)
                        }
                    }}
                >
                    <Column2 spacing={8}>
                        <Column2 spacing={8}>
                            <Text2
                                variant="paragraph"
                                weight="regular"
                                color="textSecondary"
                            >
                                <FormattedMessage
                                    id="bank_transfer.personal_details.first_name"
                                    defaultMessage="First name"
                                />
                            </Text2>

                            <Input2
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        firstName: event.target.value,
                                    })
                                }
                                state="normal"
                                placeholder="Vitalik"
                                variant="regular"
                                value={form.firstName ?? ''}
                            />
                        </Column2>
                        <Column2 spacing={8}>
                            <Text2
                                variant="paragraph"
                                weight="regular"
                                color="textSecondary"
                            >
                                <FormattedMessage
                                    id="bank_transfer.personal_details.last_name"
                                    defaultMessage="Last name"
                                />
                            </Text2>

                            <Input2
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        lastName: event.target.value,
                                    })
                                }
                                state="normal"
                                placeholder="Buterin"
                                variant="regular"
                                value={form.lastName ?? ''}
                            />
                        </Column2>
                        <Column2 spacing={8}>
                            <Text2
                                variant="paragraph"
                                weight="regular"
                                color="textSecondary"
                            >
                                <FormattedMessage
                                    id="bank_transfer.personal_details.date_of_birth"
                                    defaultMessage="Date of birth"
                                />
                            </Text2>

                            <DateInput
                                value={form.dateOfBirth}
                                onChange={(value) => {
                                    setForm({
                                        ...form,
                                        dateOfBirth: value,
                                    })
                                }}
                            >
                                {({ value, onChange }) => (
                                    <Input2
                                        onChange={onChange}
                                        placeholder="YYYY-MM-DD"
                                        variant="regular"
                                        state={
                                            !!errors?.dateOfBirth
                                                ? 'error'
                                                : 'normal'
                                        }
                                        message={
                                            errors?.dateOfBirth && (
                                                <DateMessage
                                                    error={errors.dateOfBirth}
                                                />
                                            )
                                        }
                                        value={value}
                                    />
                                )}
                            </DateInput>
                        </Column2>
                    </Column2>
                </form>
            </Column2>

            <Spacer2 />

            <Button
                type="submit"
                variant="primary"
                size="regular"
                disabled={!!errors.submit}
                form="submit-personal-details-form"
            >
                <FormattedMessage
                    id="actions.continue"
                    defaultMessage="Continue"
                />
            </Button>
        </Layout2>
    )
}

const DateMessage = ({
    error,
}: {
    error: NonNullable<FormErrors['dateOfBirth']>
}) => {
    switch (error.type) {
        case 'dob_required':
            return null
        case 'invalid_format':
            // TODO:: intentionally same will wait for feedback
            return (
                <FormattedMessage
                    id="bank_transfer.personal_details.date_of_birth.invalid_format"
                    defaultMessage="Date is invalid"
                />
            )
        case 'must_be_past_date':
            return (
                <FormattedMessage
                    id="bank_transfer.personal_details.date_of_birth.invalid_format"
                    defaultMessage="Date is invalid"
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}
