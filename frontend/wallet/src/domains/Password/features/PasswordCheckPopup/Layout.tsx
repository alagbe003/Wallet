import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { notReachable } from '@zeal/toolkit'
import {
    EmptyStringError,
    nonEmptyString,
    Result,
    shape,
} from '@zeal/toolkit/Result'

import { Button, IconButton } from 'src/uikit'
import { Header } from 'src/uikit/Header'
import { BoldEye } from 'src/uikit/Icon/BoldEye'
import { BoldLock } from 'src/uikit/Icon/BoldLock'
import { EyeCrossed } from 'src/uikit/Icon/EyeCrossed'
import { Input2 } from 'src/uikit/Input/Input2'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    error: { type: 'password_incorrect' } | null
    subtitle: React.ReactNode
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'user_password_submitted'; userPassword: string }
    | { type: 'close' }

type Form = {
    userPassword: string
}

type FormError = {
    submit?: EmptyStringError
}

const validateOnSubmit = (form: Form): Result<FormError, { submit: string }> =>
    shape({
        submit: nonEmptyString(form.userPassword),
    })

export const Layout = ({ error: submitError, subtitle, onMsg }: Props) => {
    const [form, setForm] = useState<Form>({ userPassword: '' })
    const [inputType, setInputType] = useState<'text' | 'password'>('password')
    const error = validateOnSubmit(form).getFailureReason()
    const inputState = submitError ? 'error' : 'normal'

    return (
        <Popup.Layout
            onMsg={onMsg}
            aria-labelledby="password-check-popup-label"
            aria-describedby="password-check-popup-description"
        >
            <Header
                icon={({ size, color }) => (
                    <BoldLock size={size} color={color} />
                )}
                titleId="password-check-popup-label"
                title={
                    <FormattedMessage
                        id="PasswordCheck.title"
                        defaultMessage="Enter password"
                    />
                }
                subtitle={subtitle}
                subtitleId="password-check-popup-description"
            />

            <Popup.Content>
                <form
                    id="password-check-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        const result = validateOnSubmit(form)
                        switch (result.type) {
                            case 'Failure':
                                break
                            case 'Success':
                                onMsg({
                                    type: 'user_password_submitted',
                                    userPassword: result.data.submit,
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
                        type={inputType}
                        autoFocus={true}
                        value={form.userPassword}
                        onChange={(e) => {
                            setForm({ userPassword: e.target.value })
                        }}
                        state={inputState}
                        placeholder=""
                        message={<Message error={submitError} />}
                        rightIcon={(() => {
                            switch (inputType) {
                                case 'text':
                                    return (
                                        <IconButton
                                            onClick={() =>
                                                setInputType('password')
                                            }
                                        >
                                            <BoldEye
                                                color="iconDefault"
                                                size={24}
                                            />
                                        </IconButton>
                                    )
                                case 'password':
                                    return (
                                        <IconButton
                                            onClick={() => setInputType('text')}
                                        >
                                            <EyeCrossed
                                                color="iconDefault"
                                                size={24}
                                            />
                                        </IconButton>
                                    )

                                /* istanbul ignore next */
                                default:
                                    return notReachable(inputType)
                            }
                        })()}
                    />
                </form>
            </Popup.Content>

            <Popup.Actions>
                <Button
                    size="regular"
                    variant="secondary"
                    onClick={() => onMsg({ type: 'close' })}
                >
                    <FormattedMessage
                        id="actions.cancel"
                        defaultMessage="Cancel"
                    />
                </Button>

                <Button
                    type="submit"
                    form="password-check-form"
                    size="regular"
                    variant="primary"
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

const Message = ({ error }: { error: Props['error'] }) => {
    if (!error) {
        return null
    }
    switch (error.type) {
        case 'password_incorrect':
            return (
                <FormattedMessage
                    id="lockScreen.passwordIncorrectMessage"
                    defaultMessage="Password is incorrect"
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(error.type)
    }
}
