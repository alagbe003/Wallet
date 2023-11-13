import React, { useState } from 'react'
import { failure, Result, success } from '@zeal/toolkit/Result'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Button, IconButton } from 'src/uikit'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { Column2 } from 'src/uikit/Column2'
import { Header } from 'src/uikit/Header'
import { FormattedMessage } from 'react-intl'
import { Spacer2 } from 'src/uikit/Spacer2'
import { ShieldEmpty } from 'src/uikit/Icon/ShieldEmpty'
import { CheckBox } from '@zeal/uikit/CheckBox'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_continue_clicked' }
    | { type: 'on_before_you_begin_back_clicked' }

type Form = {
    pointOneConfirmed: boolean
    pointTwoConfirmed: boolean
    pointThreeConfirmed: boolean
}

type ValidationError = {
    pointTwoConfirmed?: 'previous_points_not_confirmed'
    pointThreeConfirmed?: 'previous_points_not_confirmed'

    submit?: 'not_all_points_confirmed'
}

const validate = (form: Form): Result<ValidationError, void> => {
    if (!form.pointOneConfirmed) {
        return failure({
            pointTwoConfirmed: 'previous_points_not_confirmed',
            pointThreeConfirmed: 'previous_points_not_confirmed',
            submit: 'not_all_points_confirmed',
        })
    }

    if (!form.pointTwoConfirmed) {
        return failure({
            pointThreeConfirmed: 'previous_points_not_confirmed',
            submit: 'not_all_points_confirmed',
        })
    }

    if (!form.pointThreeConfirmed) {
        return failure({
            submit: 'not_all_points_confirmed',
        })
    }
    return success(undefined)
}

export const BeforeYouBegin = ({ onMsg }: Props) => {
    const [form, setForm] = useState<Form>({
        pointOneConfirmed: false,
        pointThreeConfirmed: false,
        pointTwoConfirmed: false,
    })

    const validationError = validate(form).getFailureReason() || {}

    return (
        <Layout2
            padding="form"
            background="light"
            aria-labelledby="before-you-begin-label"
        >
            <ActionBar
                left={
                    <IconButton
                        onClick={() =>
                            onMsg({ type: 'on_before_you_begin_back_clicked' })
                        }
                    >
                        <BackIcon size={24} />
                    </IconButton>
                }
            />
            <Column2 style={{ overflowY: 'auto' }} spacing={24}>
                <Header
                    icon={({ size, color }) => (
                        <ShieldEmpty size={size} color={color} />
                    )}
                    titleId="before-you-begin-label"
                    title={
                        <FormattedMessage
                            id="keystore.write_secret_phrase.before_you_begin.title"
                            defaultMessage="Before you begin"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="keystore.write_secret_phrase.before_you_begin.subtitle"
                            defaultMessage="Please read and accept the following points:"
                        />
                    }
                />
                <Column2 spacing={8}>
                    <CheckBox
                        title={
                            <FormattedMessage
                                id="keystore.write_secret_phrase.before_you_begin.first_point"
                                defaultMessage="I understand that anyone with my Secret Phrase can transfer my assets"
                            />
                        }
                        checked={form.pointOneConfirmed}
                        onClick={() => {
                            setForm({
                                ...form,
                                pointOneConfirmed: true,
                            })
                        }}
                    />
                    <CheckBox
                        title={
                            <FormattedMessage
                                id="keystore.write_secret_phrase.before_you_begin.second_point"
                                defaultMessage="I’m responsible for keeping my Secret Phrase secret and safe"
                            />
                        }
                        disabled={!!validationError.pointTwoConfirmed}
                        checked={form.pointTwoConfirmed}
                        onClick={() => {
                            setForm({
                                ...form,
                                pointTwoConfirmed: true,
                            })
                        }}
                    />
                    <CheckBox
                        title={
                            <FormattedMessage
                                id="keystore.write_secret_phrase.before_you_begin.third_point"
                                defaultMessage="I’m in a private place with no people or cameras around me"
                            />
                        }
                        disabled={!!validationError.pointThreeConfirmed}
                        checked={form.pointThreeConfirmed}
                        onClick={() => {
                            setForm({
                                ...form,
                                pointThreeConfirmed: true,
                            })
                        }}
                    />
                </Column2>
            </Column2>
            <Spacer2 />
            <Button
                disabled={!!validationError.submit}
                variant="primary"
                size="regular"
                onClick={() => {
                    onMsg({ type: 'on_continue_clicked' })
                }}
            >
                <FormattedMessage
                    id="action.continue"
                    defaultMessage="Continue"
                />
            </Button>
        </Layout2>
    )
}
