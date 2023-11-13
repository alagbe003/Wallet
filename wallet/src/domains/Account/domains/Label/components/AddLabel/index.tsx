import { useState } from 'react'
import { Button } from '@zeal/uikit/Button'
import { IconButton } from '@zeal/uikit/IconButton'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { FormattedMessage } from 'react-intl'
import { notReachable } from '@zeal/toolkit'
import { Account } from '@zeal/domains/Account'
import { Label } from 'src/domains/Account/domains/Label'
import { validateAsYouType, validateOnSubmit } from '../../helpers/validator'
import { LabelErrorMessage } from '../LabelErrorMessage'
import { MAX_LENGTH } from 'src/domains/Account/domains/Label/constants'
import { Screen } from '@zeal/uikit/Screen'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Header } from '@zeal/uikit/Header'
import { Column } from '@zeal/uikit/Column'
import { Input } from '@zeal/uikit/Input'
import { Actions } from '@zeal/uikit/Actions'

type Props = {
    initialLabel: string
    onBackClick: () => void
    onAddLabelSubmitted: (label: string) => void
    accounts: Account[]
}

type Form = {
    label: Label
}

export const AddLabel = ({
    accounts,
    initialLabel,
    onBackClick,
    onAddLabelSubmitted,
}: Props) => {
    const [form, setForm] = useState<Form>({ label: initialLabel })
    const [isSubmitted, setIsSubmitted] = useState<boolean>()

    const error = isSubmitted
        ? validateOnSubmit(form, accounts).getFailureReason()
        : validateAsYouType(form).getFailureReason()

    const onSubmit = () => {
        setIsSubmitted(true)
        const result = validateOnSubmit(form, accounts)
        switch (result.type) {
            case 'Failure':
                break
            case 'Success':
                onAddLabelSubmitted(form.label)
                break
            /* istanbul ignore next */
            default:
                return notReachable(result)
        }
    }

    return (
        <Screen background="light" padding="form">
            <ActionBar
                left={
                    <IconButton onClick={onBackClick}>
                        <BackIcon size={24} />
                    </IconButton>
                }
            />

            <Column spacing={16} shrink fill>
                <Header
                    title={
                        <FormattedMessage
                            id="account.addLabel.header"
                            defaultMessage="Label this wallet"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="account.addLabel.subheader"
                            defaultMessage="Make it easy to tell it apart from others.{br}You can always change it later"
                            values={{ br: '\n' }}
                        />
                    }
                />

                <Input
                    onSubmitEditing={onSubmit}
                    variant="large"
                    autoFocus
                    value={form.label}
                    onChange={(e) => {
                        setForm({
                            label: e.substring(0, MAX_LENGTH),
                        })
                    }}
                    state={!!error?.label ? 'error' : 'normal'}
                    message={<LabelErrorMessage error={error?.label} />}
                    sideMessage={`${form.label.length}/${MAX_LENGTH}`}
                    placeholder="ex. DeFi Main"
                />
            </Column>

            <Actions>
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
            </Actions>
        </Screen>
    )
}
