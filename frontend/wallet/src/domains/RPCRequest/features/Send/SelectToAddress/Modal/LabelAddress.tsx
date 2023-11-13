import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { LabelErrorMessage } from 'src/domains/Account/domains/Label/components/LabelErrorMessage'
import { MAX_LENGTH } from 'src/domains/Account/domains/Label/constants'
import {
    Form,
    validateAsYouType,
    validateOnSubmit,
} from 'src/domains/Account/domains/Label/helpers/validator'
import { Address } from '@zeal/domains/Address'
import { TrackOnly } from '@zeal/domains/KeyStore'
import { notReachable } from '@zeal/toolkit'
import { values } from '@zeal/toolkit/Object'
import { Button } from 'src/uikit'
import { Header } from 'src/uikit/Header'
import { BoldSave } from 'src/uikit/Icon/BoldSave'
import { Input2 } from 'src/uikit/Input/Input2'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    accountsMap: AccountsMap
    address: Address
    onMsg: (msg: Msg) => void
}
type Msg =
    | { type: 'close' }
    | { type: 'on_add_label_skipped'; address: Address }
    | {
          type: 'on_account_create_request'
          accountsWithKeystores: {
              account: Account
              keystore: TrackOnly
          }[]
      }

export const LabelAddress = ({ accountsMap, address, onMsg }: Props) => {
    const { formatMessage } = useIntl()
    const [form, setForm] = useState<Form>({ label: '' })
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

    const accounts = values(accountsMap)

    const error = isSubmitted
        ? validateOnSubmit(form, accounts).getFailureReason()
        : validateAsYouType(form).getFailureReason()

    return (
        <Popup.Layout
            onMsg={onMsg}
            aria-labelledby="label-address-label"
            aria-describedby="label-address-description"
        >
            <Header
                titleId="label-address-label"
                subtitleId="label-address-description"
                icon={({ size, color }) => (
                    <BoldSave size={size} color={color} />
                )}
                title={
                    <FormattedMessage
                        id="SendERC20.label_address.title"
                        defaultMessage="Label this wallet"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="SendERC20.label_address.subtitle"
                        defaultMessage="Label this wallet so you can find it later."
                    />
                }
            />

            <Popup.Content>
                <form
                    id="label-form"
                    onSubmit={(event) => {
                        event.preventDefault()

                        setIsSubmitted(true)

                        const result = validateOnSubmit(form, accounts)
                        switch (result.type) {
                            case 'Failure':
                                break
                            case 'Success':
                                onMsg({
                                    type: 'on_account_create_request',
                                    accountsWithKeystores: [
                                        {
                                            account: {
                                                address: address,
                                                label: result.data.label,
                                                avatarSrc: null,
                                            },
                                            keystore: { type: 'track_only' },
                                        },
                                    ],
                                })
                                break

                            /* istanbul ignore next */
                            default:
                                return notReachable(result)
                        }
                    }}
                >
                    <Input2
                        variant="regular"
                        autoFocus
                        value={form.label}
                        onChange={(e) => {
                            setForm({
                                label: e.target.value.substring(0, MAX_LENGTH),
                            })
                        }}
                        state={!!error?.label ? 'error' : 'normal'}
                        message={<LabelErrorMessage error={error?.label} />}
                        sideMessage={`${form.label.length}/${MAX_LENGTH}`}
                        placeholder={formatMessage({
                            id: 'SendERC20.label_address.input_placeholder',
                            defaultMessage: 'Wallet label',
                        })}
                    />
                </form>
            </Popup.Content>

            <Popup.Actions>
                <Button
                    type="button"
                    variant="secondary"
                    size="regular"
                    onClick={() =>
                        onMsg({ type: 'on_add_label_skipped', address })
                    }
                >
                    <FormattedMessage id="actions.skip" defaultMessage="Skip" />
                </Button>

                <Button
                    type="submit"
                    form="label-form"
                    variant="primary"
                    size="regular"
                    disabled={!!error?.submit}
                >
                    <FormattedMessage
                        id="actions.continue"
                        defaultMessage="Continue"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}
