import { FormattedMessage } from 'react-intl'
import { AppErrorListItem } from 'src/domains/Error/components/AppErrorListItem'
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
import {
    getDescendantsFromString,
    SecretPhraseInput,
} from 'src/uikit/SecretPhraseInput'
import { Skeleton } from 'src/uikit/Skeleton'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Tag } from '@zeal/uikit/Tag'
import { Text } from '@zeal/uikit/Text'
import { InfoCard } from '@zeal/uikit/InfoCard'
import { Shield } from '@zeal/uikit/Icon/Shield'

type Props = {
    sessionPassword: string
    keyStore: SecretPhrase
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const ViewSecretPhrase = ({
    keyStore,
    sessionPassword,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(decryptSecretPhrase, {
        type: 'loading',
        params: { sessionPassword, encryptedPhrase: keyStore.encryptedPhrase },
    })

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
                            id="ViewSecretPhrase.header"
                            defaultMessage="Secret Phrase"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="ViewSecretPhrase.subheader"
                            defaultMessage="Hover to reveal your Secret Phrase"
                        />
                    }
                />

                {(() => {
                    switch (loadable.type) {
                        case 'loading':
                            return (
                                <Skeleton
                                    variant="default"
                                    height={108}
                                    width="100%"
                                />
                            )

                        case 'loaded':
                            return (
                                <>
                                    <BlurCurtain
                                        unblurElement={
                                            <Tag bg="surfaceDefault">
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
                                            </Tag>
                                        }
                                    >
                                        <SecretPhraseInput
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
                                <AppErrorListItem
                                    error={parseAppError(loadable.error)}
                                    onMsg={(msg) => {
                                        switch (msg.type) {
                                            case 'try_again_clicked':
                                                setLoadable({
                                                    type: 'loading',
                                                    params: loadable.params,
                                                })
                                                break

                                            default:
                                                notReachable(msg.type)
                                        }
                                    }}
                                />
                            )

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
                            id="ViewSecretPhrase.hint"
                            defaultMessage="Don’t share your phrase with anyone. Keep it safe and offline"
                        />
                    }
                />

                <Button
                    size="regular"
                    variant="primary"
                    onClick={() => onMsg({ type: 'close' })}
                >
                    <FormattedMessage
                        id="ViewSecretPhrase.done"
                        defaultMessage="Done"
                    />
                </Button>
            </Column2>
        </Layout2>
    )
}
