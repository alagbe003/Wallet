import { COUNTRIES_MAP, CountryISOCode } from '@zeal/domains/Country'
import { nonEmptyString, nonNull, Result, shape } from '@zeal/toolkit/Result'
import { ResidenceDetails } from '@zeal/domains/Currency/domains/BankTransfer/api/submitUnblockKycApplication'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Button, IconButton } from 'src/uikit'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { Column2 } from 'src/uikit/Column2'
import { Header } from 'src/uikit/Header'
import { FormattedMessage, useIntl } from 'react-intl'
import { notReachable } from '@zeal/toolkit'
import { Text2 } from 'src/uikit/Text2'
import { Input2 } from 'src/uikit/Input/Input2'
import { Spacer2 } from 'src/uikit/Spacer2'
import { InputButton } from 'src/uikit/Button/InputButton'
import { Avatar as CountryIcon } from 'src/domains/Country/components/Avatar'
import { QuestionCircle } from 'src/uikit/Icon/QuestionCircle'
import { ArrowDown } from 'src/uikit/Icon/Navigation/ArrowDown'
import { Account } from '@zeal/domains/Account'
import { Network } from '@zeal/domains/Network'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { ActionBar } from 'src/domains/Account/components/ActionBar'

export type InitialResidenceDetails = {
    country: CountryISOCode | null
    address: string | null
    postCode: string | null
    city: string | null
}

type FormErrors = {
    submit?:
        | { type: 'country_required' }
        | { type: 'address_required' }
        | { type: 'post_code_required' }
        | { type: 'city_required' }
}

type Props = {
    form: InitialResidenceDetails
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_form_submitted'; completedForm: ResidenceDetails }
    | { type: 'on_select_country_click' }
    | { type: 'on_form_change'; form: InitialResidenceDetails }
    | { type: 'on_back_button_clicked' }
    | {
          type: 'close'
      }

const validateOnSubmit = (
    form: InitialResidenceDetails
): Result<FormErrors, ResidenceDetails> => {
    return shape({
        country: nonNull(form.country).mapError(() => ({
            type: 'country_required' as const,
        })),
        address: nonEmptyString(form.address).mapError(() => ({
            type: 'address_required' as const,
        })),
        postCode: nonEmptyString(form.postCode).mapError(() => ({
            type: 'post_code_required' as const,
        })),
        city: nonEmptyString(form.city).mapError(() => ({
            type: 'city_required' as const,
        })),
    }).mapError(({ country, address, postCode, city }) => ({
        submit: country || address || postCode || city,
    }))
}

export const Layout = ({
    form,
    onMsg,
    account,
    network,
    keyStoreMap,
}: Props) => {
    const errors = validateOnSubmit(form).getFailureReason() || {}

    const { formatMessage } = useIntl()

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
                            id="bank_transfer.residence_details.title"
                            defaultMessage="Your residence"
                        />
                    }
                />

                <form
                    id="submit-personal-details-form"
                    onSubmit={async (e) => {
                        e.preventDefault()

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
                                    id="bank_transfer.residence_details.title"
                                    defaultMessage="Country of residence"
                                />
                            </Text2>

                            <InputButton
                                leftIcon={
                                    form.country ? (
                                        <CountryIcon
                                            countryCode={form.country}
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
                                    <ArrowDown color="iconDisabled" size={24} />
                                }
                                onClick={() => {
                                    onMsg({
                                        type: 'on_select_country_click',
                                    })
                                }}
                            >
                                {form.country ? (
                                    COUNTRIES_MAP[form.country].name
                                ) : (
                                    <FormattedMessage
                                        id="bank_transfer.residence_details.country_placeholder"
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
                                    id="bank_transfer.residence_details.address"
                                    defaultMessage="Your address"
                                />
                            </Text2>

                            <Input2
                                onChange={(event) =>
                                    onMsg({
                                        type: 'on_form_change',
                                        form: {
                                            ...form,
                                            address: event.target.value,
                                        },
                                    })
                                }
                                state="normal"
                                placeholder={formatMessage({
                                    id: 'bank_transfer.residence_details.street',
                                    defaultMessage: 'Street',
                                })}
                                variant="regular"
                                value={form.address ?? ''}
                            />
                        </Column2>
                        <Column2 spacing={8}>
                            <Text2
                                variant="paragraph"
                                weight="regular"
                                color="textSecondary"
                            >
                                <FormattedMessage
                                    id="bank_transfer.residence_details.postcode"
                                    defaultMessage="Postcode"
                                />
                            </Text2>

                            <Input2
                                onChange={(event) =>
                                    onMsg({
                                        type: 'on_form_change',
                                        form: {
                                            ...form,
                                            postCode: event.target.value,
                                        },
                                    })
                                }
                                state="normal"
                                placeholder="..."
                                variant="regular"
                                value={form.postCode ?? ''}
                            />
                        </Column2>
                        <Column2 spacing={8}>
                            <Text2
                                variant="paragraph"
                                weight="regular"
                                color="textSecondary"
                            >
                                <FormattedMessage
                                    id="bank_transfer.residence_details.city"
                                    defaultMessage="City"
                                />
                            </Text2>

                            <Input2
                                onChange={(event) =>
                                    onMsg({
                                        type: 'on_form_change',
                                        form: {
                                            ...form,
                                            city: event.target.value,
                                        },
                                    })
                                }
                                state="normal"
                                placeholder="London"
                                variant="regular"
                                value={form.city ?? ''}
                            />
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
