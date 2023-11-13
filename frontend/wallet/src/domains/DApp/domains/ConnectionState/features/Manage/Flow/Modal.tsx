import { FormattedMessage } from 'react-intl'
import { notReachable } from '@zeal/toolkit'
import { Button } from 'src/uikit'
import { Header } from 'src/uikit/Header'
import { ShieldFail } from 'src/uikit/Icon/ShieldFail'
import { Popup } from 'src/uikit/Popup'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_delete_all_dapps_confirm_click' }

export type State = { type: 'closed' } | { type: 'confirm_delete_all' }

export const Modal = ({ state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'confirm_delete_all':
            return (
                <Popup.Layout onMsg={onMsg}>
                    <Header
                        icon={({ size }) => (
                            <ShieldFail size={size} color="statusCritical" />
                        )}
                        title={
                            <FormattedMessage
                                id="dapp.connection.manage.confirm.disconnect.all.title"
                                defaultMessage="Disconnect all"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="dapp.connection.manage.confirm.disconnect.all.subtitle"
                                defaultMessage="Are you sure you want to disconnect all connections?"
                            />
                        }
                    />
                    <Popup.Actions>
                        <Button
                            variant="primary"
                            size="regular"
                            onClick={() => {
                                onMsg({ type: 'close' })
                            }}
                        >
                            <FormattedMessage
                                id="action.cancel"
                                defaultMessage="Cancel"
                            />
                        </Button>
                        <Button
                            variant="secondary"
                            size="regular"
                            onClick={() => {
                                onMsg({
                                    type: 'on_delete_all_dapps_confirm_click',
                                })
                            }}
                        >
                            <FormattedMessage
                                id="dapp.connection.manage.confirm.disconnect.all.cta"
                                defaultMessage="Disconnect all"
                            />
                        </Button>
                    </Popup.Actions>
                </Popup.Layout>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
