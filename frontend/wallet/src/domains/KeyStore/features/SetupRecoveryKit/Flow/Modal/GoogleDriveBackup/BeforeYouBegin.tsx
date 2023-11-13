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

type Msg = { type: 'on_continue_clicked' } | { type: 'close' }

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
        <Layout2 padding="form" background="light">
            <ActionBar
                left={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <BackIcon size={24} />
                    </IconButton>
                }
            />
            <Column2 style={{ overflowY: 'auto' }} spacing={24}>
                <Header
                    icon={({ size, color }) => (
                        <ShieldEmpty size={size} color={color} />
                    )}
                    title={
                        <FormattedMessage
                            id="GoogleDriveBackup.BeforeYouBegin.title"
                            defaultMessage="Before you begin"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="GoogleDriveBackup.BeforeYouBegin.subtitle"
                            defaultMessage="Please understand and accept the following point on self-custody:"
                        />
                    }
                />
                <Column2 spacing={8}>
                    <CheckBox
                        title={
                            <FormattedMessage
                                id="GoogleDriveBackup.BeforeYouBegin.first_point"
                                defaultMessage="If I forget my Zeal password, I’ll lose my assets forever"
                            />
                        }
                        checked={form.pointOneConfirmed}
                        onClick={() =>
                            setForm({ ...form, pointOneConfirmed: true })
                        }
                    />
                    <CheckBox
                        title={
                            <FormattedMessage
                                id="GoogleDriveBackup.BeforeYouBegin.second_point"
                                defaultMessage="If I lose access to my Google Drive or modify my Recovery File, I’ll lose my assets forever"
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
                                id="GoogleDriveBackup.BeforeYouBegin.third_point"
                                defaultMessage="Zeal can’t help me recover my Zeal password or my access to Google Drive"
                            />
                        }
                        disabled={!!validationError.pointThreeConfirmed}
                        checked={form.pointThreeConfirmed}
                        onClick={() =>
                            setForm({ ...form, pointThreeConfirmed: true })
                        }
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
