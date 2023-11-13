import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Button, IconButton } from 'src/uikit'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Header } from 'src/uikit/Header'
import { BoldDangerTriangle } from 'src/uikit/Icon/BoldDangerTriangle'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Modal } from '@zeal/uikit/Modal'
import { Row } from '@zeal/uikit/Row'
import { Spacer2 } from 'src/uikit/Spacer2'
import { SafetyWarning } from './SafetyWarning'
import { Network } from '@zeal/domains/Network'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'

export type Props = {
    initialRPCUrl: string | null
    rpcUrl: string
    network: Network
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'try_again_clicked' }
    | MsgOf<typeof SafetyWarning>

export type State = { type: 'cannot_verify' } | { type: 'safety_warning' }

export const CannotVerify = ({
    initialRPCUrl,
    rpcUrl,
    network,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'cannot_verify' })

    switch (state.type) {
        case 'cannot_verify':
            return (
                <Modal>
                    <Layout2 background="light" padding="form">
                        <ActionBar
                            left={
                                <IconButton
                                    onClick={() => onMsg({ type: 'close' })}
                                >
                                    <BackIcon size={24} />
                                </IconButton>
                            }
                        />

                        <Spacer2 />

                        <Header
                            icon={({ size }) => (
                                <BoldDangerTriangle
                                    size={size}
                                    color="statusCritical"
                                />
                            )}
                            title={
                                <FormattedMessage
                                    id="editNetwork.cannot_verify.title"
                                    defaultMessage="We can’t verify RPC Node"
                                />
                            }
                            subtitle={
                                <FormattedMessage
                                    id="editNetwork.cannot_verify.subtitle"
                                    defaultMessage="The custom RPC node is not responding properly. Check the URL and try again."
                                />
                            }
                        />

                        <Spacer2 />

                        <Row spacing={8}>
                            <Button
                                size="regular"
                                variant="primary"
                                onClick={() => {
                                    onMsg({ type: 'try_again_clicked' })
                                }}
                            >
                                <FormattedMessage
                                    id="editNetwork.cannot_verify.try_again"
                                    defaultMessage="Try again"
                                />
                            </Button>

                            <Button
                                size="regular"
                                variant="secondary"
                                onClick={() => {
                                    setState({ type: 'safety_warning' })
                                }}
                            >
                                <FormattedMessage
                                    id="action.continue"
                                    defaultMessage="Continue"
                                />
                            </Button>
                        </Row>
                    </Layout2>
                </Modal>
            )
        case 'safety_warning':
            return (
                <SafetyWarning
                    initialRPCUrl={initialRPCUrl}
                    rpcUrl={rpcUrl}
                    onMsg={onMsg}
                    network={network}
                />
            )

        default:
            return notReachable(state)
    }
}
