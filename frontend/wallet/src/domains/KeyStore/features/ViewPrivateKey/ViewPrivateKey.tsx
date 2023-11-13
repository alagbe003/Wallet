import { FormattedMessage } from 'react-intl'
import { AppErrorListItem } from 'src/domains/Error/components/AppErrorListItem'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { PrivateKey, SecretPhrase } from '@zeal/domains/KeyStore'
import { getPrivateKey } from '@zeal/domains/KeyStore/helpers/getPrivateKey'
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
import { Skeleton } from 'src/uikit/Skeleton'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Tag } from '@zeal/uikit/Tag'
import { Text } from '@zeal/uikit/Text'
import { TextArea } from 'src/uikit/TextArea'

import { CopyKeyButton } from './CopyKeyButton'
import { InfoCard } from '@zeal/uikit/InfoCard'
import { Shield } from '@zeal/uikit/Icon/Shield'

type Props = {
    sessionPassword: string
    keyStore: PrivateKey | SecretPhrase
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const ViewPrivateKey = ({ keyStore, sessionPassword, onMsg }: Props) => {
    const [loadable, setLoadable] = useLoadableData(getPrivateKey, {
        type: 'loading',
        params: { sessionPassword, keyStore },
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
                            id="ViewPrivateKey.header"
                            defaultMessage="Private Key"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="ViewPrivateKey.subheader"
                            defaultMessage="Hover to reveal your Private Key"
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

                        case 'loaded': {
                            const pk = loadable.data.pk.replace(/^0x/gim, '')
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
                                                        id="ViewPrivateKey.unblur"
                                                        defaultMessage="Hover to reveal"
                                                    />
                                                </Text>
                                            </Tag>
                                        }
                                    >
                                        <TextArea
                                            placeholder=""
                                            type="text"
                                            autoHeight
                                            value={pk}
                                            readOnly
                                            state="normal"
                                            onChange={noop}
                                        />
                                    </BlurCurtain>

                                    <CopyKeyButton pk={pk} />
                                </>
                            )
                        }

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
                            id="ViewPrivateKey.hint"
                            defaultMessage="Don’t share your private key with anyone. Keep it safe and offline"
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
