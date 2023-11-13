import React, { useState } from 'react'
import { Address } from '@zeal/domains/Address'
import { Button, IconButton } from 'src/uikit'
import { MinStringLengthError, Result, shape } from '@zeal/toolkit/Result'
import { notReachable } from '@zeal/toolkit'
import { FormattedMessage, useIntl } from 'react-intl'
import {
    includeLowerAndUppercase,
    includesNumberOrSpecialChar,
    ShouldContainLowerAndUpperCase,
    ShouldContainNumberOrSpecialChar,
    shouldContainsMinChars,
} from 'src/domains/Password'
import { Check } from './Check'
import { BoldEye } from 'src/uikit/Icon/BoldEye'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column2 } from 'src/uikit/Column2'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Header } from 'src/uikit/Header'
import { Input2 } from 'src/uikit/Input/Input2'
import { BoldLock } from 'src/uikit/Icon/BoldLock'
import { OutlineStatusEyeClosed } from 'src/uikit/Icon/OutlineStatusEyeClosed'
import { InfoCard } from '@zeal/uikit/InfoCard'
import { InfoCircle } from '@zeal/uikit/Icon/InfoCircle'

type Props = {
    initialPassword: string
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'password_added'; password: string }

type Form = {
    password: string
}

type FormError = {
    password?:
        | MinStringLengthError
        | ShouldContainNumberOrSpecialChar
        | ShouldContainLowerAndUpperCase
    minLength?: MinStringLengthError
    numsAndSpecialChars?: ShouldContainNumberOrSpecialChar
    upperAndLowCase?: ShouldContainLowerAndUpperCase
}

const validateOnSubmit = (
    form: Form
): Result<FormError, { password: Address }> => {
    return shape({
        password: shouldContainsMinChars(form.password)
            .andThen(includeLowerAndUppercase)
            .andThen(includesNumberOrSpecialChar),
        minLength: shouldContainsMinChars(form.password),
        numsAndSpecialChars: includesNumberOrSpecialChar(form.password),
        upperAndLowCase: includeLowerAndUppercase(form.password),
    })
}

export const AddForm = ({ initialPassword, onMsg }: Props) => {
    const { formatMessage } = useIntl()
    const [form, setForm] = useState<Form>({ password: initialPassword })
    const [inputType, setInputType] = useState<'text' | 'password'>('password')

    const error = validateOnSubmit(form).getFailureReason()

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
                            type: 'password_added',
                            password: result.data.password,
                        })
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(result)
                }
            }}
        >
            <Layout2 padding="form" background="light">
                <ActionBar />

                <Column2 spacing={16}>
                    <Header
                        icon={({ size, color }) => (
                            <BoldLock size={size} color={color} />
                        )}
                        title={
                            <FormattedMessage
                                id="password.add.header"
                                defaultMessage="Create password"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="password.add.subheader"
                                defaultMessage="You’ll use your password to unlock Zeal"
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
                        placeholder={formatMessage({
                            id: 'password.add.inputPlaceholder',
                            defaultMessage: 'Create password',
                        })}
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
                                            <OutlineStatusEyeClosed
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

                    <Column2 spacing={16}>
                        <Check
                            result={includeLowerAndUppercase(form.password)}
                            text={
                                <FormattedMessage
                                    id="password.add.includeLowerAndUppercase"
                                    defaultMessage="Lower and upper case letters"
                                />
                            }
                        />
                        <Check
                            result={includesNumberOrSpecialChar(form.password)}
                            text={
                                <FormattedMessage
                                    id="password.add.includesNumberOrSpecialChar"
                                    defaultMessage="One number or symbol"
                                />
                            }
                        />
                        <Check
                            result={shouldContainsMinChars(form.password)}
                            text={
                                <FormattedMessage
                                    id="password.add.shouldContainsMinCharsCheck"
                                    defaultMessage="10+ characters"
                                />
                            }
                        />
                    </Column2>
                </Column2>

                <Spacer2 />

                <Column2 spacing={24}>
                    <InfoCard
                        variant="neutral"
                        icon={({ size }) => <InfoCircle size={size} />}
                        title={
                            <FormattedMessage
                                id="password.add.info.title"
                                defaultMessage="Your password stays in this device"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="password.add.info.subtitle"
                                defaultMessage="We don’t send your password to our servers or back it up for you"
                            />
                        }
                    />

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
                </Column2>
            </Layout2>
        </form>
    )
}
