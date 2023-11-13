import { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { Account } from '@zeal/domains/Account'
import { generateAccountsLabels } from '@zeal/domains/Account/helpers/generateAccountsLabel'
import { PrivateKey } from '@zeal/domains/KeyStore'
import { getKeystoreFromPrivateKey } from '@zeal/domains/KeyStore/helpers/getKeystoreFromPrivateKey'
import { notReachable, useLiveRef } from '@zeal/toolkit'
import { failure, Result, success } from '@zeal/toolkit/Result'
import { Button, IconButton } from 'src/uikit'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Base } from 'src/uikit/Base'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { Column2 } from 'src/uikit/Column2'
import { Header } from 'src/uikit/Header'
import { BoldEye } from 'src/uikit/Icon/BoldEye'
import { BoldEyeClosed } from 'src/uikit/Icon/BoldEyeClosed'
import { Checkbox } from 'src/uikit/Icon/Checkbox'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { InfoCard } from '@zeal/uikit/InfoCard'
import { Input2 } from 'src/uikit/Input/Input2'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Row } from '@zeal/uikit/Row'
import { Spacer2 } from 'src/uikit/Spacer2'
import Web3 from 'web3'

import {
    validateAsYouType,
    validateOnSubmit,
    ValidationError,
} from './validation'
import { Shield } from '@zeal/uikit/Icon/Shield'

type Props = {
    accounts: Account[]
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_secret_phrase_detected'; initialSecretPhrase: string }
    | {
          type: 'on_private_key_submitted'
          account: Account
          keystore: PrivateKey
      }

const NO_BREAK_LIMIT = 11 // Length of longest English secret phrase word + 3

type InputState = 'hidden' | 'revealed'

const parseSecretPhrase = (input: string): Result<unknown, string> => {
    const spaceIndex = Array.from(input).findIndex((char) => char === ' ')

    return spaceIndex !== -1 && spaceIndex < NO_BREAK_LIMIT - 1
        ? success(input)
        : failure('does_not_look_like_secret_phrase')
}

export const Form = ({ sessionPassword, accounts, onMsg }: Props) => {
    const { formatMessage } = useIntl()
    const liveMsg = useLiveRef(onMsg)
    const [privateKey, setPrivateKey] = useState<string>('')

    const [submitted, setSubmitted] = useState<boolean>(false)
    const [inputState, setInputState] = useState<InputState>('hidden')

    const validationError = submitted
        ? validateOnSubmit(privateKey).getFailureReason() || {}
        : validateAsYouType(privateKey).getFailureReason() || {}

    useEffect(() => {
        const secretPhraseResult = parseSecretPhrase(privateKey)
        switch (secretPhraseResult.type) {
            case 'Success':
                liveMsg.current({
                    type: 'on_secret_phrase_detected',
                    initialSecretPhrase: secretPhraseResult.data,
                })
                break

            case 'Failure':
                break

            /* istanbul ignore next */
            default:
                notReachable(secretPhraseResult)
        }
    }, [privateKey, liveMsg])

    return (
        <Layout2 background="light" padding="form">
            <ActionBar
                left={
                    <IconButton
                        onClick={() => onMsg({ type: 'close' })}
                        aria-label={formatMessage({
                            id: 'actions.back',
                            defaultMessage: 'Back',
                        })}
                    >
                        <BackIcon size={24} />
                    </IconButton>
                }
            />

            <Column2 spacing={24}>
                <Header
                    title={
                        <FormattedMessage
                            id="AddFromPrivateKey.title"
                            defaultMessage="Restore wallet"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="AddFromPrivateKey.subtitle"
                            defaultMessage="Enter your Private Key or Secret Phrase separated by spaces"
                        />
                    }
                />

                <form
                    id="pk-form"
                    onSubmit={async (e) => {
                        setSubmitted(true)
                        e.preventDefault()
                        const validation = validateOnSubmit(privateKey)

                        switch (validation.type) {
                            case 'Failure':
                                break

                            case 'Success': {
                                const keystore =
                                    await getKeystoreFromPrivateKey(
                                        validation.data,
                                        sessionPassword
                                    )

                                const address =
                                    new Web3().eth.accounts.privateKeyToAccount(
                                        privateKey
                                    ).address

                                const [label] = generateAccountsLabels(
                                    accounts,
                                    'Private Key',
                                    1
                                )
                                const oldAccount = accounts.find(
                                    (acc) => acc.address === address
                                )

                                onMsg({
                                    type: 'on_private_key_submitted',
                                    account: {
                                        address,
                                        label: oldAccount?.label || label,
                                        avatarSrc:
                                            oldAccount?.avatarSrc || null,
                                    },
                                    keystore,
                                })
                                break
                            }

                            /* istanbul ignore next */
                            default:
                                notReachable(validation)
                        }
                    }}
                >
                    <Input2
                        autoFocus
                        variant="regular"
                        type={inputState === 'hidden' ? 'password' : 'text'}
                        value={privateKey}
                        onChange={(e) => {
                            setPrivateKey(e.target.value)
                        }}
                        state={
                            submitted && validationError.inputMessage
                                ? 'error'
                                : 'normal'
                        }
                        placeholder={formatMessage({
                            id: 'AddFromPrivateKey.typeOrPaste',
                            defaultMessage: 'Type or paste here',
                        })}
                        message={
                            validationError.inputMessage && (
                                <ErrorMessage
                                    error={validationError.inputMessage}
                                />
                            )
                        }
                        sideMessage={
                            <InputStateButton
                                state={inputState}
                                onClick={() => {
                                    switch (inputState) {
                                        case 'hidden':
                                            setInputState('revealed')
                                            break

                                        case 'revealed':
                                            setInputState('hidden')
                                            break

                                        /* istanbul ignore next */
                                        default:
                                            notReachable(inputState)
                                    }
                                }}
                            />
                        }
                        rightIcon={
                            !validationError.inputIcon ? (
                                <Base>
                                    <Checkbox size={24} color="iconAccent2" />
                                </Base>
                            ) : null
                        }
                    />
                </form>
            </Column2>

            <Spacer2 />

            <Column2 spacing={16}>
                <InfoCard
                    variant="security"
                    icon={({ size }) => <Shield size={size} />}
                    subtitle={
                        <FormattedMessage
                            id="RestoreAccount.secretPhraseAndPKNeverLeaveThisDevice"
                            defaultMessage="Secret Phrases and private keys are encrypted and never leave this device"
                        />
                    }
                />

                <Button
                    variant="primary"
                    size="regular"
                    type="submit"
                    form="pk-form"
                    disabled={!!validationError.submitButton}
                >
                    <FormattedMessage
                        id="actions.continue"
                        defaultMessage="Continue"
                    />
                </Button>
            </Column2>
        </Layout2>
    )
}

export const ErrorMessage = ({
    error,
}: {
    error: NonNullable<ValidationError['inputMessage']>
}) => {
    switch (error.type) {
        case 'not_valid_private_key':
            return (
                <FormattedMessage
                    id="PrivateKeyValidationError.not_valid_private_key"
                    defaultMessage="This is not a valid private key"
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(error.type)
    }
}

const InputStateButton = ({
    state,
    onClick,
}: {
    state: InputState
    onClick: () => void
}) => (
    <Tertiary color="on_light" size="small" onClick={onClick}>
        <Row spacing={4}>
            {(() => {
                switch (state) {
                    case 'hidden':
                        return (
                            <>
                                <BoldEye size={14} color="iconDefault" />
                                <FormattedMessage
                                    id="actions.reveal"
                                    defaultMessage="Reveal"
                                />
                            </>
                        )

                    case 'revealed':
                        return (
                            <>
                                <BoldEyeClosed size={14} color="iconDefault" />
                                <FormattedMessage
                                    id="actions.hide"
                                    defaultMessage="Hide"
                                />
                            </>
                        )

                    /* istanbul ignore next */
                    default:
                        return notReachable(state)
                }
            })()}
        </Row>
    </Tertiary>
)
