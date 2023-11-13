import { notReachable } from '@zeal/toolkit'
import { failure, Result, shape, success } from '@zeal/toolkit/Result'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BoldEye } from '@zeal/uikit/Icon/BoldEye'
import { BoldLock } from '@zeal/uikit/Icon/BoldLock'
import { EyeCrossed } from '@zeal/uikit/Icon/EyeCrossed'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { Input } from '@zeal/uikit/Input'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'
import { Row } from '@zeal/uikit/Row'
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Check } from './Check'

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

    const onSubmit = () => {
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
    }
    return (
        <Screen padding="form" background="light">
            <ActionBar
                left={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <BackIcon size={24} />
                    </IconButton>
                }
            />

            <Column spacing={16}>
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

                <Input
                    onSubmitEditing={onSubmit}
                    variant="regular"
                    type={inputType}
                    autoFocus={true}
                    value={form.password}
                    onChange={(e) => {
                        setForm({ password: e })
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
                </Input>

                <Column spacing={16}>
                    <Check
                        result={passwordDidNotMatch(form, password)}
                        text={
                            <FormattedMessage
                                id="password.confirm.passwordDidNotMatch"
                                defaultMessage="Passwords must match"
                            />
                        }
                    />
                </Column>
            </Column>

            <Spacer />

            <Row spacing={0}>
                <Button
                    onClick={onSubmit}
                    size="regular"
                    variant="primary"
                    disabled={!!error?.password}
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
