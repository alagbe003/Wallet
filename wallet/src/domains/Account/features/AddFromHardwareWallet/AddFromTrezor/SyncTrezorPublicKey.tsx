import TrezorConnect from '@trezor/connect-web'
import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { AppErrorPopup } from 'src/domains/Error/components/AppErrorPopup'
import { ErrorPopup as TrezorErrorPopup } from 'src/domains/Error/domains/Trezor/components/ErrorPopup'
import { parseTrezorConnectionAlreadyInitialized } from '@zeal/domains/Error/domains/Trezor/parsers/parseTrezorError'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import {
    TERZOR_INIT_CONFIG,
    TREZOR_EXTENDED_PUBLIC_KEY_PATH,
} from '@zeal/domains/KeyStore/constants'
import { noop, notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { IconButton } from '@zeal/uikit/IconButton'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { Group, Section } from '@zeal/uikit/Group'
import { GroupHeader } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { Screen } from '@zeal/uikit/Screen'
import { ListItemSkeleton } from '@zeal/uikit/ListItem'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | {
          type: 'on_trezor_extended_public_key_synced'
          extendedPublicKey: string
      }

const fetch = async (): Promise<string> => {
    try {
        await TrezorConnect.init(TERZOR_INIT_CONFIG)
    } catch (e) {
        const alreadyInitError = parseTrezorConnectionAlreadyInitialized(e)

        if (!alreadyInitError) {
            throw e
        }
    }

    return TrezorConnect.getPublicKey({
        coin: 'ETH',
        path: TREZOR_EXTENDED_PUBLIC_KEY_PATH,
    }).then((response) => {
        if (response.success) {
            return response.payload.xpub
        } else {
            throw response.payload
        }
    })
}

export const SyncTrezorPublicKey = ({ onMsg }: Props) => {
    const onMsgLive = useLiveRef(onMsg)
    const [loadable, setLoadable] = useLoadableData(fetch, {
        type: 'loading',
        params: undefined,
    })

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
            case 'error':
                break
            case 'loaded':
                onMsgLive.current({
                    type: 'on_trezor_extended_public_key_synced',
                    extendedPublicKey: loadable.data,
                })
                break

            default:
                notReachable(loadable)
        }
    }, [loadable, onMsgLive])

    return (
        <Screen background="light" padding="form">
            <ActionBar
                left={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <BackIcon size={24} />
                    </IconButton>
                }
            />

            <Column shrink spacing={24}>
                <Header
                    title={
                        <FormattedMessage
                            id="AddFromTrezor.AccountSelection.title"
                            defaultMessage="Import Trezor accounts"
                        />
                    }
                    onInfoIconClick={noop}
                />

                <Section>
                    <GroupHeader
                        left={
                            <FormattedMessage
                                id="AddFromNewSecretPhrase.accounts"
                                defaultMessage="Accounts"
                            />
                        }
                        right={null}
                    />
                    <Group variant="default">
                        <Column spacing={8}>
                            {(() => {
                                switch (loadable.type) {
                                    case 'loaded':
                                    case 'loading':
                                        return (
                                            <ListItemSkeleton
                                                avatar
                                                shortText
                                            />
                                        )

                                    case 'error':
                                        return (
                                            <>
                                                <ErrorPopup
                                                    error={loadable.error}
                                                    onMsg={(msg) => {
                                                        switch (msg.type) {
                                                            case 'on_sync_trezor_click':
                                                            case 'try_again_clicked':
                                                                setLoadable({
                                                                    type: 'loading',
                                                                    params: loadable.params,
                                                                })

                                                                break

                                                            case 'on_trezor_error_close':
                                                            case 'close':
                                                                onMsg({
                                                                    type: 'close',
                                                                })
                                                                break

                                                            default:
                                                                notReachable(
                                                                    msg
                                                                )
                                                        }
                                                    }}
                                                />
                                                <ListItemSkeleton
                                                    avatar
                                                    shortText
                                                />
                                            </>
                                        )

                                    default:
                                        return notReachable(loadable)
                                }
                            })()}
                        </Column>
                    </Group>
                </Section>
            </Column>
        </Screen>
    )
}

const ErrorPopup = ({
    error,
    onMsg,
}: {
    error: unknown
    onMsg: (
        msg: MsgOf<typeof TrezorErrorPopup> | MsgOf<typeof AppErrorPopup>
    ) => void
}) => {
    const appError = parseAppError(error)

    switch (appError.type) {
        case 'trezor_connection_already_initialized':
        case 'trezor_popup_closed':
        case 'trezor_permissions_not_granted':
        case 'trezor_method_cancelled':
        case 'trezor_action_cancelled':
        case 'trezor_pin_cancelled':
        case 'trezor_device_used_elsewhere':
            return <TrezorErrorPopup error={appError} onMsg={onMsg} />

        default:
            return <AppErrorPopup error={appError} onMsg={onMsg} />
    }
}
