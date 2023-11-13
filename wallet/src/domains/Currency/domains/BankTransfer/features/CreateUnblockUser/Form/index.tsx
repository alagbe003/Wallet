import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { COUNTRIES_MAP } from '@zeal/domains/Country'
import { Avatar as CurrencyIcon } from 'src/domains/Country/components/Avatar'
import { CreateUnblockUserParams } from '@zeal/domains/Currency/domains/BankTransfer/api/createUnblockUser'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network } from '@zeal/domains/Network'
import { notReachable } from '@zeal/toolkit'
import { Button, IconButton } from 'src/uikit'
import { InputButton } from 'src/uikit/Button/InputButton'
import { Column2 } from 'src/uikit/Column2'
import { Header } from 'src/uikit/Header'
import { ArrowDown } from 'src/uikit/Icon/Navigation/ArrowDown'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { QuestionCircle } from 'src/uikit/Icon/QuestionCircle'
import { Input2 } from 'src/uikit/Input/Input2'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Text } from '@zeal/uikit/Text'
import { Modal, State as ModalState } from './Modal'
import {
    CountryError,
    EmailError,
    EmptyForm,
    FirstNameError,
    LastNameError,
    validateAsYouType,
    validateOnSubmit,
} from './validation'
import { TextButton } from '@zeal/uikit/TextButton'

type Props = {
    account: Account
    network: Network
    keystoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'on_create_user_form_submit'
          form: CreateUnblockUserParams
      }

export const Form = ({ account, keystoreMap, network, onMsg }: Props) => {
    const [form, setForm] = useState<EmptyForm>({
        firstName: '',
        email: '',
        lastName: '',
        countryCode: null,
    })

    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

    const error = isSubmitted
        ? validateOnSubmit(form, account).getFailureReason() || {}
        : validateAsYouType(form).getFailureReason() || {}

    return (
        <>
            <form
                style={{ width: '100%', height: '100%', display: 'flex' }}
                onSubmit={(e) => {
                    e.preventDefault()
                    setIsSubmitted(true)
                    const result = validateOnSubmit(form, account)
                    switch (result.type) {
                        case 'Failure':
                            break
                        case 'Success':
                            onMsg({
                                type: 'on_create_user_form_submit',
                                form: result.data,
                            })

                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(result)
                    }
                }}
            >
                <Layout2 background="light" padding="form">
                    <ActionBar
                        account={account}
                        keystore={getKeyStore({
                            keyStoreMap: keystoreMap,
                            address: account.address,
                        })}
                        network={network}
                        left={
                            <IconButton
                                onClick={() => onMsg({ type: 'close' })}
                            >
                                <BackIcon size={24} />
                            </IconButton>
                        }
                    />

                    <Column2 spacing={24}>
                        <Header
                            title={
                                <FormattedMessage
                                    id="currency.bank_transfer.create_unblock_user.title"
                                    defaultMessage="Link your bank account"
                                />
                            }
                            subtitle={
                                <FormattedMessage
                                    id="currency.bank_transfer.create_unblock_user.subtitle"
                                    defaultMessage="Add your name and email exactly as they appear in your bank account statements"
                                />
                            }
                        />

                        <Column2 spacing={8}>
                            <Column2 spacing={8}>
                                <Text
                                    variant="paragraph"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="currency.bank_transfer.create_unblock_user.first_name"
                                        defaultMessage="Beneficiary first name"
                                    />
                                </Text>

                                <Input2
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            firstName: event.target.value,
                                        })
                                    }
                                    state={error.firstName ? 'error' : 'normal'}
                                    placeholder="Vitalik"
                                    variant="regular"
                                    value={form.firstName}
                                    message={
                                        error.firstName && (
                                            <FirstNameErrorMessage
                                                error={error.firstName}
                                            />
                                        )
                                    }
                                />
                            </Column2>

                            <Column2 spacing={8}>
                                <Text
                                    variant="paragraph"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="currency.bank_transfer.create_unblock_user.last_name"
                                        defaultMessage="Beneficiary last name"
                                    />
                                </Text>

                                <Input2
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            lastName: event.target.value,
                                        })
                                    }
                                    state={error.lastName ? 'error' : 'normal'}
                                    placeholder="Buterin"
                                    variant="regular"
                                    value={form.lastName}
                                    message={
                                        error.lastName && (
                                            <LastNameErrorMessage
                                                error={error.lastName}
                                            />
                                        )
                                    }
                                />
                            </Column2>

                            <Column2 spacing={8}>
                                <Text
                                    variant="paragraph"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="currency.bank_transfer.create_unblock_user.email"
                                        defaultMessage="Email address"
                                    />
                                </Text>

                                <Input2
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            email: event.target.value,
                                        })
                                    }
                                    state={error.email ? 'error' : 'normal'}
                                    message={
                                        error.email && (
                                            <EmailErrorMessage
                                                error={error.email}
                                            />
                                        )
                                    }
                                    placeholder="@email.com"
                                    variant="regular"
                                    value={form.email}
                                />
                            </Column2>

                            <Column2 spacing={8}>
                                <Text
                                    variant="paragraph"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="currency.bank_transfer.create_unblock_withdraw_account.bank_country"
                                        defaultMessage="Bank country"
                                    />
                                </Text>

                                <InputButton
                                    leftIcon={
                                        form.countryCode ? (
                                            <CurrencyIcon
                                                countryCode={form.countryCode}
                                                size={28}
                                            />
                                        ) : (
                                            <QuestionCircle
                                                size={28}
                                                color="iconDefault"
                                            />
                                        )
                                    }
                                    rightIcon={
                                        <ArrowDown
                                            color="iconDisabled"
                                            size={24}
                                        />
                                    }
                                    onClick={() => {
                                        setModalState({
                                            type: 'select_country',
                                        })
                                    }}
                                >
                                    {form.countryCode
                                        ? COUNTRIES_MAP[form.countryCode].name
                                        : 'Country'}
                                </InputButton>
                            </Column2>
                        </Column2>
                    </Column2>

                    <Spacer2 />

                    <Column2 spacing={24}>
                        <Text
                            variant="footnote"
                            weight="regular"
                            color="textSecondary"
                        >
                            <FormattedMessage
                                id="currency.bank_transfer.create_unblock_user.note"
                                defaultMessage="By continuing you accept Unblock’s (our banking partner) <terms>Terms</terms> and <policy>Privacy Policy</policy>"
                                values={{
                                    terms: (msg) => (
                                        <TextButton
                                            onClick={() => {
                                                window.open(
                                                    'https://www.getunblock.com/policies/policies'
                                                )
                                            }}
                                        >
                                            {msg}
                                        </TextButton>
                                    ),
                                    policy: (msg) => (
                                        <TextButton
                                            onClick={() => {
                                                window.open(
                                                    'https://www.getunblock.com/policies/privacy-policy'
                                                )
                                            }}
                                        >
                                            {msg}
                                        </TextButton>
                                    ),
                                }}
                            />
                        </Text>

                        <Button
                            type="submit"
                            size="regular"
                            variant="primary"
                            disabled={!!error.submit}
                        >
                            <FormattedMessage
                                id="action.continue"
                                defaultMessage="Continue"
                            />
                        </Button>
                    </Column2>
                </Layout2>
            </form>

            <Modal
                currentCountryCode={form.countryCode || null}
                state={modalState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModalState({ type: 'closed' })
                            break

                        case 'on_country_selected':
                            setModalState({ type: 'closed' })
                            setForm((form) => ({
                                ...form,
                                countryCode: msg.countryCode,
                            }))
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
        </>
    )
}

const FirstNameErrorMessage = ({ error }: { error: FirstNameError }) => {
    switch (error.type) {
        case 'string_is_empty':
        case 'value_is_not_a_string':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.first_name_missing"
                    defaultMessage="Required"
                />
            )

        default:
            return notReachable(error)
    }
}

const LastNameErrorMessage = ({ error }: { error: LastNameError }) => {
    switch (error.type) {
        case 'string_is_empty':
        case 'value_is_not_a_string':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.last_name_missing"
                    defaultMessage="Required"
                />
            )

        default:
            return notReachable(error)
    }
}

const EmailErrorMessage = ({ error }: { error: EmailError }) => {
    switch (error.type) {
        case 'string_is_empty':
        case 'value_is_not_a_string':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.email_missing"
                    defaultMessage="Required"
                />
            )

        case 'value_is_not_an_email':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.email_invalid"
                    defaultMessage="Invalid email"
                />
            )

        default:
            return notReachable(error)
    }
}

export const CountryErrorMessage = ({ error }: { error: CountryError }) => {
    switch (error.type) {
        case 'value_is_required':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.country_missing"
                    defaultMessage="Required"
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(error.type)
    }
}
