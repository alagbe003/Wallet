import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { COUNTRIES_MAP, Country, CountryISOCode } from '@zeal/domains/Country'
import { Avatar as CountryIcon } from 'src/domains/Country/components/Avatar'
import { FiatCurrency } from '@zeal/domains/Currency'
import { CreateOffRampAccountRequest } from '@zeal/domains/Currency/domains/BankTransfer/api/createOffRampAccount'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { formatSortCode } from '@zeal/domains/Currency/domains/BankTransfer/helpers/formatSortCode'
import { defaultCurrencyForCountryCode } from '@zeal/domains/Currency/domains/BankTransfer/helpers/getDefaultCurrencyForCountry'
import { ImperativeError } from '@zeal/domains/Error'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'
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
import { Button } from 'src/uikit'
import { Avatar } from 'src/uikit/Avatar'
import { InputButton } from 'src/uikit/Button/InputButton'
import { Column2 } from 'src/uikit/Column2'
import { Header } from 'src/uikit/Header'
import { ArrowDown } from 'src/uikit/Icon/Navigation/ArrowDown'
import { QuestionCircle } from 'src/uikit/Icon/QuestionCircle'
import { Input2 } from 'src/uikit/Input/Input2'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Text2 } from 'src/uikit/Text2'
import { Modal, State as ModalState } from './Modal'

type Props = {
    currencies: BankTransferCurrencies
    account: Account
    keyStoreMap: KeyStoreMap
    network: Network
    loginInfo: UnblockLoginInfo
    bankTransferInfo: BankTransferUnblockUserCreated
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'form_submitted'; form: CreateOffRampAccountRequest }

type InitialForm = {
    country?: Country
    currency?: FiatCurrency
    bankDetails?: BankDetailsInput
}

type BankDetailsInput =
    | {
          type: 'uk'
          accountNumber?: string
          sortCode?: string
      }
    | { type: 'iban'; iban?: string }
    | {
          type: 'ngn'
          accountNumber?: string
          bankCode?: string
          bankVerificationNumber?: string
      }

type FormErrors = {
    accountNumber?: AccountNumberError
    sortCode?: SortCodeError
    iban?: IBANError
    bankCode?: BankCodeError
    bankVerificationNumber?: BankVerificationNumberError

    submit?: RequiredError
}

type AccountNumberError =
    | RequiredError
    | UKBankAccountNumberStringError
    | NgnBankAccountNumberStringError

type SortCodeError = RequiredError | UKBankSortCodeStringError

type IBANError = RequiredError | IBANStringError

type BankCodeError = RequiredError | NgnBankCodeStringError

type BankVerificationNumberError =
    | RequiredError
    | NgnBankVerificationNumberStringError

const validateAsYouType = (form: InitialForm): Result<FormErrors, unknown> => {
    return shape({
        submit: required(form.country).andThen(() =>
            required(form.currency).andThen(() => required(form.bankDetails))
        ),
    })
}

const validateOnSubmit = (
    form: InitialForm,
    loginInfo: UnblockLoginInfo
): Result<FormErrors, CreateOffRampAccountRequest> => {
    return shape({
        country: required(form.country),
        currency: required(form.currency),
        bankDetails: required(form.bankDetails),

        accountNumber: validateAccountNumber(form),
        sortCode: validateSortCode(form),
        iban: validateIBAN(form),
        bankCode: validateBankCode(form),
        bankVerificationNumber: validateBankVerificationNumber(form),

        submit: required(form.bankDetails),
    }).map((validForm) => {
        switch (validForm.submit.type) {
            case 'uk':
                return {
                    ...loginInfo,
                    country: validForm.country,
                    currency: validForm.currency,
                    bankDetails: {
                        type: 'uk',
                        accountNumber: validForm.accountNumber,
                        sortCode: validForm.sortCode,
                    },
                }

            case 'iban':
                return {
                    ...loginInfo,
                    country: validForm.country,
                    currency: validForm.currency,
                    bankDetails: {
                        type: 'iban',
                        iban: validForm.iban,
                    },
                }

            case 'ngn':
                return {
                    ...loginInfo,
                    country: validForm.country,
                    currency: validForm.currency,
                    bankDetails: {
                        type: 'ngn',
                        accountNumber: validForm.accountNumber,
                        bankCode: validForm.bankCode,
                        bankVerificationNumber:
                            validForm.bankVerificationNumber,
                    },
                }

            default:
                return notReachable(validForm.submit)
        }
    })
}

const validateAccountNumber = (
    form: InitialForm
): Result<AccountNumberError, string> => {
    return required(form.bankDetails).andThen(
        (bankDetails): Result<AccountNumberError, string> => {
            switch (bankDetails.type) {
                case 'uk':
                    return ukBankAccountNumberString(bankDetails.accountNumber)

                case 'ngn':
                    return ngnBankAccountNumberString(bankDetails.accountNumber)

                case 'iban':
                    return success('')

                default:
                    return notReachable(bankDetails)
            }
        }
    )
}

const validateBankCode = (form: InitialForm): Result<BankCodeError, string> => {
    return required(form.bankDetails).andThen((bankDetails) => {
        switch (bankDetails.type) {
            case 'ngn':
                return ngnBankCodeString(bankDetails.bankCode)

            case 'uk':
            case 'iban':
                return success('')

            default:
                return notReachable(bankDetails)
        }
    })
}

const validateSortCode = (form: InitialForm): Result<SortCodeError, string> => {
    return required(form.bankDetails).andThen((bankDetails) => {
        switch (bankDetails.type) {
            case 'uk':
                return ukBankSortCodeString(bankDetails.sortCode)

            case 'iban':
            case 'ngn':
                return success('')

            default:
                return notReachable(bankDetails)
        }
    })
}

const validateIBAN = (form: InitialForm): Result<IBANError, string> => {
    return required(form.bankDetails).andThen((bankDetails) => {
        switch (bankDetails.type) {
            case 'uk':
            case 'ngn':
                return success('')

            case 'iban':
                return ibanString(bankDetails.iban)

            default:
                return notReachable(bankDetails)
        }
    })
}

const validateBankVerificationNumber = (
    form: InitialForm
): Result<BankVerificationNumberError, string> => {
    return required(form.bankDetails).andThen((bankDetails) => {
        switch (bankDetails.type) {
            case 'ngn':
                return ngnBankVerificationNumberString(
                    bankDetails.bankVerificationNumber
                )

            case 'uk':
            case 'iban':
                return success('')

            default:
                return notReachable(bankDetails)
        }
    })
}

const changeCountry = (
    country: Country,
    form: InitialForm,
    currencies: BankTransferCurrencies
): InitialForm => {
    const newCurrency = defaultCurrencyForCountryCode(
        country.code,
        currencies.fiatCurrencies
    )

    const newBankDetails = defaultBankDetails(country.code, newCurrency)

    return {
        country,
        currency: newCurrency,
        bankDetails:
            form.bankDetails?.type === newBankDetails?.type
                ? form.bankDetails
                : newBankDetails,
    }
}

const changeCurrency = (
    currency: FiatCurrency,
    form: InitialForm
): InitialForm => {
    if (!form.country) {
        return {
            ...form,
            currency,
        }
    }

    const newBankDetails = defaultBankDetails(form.country.code, currency)

    return {
        ...form,
        currency,
        bankDetails:
            form.bankDetails?.type === newBankDetails?.type
                ? form.bankDetails
                : newBankDetails,
    }
}

const calculateInitialForm = (
    bankTransferInfo: BankTransferUnblockUserCreated,
    currencies: BankTransferCurrencies
): InitialForm => {
    if (!bankTransferInfo.countryCode) {
        return {}
    }

    const defaultCurrency = defaultCurrencyForCountryCode(
        bankTransferInfo.countryCode,
        currencies.fiatCurrencies
    )

    return {
        country: COUNTRIES_MAP[bankTransferInfo.countryCode],
        currency: defaultCurrency,
        bankDetails: defaultBankDetails(
            bankTransferInfo.countryCode,
            defaultCurrency
        ),
    }
}

const defaultBankDetails = (
    countryCode: CountryISOCode,
    currency: FiatCurrency
): InitialForm['bankDetails'] => {
    switch (countryCode) {
        case 'GB':
            if (currency.code === 'GBP') {
                return {
                    type: 'uk',
                }
            }
            return {
                type: 'iban',
            }
        case 'NG':
            if (currency.code === 'NGN') {
                return {
                    type: 'ngn',
                }
            }
            return { type: 'iban' }

        default:
            return {
                type: 'iban',
            }
    }
}

const parsedSortCode = (newValue: string, bankDetails: BankDetailsInput) => {
    switch (bankDetails.type) {
        case 'uk':
            return newValue.replace(/[^0-9]/g, '').substring(0, 6)

        case 'iban':
        case 'ngn':
            throw new ImperativeError(
                `Bank details type ${bankDetails.type} does not have a sort code`
            )

        default:
            notReachable(bankDetails)
    }
}

// TODO :: Review implementation (this looks similar to WithdrawalForm/Form/Modal/SelectCurrency/CreateBankAccount/Form/index.tsx, so probably something can be reused)
export const Form = ({
    currencies,
    bankTransferInfo,
    loginInfo,
    account,
    keyStoreMap,
    network,
    onMsg,
}: Props) => {
    const [form, setForm] = useState<InitialForm>(() =>
        calculateInitialForm(bankTransferInfo, currencies)
    )

    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

    const error = isSubmitted
        ? validateOnSubmit(form, loginInfo).getFailureReason() || {}
        : validateAsYouType(form).getFailureReason() || {}

    return (
        <>
            <form
                style={{ width: '100%', height: '100%', display: 'flex' }}
                onSubmit={(e) => {
                    e.preventDefault()
                    setIsSubmitted(true)
                    const result = validateOnSubmit(form, loginInfo)
                    switch (result.type) {
                        case 'Failure':
                            break
                        case 'Success':
                            onMsg({
                                type: 'form_submitted',
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
                            keyStoreMap,
                            address: account.address,
                        })}
                        network={network}
                    />
                    <Column2 spacing={24}>
                        <Header
                            title={
                                <FormattedMessage
                                    id="currency.bank_transfer.create_unblock_withdraw_account.title"
                                    defaultMessage="Link your bank account"
                                />
                            }
                        />

                        <Column2 spacing={8}>
                            <Column2 spacing={8}>
                                <Text2
                                    variant="paragraph"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="currency.bank_transfer.create_unblock_withdraw_account.bank_country"
                                        defaultMessage="Bank country"
                                    />
                                </Text2>

                                <InputButton
                                    leftIcon={
                                        form.country ? (
                                            <CountryIcon
                                                countryCode={form.country.code}
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
                                    {form.country?.name || (
                                        <FormattedMessage
                                            id="bank_transfer.setup_unblock_bank_account.country_placeholder"
                                            defaultMessage="Country"
                                        />
                                    )}
                                </InputButton>
                            </Column2>

                            <Column2 spacing={8}>
                                <Text2
                                    variant="paragraph"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="currency.bank_transfer.create_unblock_withdraw_account.preferred_currency"
                                        defaultMessage="Preferred currency"
                                    />
                                </Text2>

                                <InputButton
                                    leftIcon={
                                        form.currency ? (
                                            <Avatar
                                                size={28}
                                                border="secondary"
                                            >
                                                <Text2
                                                    variant="caption1"
                                                    weight="medium"
                                                    color="textPrimary"
                                                    align="center"
                                                >
                                                    {form.currency.symbol}
                                                </Text2>
                                            </Avatar>
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
                                            type: 'select_currency',
                                        })
                                    }}
                                >
                                    {form.currency?.name || 'Currency'}
                                </InputButton>
                            </Column2>

                            {form.bankDetails?.type === 'uk' && (
                                <Column2 spacing={8}>
                                    <Text2
                                        variant="paragraph"
                                        weight="regular"
                                        color="textSecondary"
                                    >
                                        <FormattedMessage
                                            id="currency.bank_transfer.create_unblock_withdraw_account.account_number"
                                            defaultMessage="Account number"
                                        />
                                    </Text2>

                                    <Input2
                                        onChange={(event) =>
                                            setForm((form) => ({
                                                ...form,
                                                bankDetails:
                                                    form.bankDetails && {
                                                        ...form.bankDetails,
                                                        accountNumber:
                                                            event.target.value,
                                                    },
                                            }))
                                        }
                                        state={
                                            error.accountNumber
                                                ? 'error'
                                                : 'normal'
                                        }
                                        placeholder="00000000"
                                        variant="regular"
                                        value={(() => {
                                            switch (form.bankDetails?.type) {
                                                case 'uk':
                                                    return (
                                                        form.bankDetails
                                                            .accountNumber || ''
                                                    )

                                                default:
                                                    return ''
                                            }
                                        })()}
                                        message={
                                            error.accountNumber && (
                                                <AccountNumberErrorMessage
                                                    error={error.accountNumber}
                                                />
                                            )
                                        }
                                    />
                                </Column2>
                            )}

                            {form.bankDetails?.type === 'uk' && (
                                <Column2 spacing={8}>
                                    <Text2
                                        variant="paragraph"
                                        weight="regular"
                                        color="textSecondary"
                                    >
                                        <FormattedMessage
                                            id="currency.bank_transfer.create_unblock_withdraw_account.sort_code"
                                            defaultMessage="Sort code"
                                        />
                                    </Text2>

                                    <Input2
                                        onChange={(event) =>
                                            setForm((form) => ({
                                                ...form,
                                                bankDetails:
                                                    form.bankDetails && {
                                                        ...form.bankDetails,
                                                        sortCode:
                                                            parsedSortCode(
                                                                event.target
                                                                    .value,
                                                                form.bankDetails
                                                            ),
                                                    },
                                            }))
                                        }
                                        state={
                                            error.sortCode ? 'error' : 'normal'
                                        }
                                        placeholder="00-00-00"
                                        variant="regular"
                                        value={(() => {
                                            switch (form.bankDetails?.type) {
                                                case 'uk':
                                                    return formatSortCode(
                                                        form.bankDetails
                                                            .sortCode
                                                    )

                                                default:
                                                    return ''
                                            }
                                        })()}
                                        message={
                                            error.sortCode && (
                                                <SortCodeErrorMessage
                                                    error={error.sortCode}
                                                />
                                            )
                                        }
                                    />
                                </Column2>
                            )}

                            {form.bankDetails?.type === 'ngn' && (
                                <Column2 spacing={8}>
                                    <Text2
                                        variant="paragraph"
                                        weight="regular"
                                        color="textSecondary"
                                    >
                                        <FormattedMessage
                                            id="currency.bank_transfer.create_unblock_withdraw_account.account_number"
                                            defaultMessage="Account number"
                                        />
                                    </Text2>

                                    <Input2
                                        onChange={(event) =>
                                            setForm((form) => ({
                                                ...form,
                                                bankDetails:
                                                    form.bankDetails && {
                                                        ...form.bankDetails,
                                                        accountNumber:
                                                            event.target.value,
                                                    },
                                            }))
                                        }
                                        state={
                                            error.accountNumber
                                                ? 'error'
                                                : 'normal'
                                        }
                                        placeholder="0000000000"
                                        variant="regular"
                                        value={(() => {
                                            switch (form.bankDetails?.type) {
                                                case 'ngn':
                                                    return (
                                                        form.bankDetails
                                                            .accountNumber || ''
                                                    )

                                                default:
                                                    return ''
                                            }
                                        })()}
                                        message={
                                            error.accountNumber && (
                                                <AccountNumberErrorMessage
                                                    error={error.accountNumber}
                                                />
                                            )
                                        }
                                    />
                                </Column2>
                            )}

                            {form.bankDetails?.type === 'ngn' && (
                                <>
                                    <Column2 spacing={8}>
                                        <Text2
                                            variant="paragraph"
                                            weight="regular"
                                            color="textSecondary"
                                        >
                                            <FormattedMessage
                                                id="currency.bank_transfer.create_unblock_withdraw_account.bank_code"
                                                defaultMessage="Bank code"
                                            />
                                        </Text2>

                                        <Input2
                                            onChange={(event) =>
                                                setForm((form) => ({
                                                    ...form,
                                                    bankDetails:
                                                        form.bankDetails && {
                                                            ...form.bankDetails,
                                                            bankCode:
                                                                event.target
                                                                    .value,
                                                        },
                                                }))
                                            }
                                            state={
                                                error.bankCode
                                                    ? 'error'
                                                    : 'normal'
                                            }
                                            placeholder="101"
                                            variant="regular"
                                            value={(() => {
                                                switch (
                                                    form.bankDetails?.type
                                                ) {
                                                    case 'ngn':
                                                        return (
                                                            form.bankDetails
                                                                .bankCode || ''
                                                        )

                                                    default:
                                                        return ''
                                                }
                                            })()}
                                            message={
                                                error.bankCode && (
                                                    <BankCodeErrorMessage
                                                        error={error.bankCode}
                                                    />
                                                )
                                            }
                                        />
                                    </Column2>
                                    <Column2 spacing={8}>
                                        <Text2
                                            variant="paragraph"
                                            weight="regular"
                                            color="textSecondary"
                                        >
                                            <FormattedMessage
                                                id="currency.bank_transfer.create_unblock_withdraw_account.bvn"
                                                defaultMessage="Bank verification number (BVN)"
                                            />
                                        </Text2>

                                        <Input2
                                            onChange={(event) =>
                                                setForm((form) => ({
                                                    ...form,
                                                    bankDetails:
                                                        form.bankDetails && {
                                                            ...form.bankDetails,
                                                            bankVerificationNumber:
                                                                event.target
                                                                    .value,
                                                        },
                                                }))
                                            }
                                            state={
                                                error.bankVerificationNumber
                                                    ? 'error'
                                                    : 'normal'
                                            }
                                            placeholder="98765432345"
                                            variant="regular"
                                            value={(() => {
                                                switch (
                                                    form.bankDetails?.type
                                                ) {
                                                    case 'ngn':
                                                        return (
                                                            form.bankDetails
                                                                .bankVerificationNumber ||
                                                            ''
                                                        )

                                                    default:
                                                        return ''
                                                }
                                            })()}
                                            message={
                                                error.bankVerificationNumber && (
                                                    <BankVerificationNumberErrorMessage
                                                        error={
                                                            error.bankVerificationNumber
                                                        }
                                                    />
                                                )
                                            }
                                        />
                                    </Column2>
                                </>
                            )}

                            {form.bankDetails?.type === 'iban' && (
                                <Column2 spacing={8}>
                                    <Text2
                                        variant="paragraph"
                                        weight="regular"
                                        color="textSecondary"
                                    >
                                        <FormattedMessage
                                            id="currency.bank_transfer.create_unblock_withdraw_account.iban"
                                            defaultMessage="IBAN"
                                        />
                                    </Text2>

                                    <Input2
                                        onChange={(event) =>
                                            setForm((form) => ({
                                                ...form,
                                                bankDetails:
                                                    form.bankDetails && {
                                                        ...form.bankDetails,
                                                        iban: event.target
                                                            .value,
                                                    },
                                            }))
                                        }
                                        state={error.iban ? 'error' : 'normal'}
                                        placeholder={`${form.country?.code}0000000000000000`}
                                        variant="regular"
                                        value={(() => {
                                            switch (form.bankDetails?.type) {
                                                case 'iban':
                                                    return (
                                                        form.bankDetails.iban ||
                                                        ''
                                                    )

                                                default:
                                                    return ''
                                            }
                                        })()}
                                        message={
                                            error.iban && (
                                                <IBANErrorMessage
                                                    error={error.iban}
                                                />
                                            )
                                        }
                                    />
                                </Column2>
                            )}
                        </Column2>
                    </Column2>

                    <Spacer2 />

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
                </Layout2>
            </form>

            <Modal
                currencies={currencies}
                currentCountryCode={form.country?.code || null}
                currentCurrency={form.currency || null}
                state={modalState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModalState({ type: 'closed' })
                            break

                        case 'on_country_selected':
                            setModalState({ type: 'closed' })
                            setForm((form) =>
                                changeCountry(
                                    COUNTRIES_MAP[msg.countryCode],
                                    form,
                                    currencies
                                )
                            )
                            break

                        case 'on_currency_selected':
                            setForm(changeCurrency(msg.currency, form))
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

const AccountNumberErrorMessage = ({
    error,
}: {
    error: AccountNumberError
}) => {
    switch (error.type) {
        case 'value_is_required':
        case 'string_is_empty':
        case 'value_is_not_a_string':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.account_number_missing"
                    defaultMessage="Required"
                />
            )

        case 'uk_bank_account_number_invalid':
        case 'ngn_bank_account_number_invalid':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.account_number_invalid"
                    defaultMessage="Invalid account number"
                />
            )
        default:
            return notReachable(error)
    }
}

const BankCodeErrorMessage = ({ error }: { error: BankCodeError }) => {
    switch (error.type) {
        case 'ngn_bank_code_invalid':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.bank_code_invalid"
                    defaultMessage="Invalid bank code"
                />
            )
        case 'value_is_required':
        case 'string_is_empty':
        case 'value_is_not_a_string':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.account_number_missing"
                    defaultMessage="Required"
                />
            )
        default:
            return notReachable(error)
    }
}

const SortCodeErrorMessage = ({ error }: { error: SortCodeError }) => {
    switch (error.type) {
        case 'value_is_required':
        case 'string_is_empty':
        case 'value_is_not_a_string':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.sort_code_missing"
                    defaultMessage="Required"
                />
            )

        case 'uk_bank_sort_code_invalid':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.sort_code_invalid"
                    defaultMessage="Invalid sort code"
                />
            )

        default:
            return notReachable(error)
    }
}

const IBANErrorMessage = ({ error }: { error: IBANError }) => {
    switch (error.type) {
        case 'value_is_required':
        case 'string_is_empty':
        case 'value_is_not_a_string':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.sort_code_missing"
                    defaultMessage="Required"
                />
            )

        case 'iban_invalid':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.sort_code_invalid"
                    defaultMessage="Invalid IBAN"
                />
            )

        default:
            return notReachable(error)
    }
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
                    id="currency.bank_transfer.create_unblock_user.bank_verification_number_missing"
                    defaultMessage="Required"
                />
            )

        case 'ngn_bank_verification_number_invalid':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.bank_verification_number_invalid"
                    defaultMessage="Invalid bank verification number"
                />
            )

        default:
            return notReachable(error)
    }
}

type UKBankAccountNumberStringError =
    | EmptyStringError
    | { type: 'uk_bank_account_number_invalid'; value: unknown }

const ukBankAccountNumberString = (
    value: unknown
): Result<UKBankAccountNumberStringError, string> =>
    nonEmptyString(value).andThen((str) =>
        str.match(/^\d{8}$/)
            ? success(str)
            : failure({
                  type: 'uk_bank_account_number_invalid',
                  value: str,
              })
    )

type NgnBankAccountNumberStringError =
    | EmptyStringError
    | { type: 'ngn_bank_account_number_invalid'; value: unknown }

const ngnBankAccountNumberString = (
    value: unknown
): Result<NgnBankAccountNumberStringError, string> =>
    nonEmptyString(value).andThen((str) =>
        str.match(/^\d{10}$/)
            ? success(str)
            : failure({
                  type: 'ngn_bank_account_number_invalid',
                  value: str,
              })
    )

type NgnBankCodeStringError =
    | EmptyStringError
    | { type: 'ngn_bank_code_invalid' }

const ngnBankCodeString = (
    value: unknown
): Result<NgnBankCodeStringError, string> =>
    nonEmptyString(value).andThen((str) =>
        str.match(/^\d{3}$/)
            ? success(str)
            : failure({ type: 'ngn_bank_code_invalid' })
    )

type NgnBankVerificationNumberStringError =
    | EmptyStringError
    | { type: 'ngn_bank_verification_number_invalid' }

const ngnBankVerificationNumberString = (
    value: unknown
): Result<NgnBankVerificationNumberStringError, string> =>
    nonEmptyString(value).andThen((str) =>
        str.match(/^\d{11}$/)
            ? success(str)
            : failure({
                  type: 'ngn_bank_verification_number_invalid',
                  value: str,
              })
    )

type UKBankSortCodeStringError =
    | EmptyStringError
    | { type: 'uk_bank_sort_code_invalid'; value: unknown }

const ukBankSortCodeString = (
    value: unknown
): Result<UKBankSortCodeStringError, string> =>
    nonEmptyString(value).andThen((str) =>
        str.match(/^\d{6}$/)
            ? success(str)
            : failure({
                  type: 'uk_bank_sort_code_invalid',
                  value: str,
              })
    )

type IBANStringError =
    | EmptyStringError
    | { type: 'iban_invalid'; value: unknown }

const ibanString = (value: unknown): Result<IBANStringError, string> =>
    nonEmptyString(value).andThen((str) =>
        str.toUpperCase().match(/^[0-9A-Z]{16,34}$/)
            ? success(str)
            : failure({
                  type: 'iban_invalid',
                  value: str,
              })
    )
