import { useState } from 'react'
import { notReachable } from '@zeal/toolkit'
import { Button, IconButton } from 'src/uikit'
import { FormattedMessage } from 'react-intl'
import { BoldEye } from 'src/uikit/Icon/BoldEye'
import { EyeCrossed } from 'src/uikit/Icon/EyeCrossed'
import {
    EmptyStringError,
    nonEmptyString,
    Result,
    shape,
} from '@zeal/toolkit/Result'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Header } from 'src/uikit/Header'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Column2 } from 'src/uikit/Column2'
import { Input2 } from 'src/uikit/Input/Input2'

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

    return (
        <form
            style={{ width: '100%', height: '100%', display: 'flex' }}
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
            <Layout2 background="default" padding="form">
                <ActionBar
                    right={
                        <IconButton onClick={() => onMsg({ type: 'close' })}>
                            <CloseCross size={24} />
                        </IconButton>
                    }
                />
                <Column2 spacing={16}>
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

                    <Input2
                        variant="large"
                        type={inputType}
                        autoFocus={true}
                        value={form.userPassword}
                        onChange={(e) => {
                            setForm({ userPassword: e.target.value })
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
                </Column2>

                <Spacer2 />

                <Button
                    type="submit"
                    size="regular"
                    variant="primary"
                    disabled={!!error?.submit}
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
