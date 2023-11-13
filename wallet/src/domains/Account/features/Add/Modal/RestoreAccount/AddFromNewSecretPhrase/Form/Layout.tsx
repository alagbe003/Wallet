import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { noop, notReachable } from '@zeal/toolkit'
import { Button, IconButton } from 'src/uikit'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { BoldEye } from 'src/uikit/Icon/BoldEye'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Row } from '@zeal/uikit/Row'

import {
    MAX_WORD_COUNT,
    validateAsYouType,
    validateSubmit,
    ValidationError,
} from './validation'
import { Column2 } from 'src/uikit/Column2'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { Header } from 'src/uikit/Header'
import { Spacer2 } from 'src/uikit/Spacer2'
import { BoldEyeClosed } from 'src/uikit/Icon/BoldEyeClosed'
import {
    getDescendantsFromString,
    getPhraseString,
    SecretPhraseInput,
} from 'src/uikit/SecretPhraseInput'
import { Descendant } from 'slate'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { Text2 } from 'src/uikit/Text2'
import { encryptSecretPhrase } from '@zeal/domains/KeyStore/helpers/encryptSecretPhrase'
import { InfoCard } from '@zeal/uikit/InfoCard'
import { Shield } from '@zeal/uikit/Icon/Shield'

type Props = {
    initialSecretPhrase: string
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_user_cleared_secret_phrase' }
    | {
          type: 'on_encrypted_secret_phrase_submitted'
          encryptedPhrase: string
      }

type InputState = 'hidden' | 'revealed'

const getErroredWordsIndexes = (
    error: ValidationError['inputMessage']
): number[] | null => {
    if (!error) {
        return null
    }

    switch (error.type) {
        case 'word_misspelled_or_invalid':
            return error.wordsIndexes

        case 'more_than_maximum_words':
        case 'secret_phrase_is_invalid':
            return null

        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}

export const Layout = ({
    initialSecretPhrase,
    sessionPassword,
    onMsg,
}: Props) => {
    const [inputState, setInputState] = useState<InputState>('hidden')
    const [submitted, setSubmitted] = useState<boolean>(false)

    const [secretPhraseInput, setSecretPhraseInput] = useState<Descendant[]>(
        getDescendantsFromString(initialSecretPhrase)
    )

    const secretPhrase = getPhraseString(secretPhraseInput)

    const validationError = submitted
        ? validateSubmit(secretPhrase).getFailureReason() || {}
        : validateAsYouType(secretPhrase).getFailureReason() || {}

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
                    id="secret-phrase-form"
                    onSubmit={async (e) => {
                        e.preventDefault()
                        setSubmitted(true)

                        const validation = validateSubmit(secretPhrase)

                        switch (validation.type) {
                            case 'Failure':
                                break

                            case 'Success': {
                                const encryptedPhrase =
                                    await encryptSecretPhrase({
                                        sessionPassword,
                                        mnemonic: validation.data,
                                    })

                                onMsg({
                                    type: 'on_encrypted_secret_phrase_submitted',
                                    encryptedPhrase,
                                })
                                break
                            }

                            default:
                                notReachable(validation)
                        }
                    }}
                >
                    <Column2 spacing={8}>
                        <SecretPhraseInput
                            autoFocus
                            hidden={inputState === 'hidden'}
                            errorWordsIndexes={getErroredWordsIndexes(
                                validationError.inputMessage
                            )}
                            onChange={(value) => {
                                if (getPhraseString(value) === '') {
                                    onMsg({
                                        type: 'on_user_cleared_secret_phrase',
                                    })
                                }
                                setSecretPhraseInput(value)
                            }}
                            value={secretPhraseInput}
                            onError={(e) => captureError(e)}
                        />
                        <Row spacing={8}>
                            {validationError.inputMessage ? (
                                <Text2
                                    ellipsis
                                    color="textError"
                                    variant="caption1"
                                    weight="regular"
                                >
                                    <ErrorMessage
                                        error={validationError.inputMessage}
                                    />
                                </Text2>
                            ) : (
                                <Text2
                                    ellipsis
                                    color="textSecondary"
                                    variant="caption1"
                                    weight="regular"
                                >
                                    <WordsCounter phrase={secretPhrase} />
                                </Text2>
                            )}

                            <Spacer2 />

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

                                        default:
                                            notReachable(inputState)
                                    }
                                }}
                            />
                        </Row>
                    </Column2>
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
                    type="submit"
                    variant="primary"
                    size="regular"
                    disabled={!!validationError.submitEnabled}
                    form="secret-phrase-form"
                    onClick={noop}
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

                    default:
                        return notReachable(state)
                }
            })()}
        </Row>
    </Tertiary>
)

const WordsCounter = ({ phrase }: { phrase: string }) => {
    const count = phrase.trim().split(' ').length

    if (!count) {
        return null
    }

    return (
        <FormattedMessage
            id="PrivateKeyValidationError.wordsCount"
            defaultMessage="{count, plural,
                =0 {}
                one {{count} word}
                other {{count} words}
              }"
            values={{ count }}
        />
    )
}

const ErrorMessage = ({
    error,
}: {
    error: NonNullable<ValidationError['inputMessage']>
}) => {
    switch (error.type) {
        case 'word_misspelled_or_invalid':
            return (
                <FormattedMessage
                    id="PrivateKeyValidationError.word_misspelled_or_invalid"
                    defaultMessage="Word #{index} misspelled or invalid"
                    values={{ index: error.wordsIndexes[0] + 1 }}
                />
            )

        case 'more_than_maximum_words':
            return (
                <FormattedMessage
                    id="PrivateKeyValidationError.more_than_maximum_words"
                    defaultMessage="Max {count} words"
                    values={{ count: MAX_WORD_COUNT }}
                />
            )

        case 'secret_phrase_is_invalid':
            return (
                <FormattedMessage
                    id="PrivateKeyValidationError.secret_phrase_is_invalid"
                    defaultMessage="Secret phrase is not valid"
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}
