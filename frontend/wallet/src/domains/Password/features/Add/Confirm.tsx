import React, { useState } from 'react'
import { Button, IconButton } from 'src/uikit'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { failure, Result, shape, success } from '@zeal/toolkit/Result'
import { notReachable } from '@zeal/toolkit'
import { FormattedMessage } from 'react-intl'
import { Check } from './Check'
import { EyeCrossed } from 'src/uikit/Icon/EyeCrossed'
import { BoldEye } from 'src/uikit/Icon/BoldEye'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column2 } from 'src/uikit/Column2'
import { Header } from 'src/uikit/Header'
import { Input2 } from 'src/uikit/Input/Input2'
import { BoldLock } from 'src/uikit/Icon/BoldLock'

type Props = {
    password: string
    isPending: boolean
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | { type: 'password_confirmed'; password: string }

type Form = {
    password: string
}

type PasswordDidNotMatch = {
    type: 'password_did_not_match'
}

type FormError = {
    password?: PasswordDidNotMatch
}

const passwordDidNotMatch = (
    form: Form,
    password: string
): Result<PasswordDidNotMatch, string> => {
    return password === form.password
        ? success(password)
        : failure({
              type: 'password_did_not_match' as const,
          })
}

const validateOnSubmit = (
    form: Form,
    password: string
): Result<FormError, { password: string }> => {
    return shape({
        password: passwordDidNotMatch(form, password),
    })
}

export const Confirm = ({ password, isPending, onMsg }: Props) => {
    const [form, setForm] = useState<Form>({ password: '' })
    const [inputType, setInputType] = useState<'text' | 'password'>('password')

    const error = validateOnSubmit(form, password).getFailureReason()

    return (
        <form
            style={{ width: '100%', height: '100%', display: 'flex' }}
            onSubmit={(e) => {
                e.preventDefault()
                const result = validateOnSubmit(form, password)
                switch (result.type) {
                    case 'Failure':
                        break
                    case 'Success':
                        onMsg({
                            type: 'password_confirmed',
                            password,
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
                    left={
                        <IconButton onClick={() => onMsg({ type: 'close' })}>
                            <BackIcon size={24} />
                        </IconButton>
                    }
                />

                <Column2 spacing={16}>
                    <Header
                        icon={({ size, color }) => (
                            <BoldLock size={size} color={color} />
                        )}
                        title={
                            <FormattedMessage
                                id="password.confirm.header"
                                defaultMessage="Confirm password"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="password.confirm.subheader"
                                defaultMessage="Enter your password one more time"
                            />
                        }
                    />

                    <Input2
                        variant="regular"
                        type={inputType}
                        autoFocus={true}
                        value={form.password}
                        onChange={(e) => {
                            setForm({ password: e.target.value })
                        }}
                        state="normal"
                        sideMessage={null}
                        placeholder="Re-enter password"
                    >
                        {(() => {
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
                    </Input2>

                    <Column2 spacing={16}>
                        <Check
                            result={passwordDidNotMatch(form, password)}
                            text={
                                <FormattedMessage
                                    id="password.confirm.passwordDidNotMatch"
                                    defaultMessage="Passwords must match"
                                />
                            }
                        />
                    </Column2>
                </Column2>

                <Spacer2 />

                <Button
                    type="submit"
                    size="regular"
                    variant="primary"
                    disabled={!!error?.password}
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
