import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { notReachable } from '@zeal/toolkit'
import {
    EmptyStringError,
    nonEmptyString,
    parseHttpOrHttpsUrl,
    Result,
    shape,
    ValueIsNotHttpOrHttpsURL,
} from '@zeal/toolkit/Result'
import { Button, IconButton } from 'src/uikit'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column2 } from 'src/uikit/Column2'
import { Header } from 'src/uikit/Header'
import { BoldNetwork } from 'src/uikit/Icon/BoldNetwork'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { Input2 } from 'src/uikit/Input/Input2'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Row } from '@zeal/uikit/Row'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Text2 } from 'src/uikit/Text2'

export type Props = {
    form: NetworkForm
    onMsg: (msg: Msg) => void
}

export type NetworkForm = {
    rpcUrl: string
}

type FormError = {
    rpcUrl?: RPCError
    submit?: RPCError
}

type RPCError = EmptyStringError | ValueIsNotHttpOrHttpsURL

const validateRPCUrl = (input?: string): Result<RPCError, string> =>
    nonEmptyString(input).andThen(parseHttpOrHttpsUrl)

const validateOnSubmit = (form: NetworkForm): Result<FormError, string> =>
    shape({
        rpcUrl: validateRPCUrl(form.rpcUrl),
        submit: validateRPCUrl(form.rpcUrl),
    }).map((result) => result.rpcUrl)

export type Msg =
    | { type: 'close' }
    | { type: 'on_form_change'; form: NetworkForm }
    | { type: 'on_form_submit'; rpcUrl: string }

export const Form = ({ form, onMsg }: Props) => {
    const [submited, setSubmited] = useState<boolean>(false)
    const errors = submited
        ? validateOnSubmit(form).getFailureReason() || {}
        : {}

    return (
        <Layout2 padding="form" background="light">
            <ActionBar
                left={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <BackIcon size={24} />
                    </IconButton>
                }
            />

            <Column2 spacing={24}>
                <Header
                    title={
                        <FormattedMessage
                            id="editNetworkRpc.headerTitle"
                            defaultMessage="Custom RPC Node"
                        />
                    }
                    icon={({ color, size }) => (
                        <BoldNetwork size={size} color={color} />
                    )}
                />

                <form
                    id="edit-rpc-form"
                    onSubmit={async (e) => {
                        e.preventDefault()
                        setSubmited(true)

                        const validation = validateOnSubmit(form)

                        switch (validation.type) {
                            case 'Failure':
                                break

                            case 'Success': {
                                onMsg({
                                    type: 'on_form_submit',
                                    rpcUrl: validation.data,
                                })
                                break
                            }

                            default:
                                notReachable(validation)
                        }
                    }}
                >
                    <Column2 spacing={8}>
                        <Column2 spacing={8}>
                            <Text2
                                variant="paragraph"
                                weight="regular"
                                color="textSecondary"
                            >
                                <FormattedMessage
                                    id="editNetworkRpc.rpcNodeUrl"
                                    defaultMessage="RPC Node URL"
                                />
                            </Text2>

                            <Input2
                                onChange={(event) =>
                                    onMsg({
                                        type: 'on_form_change',
                                        form: {
                                            rpcUrl: event.target.value,
                                        },
                                    })
                                }
                                spellCheck={false}
                                state={errors?.rpcUrl ? 'error' : 'normal'}
                                placeholder="https://..."
                                variant="regular"
                                value={form.rpcUrl}
                                message={(() => {
                                    if (!errors?.rpcUrl) {
                                        return null
                                    }
                                    switch (errors.rpcUrl.type) {
                                        case 'string_is_empty':
                                        case 'value_is_not_a_string':
                                            return (
                                                <FormattedMessage
                                                    id="editNework.rpc_url.cannot_be_empty"
                                                    defaultMessage="Required"
                                                />
                                            )
                                        case 'value_is_not_http_or_https_url':
                                            return (
                                                <FormattedMessage
                                                    id="editNework.rpc_url.not_a_valid_https_url"
                                                    defaultMessage="Must be a valid HTTP(S) URL"
                                                />
                                            )
                                        default:
                                            return notReachable(errors.rpcUrl)
                                    }
                                })()}
                            />
                        </Column2>
                    </Column2>
                </form>
            </Column2>
            <Spacer2 />

            <Row spacing={8}>
                <Button
                    type="submit"
                    variant="secondary"
                    size="regular"
                    onClick={(ev) => {
                        ev.preventDefault()
                        onMsg({ type: 'close' })
                    }}
                >
                    <FormattedMessage
                        id="actions.cancel"
                        defaultMessage="Cancel"
                    />
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                    size="regular"
                    disabled={!!errors?.submit}
                    form="edit-rpc-form"
                >
                    <FormattedMessage
                        id="actions.save_changes"
                        defaultMessage="Save RPC"
                    />
                </Button>
            </Row>
        </Layout2>
    )
}
