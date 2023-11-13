import { FormattedMessage } from 'react-intl'
import { AppErrorPopup } from 'src/domains/Error/components/AppErrorPopup'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { SecretPhrase } from '@zeal/domains/KeyStore'
import { CopyPhraseButton } from 'src/domains/KeyStore/components/CopyPhraseButton'
import { decryptSecretPhrase } from '@zeal/domains/KeyStore/helpers/decryptSecretPhrase'
import { noop, notReachable } from '@zeal/toolkit'
import { BlurCurtain } from '@zeal/uikit/BlurCurtain'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { Button, IconButton } from 'src/uikit'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column2 } from 'src/uikit/Column2'
import { Header } from 'src/uikit/Header'
import { BoldEye } from 'src/uikit/Icon/BoldEye'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Row } from '@zeal/uikit/Row'
import {
    getDescendantsFromString,
    SecretPhraseInput,
} from 'src/uikit/SecretPhraseInput'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Tag } from '@zeal/uikit/Tag'
import { Text } from '@zeal/uikit/Text'
import { InfoCard } from '@zeal/uikit/InfoCard'
import { Shield } from '@zeal/uikit/Icon/Shield'

type Props = {
    keystore: SecretPhrase
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_skip_verification_confirmation_click' }
    | { type: 'on_continue_to_verificaiton_click'; decryptedPhrase: string }
    | { type: 'on_secret_phrase_reveal_back_clicked' }

export const Layout = ({ keystore, sessionPassword, onMsg }: Props) => {
    const [loadable] = useLoadableData(decryptSecretPhrase, {
        type: 'loading',
        params: { sessionPassword, encryptedPhrase: keystore.encryptedPhrase },
    })

    return (
        <Layout2 padding="form" background="light">
            <ActionBar
                left={
                    <IconButton
                        onClick={() =>
                            onMsg({
                                type: 'on_secret_phrase_reveal_back_clicked',
                            })
                        }
                    >
                        <BackIcon size={24} />
                    </IconButton>
                }
            />

            <Column2 spacing={24}>
                <Header
                    title={
                        <FormattedMessage
                            id="SecretPhraseReveal.header"
                            defaultMessage="Write down Secret Phrase"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="SecretPhraseReveal.subheader"
                            defaultMessage="Please write it down and keep it safely offline. We’ll then ask you to verify it."
                        />
                    }
                />

                {(() => {
                    switch (loadable.type) {
                        case 'loading':
                            return null

                        case 'loaded':
                            return (
                                <>
                                    <BlurCurtain
                                        unblurElement={
                                            <Tag bg="surfaceDefault">
                                                <Row spacing={4}>
                                                    <BoldEye
                                                        size={16}
                                                        color="iconDefault"
                                                    />
                                                    <Text
                                                        variant="caption1"
                                                        color="textPrimary"
                                                        weight="regular"
                                                    >
                                                        <FormattedMessage
                                                            id="ViewSecretPhrase.unblur"
                                                            defaultMessage="Hover to reveal"
                                                        />
                                                    </Text>
                                                </Row>
                                            </Tag>
                                        }
                                    >
                                        <SecretPhraseInput
                                            data-testid="write-down-phrase-input"
                                            errorWordsIndexes={[]}
                                            hidden={false}
                                            autoFocus={false}
                                            readOnly
                                            onChange={noop}
                                            onError={captureError}
                                            value={getDescendantsFromString(
                                                loadable.data
                                            )}
                                        />
                                    </BlurCurtain>

                                    <CopyPhraseButton
                                        decryptedPhrase={loadable.data}
                                    />
                                </>
                            )

                        case 'error':
                            return (
                                <AppErrorPopup
                                    error={parseAppError(loadable.error)}
                                    onMsg={(msg) => {
                                        switch (msg.type) {
                                            case 'close':
                                            case 'try_again_clicked':
                                                onMsg({
                                                    type: 'on_secret_phrase_reveal_back_clicked',
                                                })
                                                break

                                            /* istanbul ignore next */
                                            default:
                                                return notReachable(msg)
                                        }
                                    }}
                                />
                            )

                        /* istanbul ignore next */
                        default:
                            return notReachable(loadable)
                    }
                })()}
            </Column2>

            <Spacer2 />

            <Column2 spacing={16}>
                <InfoCard
                    variant="security"
                    icon={({ size }) => <Shield size={size} />}
                    subtitle={
                        <FormattedMessage
                            id="SecretPhraseReveal.hint"
                            defaultMessage="Don’t share your phrase with anyone. Keep it safe and offline"
                        />
                    }
                />

                {(() => {
                    switch (loadable.type) {
                        case 'loading':
                        case 'error':
                            return (
                                <Row spacing={8}>
                                    <Button
                                        size="regular"
                                        variant="secondary"
                                        onClick={() =>
                                            onMsg({
                                                type: 'on_skip_verification_confirmation_click',
                                            })
                                        }
                                    >
                                        <FormattedMessage
                                            id="SecretPhraseReveal.skipForNow"
                                            defaultMessage="Skip for now"
                                        />
                                    </Button>
                                    <Button
                                        size="regular"
                                        variant="primary"
                                        disabled
                                    >
                                        <FormattedMessage
                                            id="SecretPhraseReveal.verify"
                                            defaultMessage="Verify"
                                        />
                                    </Button>
                                </Row>
                            )

                        case 'loaded':
                            return (
                                <Row spacing={8}>
                                    <Button
                                        size="regular"
                                        variant="secondary"
                                        onClick={() =>
                                            onMsg({
                                                type: 'on_skip_verification_confirmation_click',
                                            })
                                        }
                                    >
                                        <FormattedMessage
                                            id="SecretPhraseReveal.skipForNow"
                                            defaultMessage="Skip for now"
                                        />
                                    </Button>
                                    <Button
                                        size="regular"
                                        variant="primary"
                                        onClick={() =>
                                            onMsg({
                                                type: 'on_continue_to_verificaiton_click',
                                                decryptedPhrase: loadable.data,
                                            })
                                        }
                                    >
                                        <FormattedMessage
                                            id="SecretPhraseReveal.verify"
                                            defaultMessage="Verify"
                                        />
                                    </Button>
                                </Row>
                            )

                        /* istanbul ignore next */
                        default:
                            return notReachable(loadable)
                    }
                })()}
            </Column2>
        </Layout2>
    )
}
