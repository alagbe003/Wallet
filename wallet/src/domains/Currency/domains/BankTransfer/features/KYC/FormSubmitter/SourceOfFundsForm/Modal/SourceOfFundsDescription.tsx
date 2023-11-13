import { nonEmptyString, Result, shape } from '@zeal/toolkit/Result'
import { useState } from 'react'
import { SourceOfFundsOther } from '@zeal/domains/Currency/domains/BankTransfer/api/submitUnblockKycApplication'
import { Popup } from 'src/uikit/Popup'
import { FormattedMessage, useIntl } from 'react-intl'
import { Header } from 'src/uikit/Header'
import { TextArea } from 'src/uikit/TextArea'
import { Button } from 'src/uikit'
import { notReachable } from '@zeal/toolkit'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_source_of_funds_selected'; source: SourceOfFundsOther }
    | { type: 'close' }

type InitialForm = {
    description: string | null
}

type FormErrors = {
    submit?: { type: 'required' }
}

const validateOnSubmit = (
    form: InitialForm
): Result<FormErrors, SourceOfFundsOther> => {
    return shape({
        submit: nonEmptyString(form.description).mapError(() => ({
            type: 'required' as const,
        })),
    }).map(({ submit }) => ({ type: 'other', description: submit }))
}

export const SourceOfFundsDescription = ({ onMsg }: Props) => {
    const [form, setForm] = useState<InitialForm>({ description: null })
    const errors = validateOnSubmit(form).getFailureReason() || {}
    const { formatMessage } = useIntl()
    return (
        <form
            id="submit-source-form"
            onSubmit={(e) => {
                const result = validateOnSubmit(form)
                switch (result.type) {
                    case 'Failure':
                        break
                    case 'Success':
                        onMsg({
                            type: 'on_source_of_funds_selected',
                            source: result.data,
                        })
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(result)
                }
            }}
        >
            <Popup.Layout onMsg={onMsg}>
                <Header
                    title={
                        <FormattedMessage
                            id="bank_transfers.source_of_funds_description.title"
                            defaultMessage="Tell us more about your source of funds"
                        />
                    }
                />
                <Popup.Content>
                    <TextArea
                        value={form.description ?? ''}
                        state="normal"
                        autoHeight
                        placeholder={formatMessage({
                            id: 'bank_transfers.source_of_funds_description.placeholder',
                            defaultMessage: 'Describe source of funds...',
                        })}
                        type="text"
                        onChange={(value) => {
                            setForm({ description: value })
                        }}
                    />
                </Popup.Content>
                <Popup.Actions>
                    <Button
                        type="submit"
                        variant="primary"
                        size="regular"
                        disabled={!!errors.submit}
                        form="submit-source-form"
                    >
                        <FormattedMessage
                            id="actions.continue"
                            defaultMessage="Continue"
                        />
                    </Button>
                </Popup.Actions>
            </Popup.Layout>
        </form>
    )
}
