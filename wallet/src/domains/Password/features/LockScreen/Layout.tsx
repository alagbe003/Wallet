import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Screen } from '@zeal/uikit/Screen'
import { notReachable } from '@zeal/toolkit'
import { Button } from '@zeal/uikit/Button'
import { IconButton } from '@zeal/uikit/IconButton'
import { BoldEye } from '@zeal/uikit/Icon/BoldEye'
import { CloseCross } from '@zeal/uikit/Icon/Actions/CloseCross'
import { EyeCrossed } from '@zeal/uikit/Icon/EyeCrossed'
import { Header } from '@zeal/uikit/Header'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Spacer } from '@zeal/uikit/Spacer'
import { Column } from '@zeal/uikit/Column'
import { Input } from '@zeal/uikit/Input'
import { Row } from '@zeal/uikit/Row'
import {
    EmptyStringError,
    nonEmptyString,
    Result,
    shape,
} from '@zeal/toolkit/Result'

type Props = {
    error: { type: 'password_incorrect' } | null
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

const validateOnSubmit = (
    form: Form
): Result<FormError, { submit: string }> => {
    return shape({
        submit: nonEmptyString(form.userPassword),
    })
}

export const Layout = ({ error: submitError, onMsg }: Props) => {
    const [form, setForm] = useState<Form>({ userPassword: '' })
    const [inputType, setInputType] = useState<'text' | 'password'>('password')
    const error = validateOnSubmit(form).getFailureReason()
    const inputState = submitError ? 'error' : 'normal'

    const onSubmit = () => {
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
    }
    return (
        <Screen background="default" padding="form">
            <ActionBar
                right={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <CloseCross size={24} />
                    </IconButton>
                }
            />
            <Column spacing={16}>
                <Header
                    title={
                        <FormattedMessage
                            id="lockScreen.unlock.header"
                            defaultMessage="Unlock"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="lockScreen.unlock.subheader"
                            defaultMessage="Use your password to unlock Zeal"
                        />
                    }
                />

                <Input
                    onSubmitEditing={onSubmit}
                    variant="large"
                    type={inputType}
                    autoFocus={true}
                    value={form.userPassword}
                    onChange={(e) => {
                        setForm({ userPassword: e })
                    }}
                    state={inputState}
                    placeholder="Enter password"
                    message={<Message error={submitError} />}
                    rightIcon={(() => {
                        switch (inputType) {
                            case 'text':
                                return (
                                    <IconButton
                                        onClick={() => {
                                            setInputType('password')
                                        }}
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
                                        onClick={() => {
                                            setInputType('text')
                                        }}
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
            </Column>

            <Spacer />

            <Row spacing={0}>
                <Button
                    size="regular"
                    variant="primary"
                    disabled={!!error?.submit}
                    onClick={onSubmit}
                >
                    <FormattedMessage
                        id="action.continue"
                        defaultMessage="Continue"
                    />
                </Button>
            </Row>
        </Screen>
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
