import { Network } from '@zeal/domains/Network'
import { Account } from '@zeal/domains/Account'

import { IconButton } from 'src/uikit'
import { FormattedMessage, useIntl } from 'react-intl'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { notReachable } from '@zeal/toolkit'
import { Minimized, Msg as MinimizedMsg } from 'src/uikit/Minimized'

import { Screen } from '@zeal/uikit/Screen'
import { ActionBar as AccountActionBar } from 'src/domains/Account/components/ActionBar'
import { Content } from '@zeal/uikit/Content'
import { KeyStore } from '@zeal/domains/KeyStore'

type Props = {
    network: Network
    account: Account
    keystore: KeyStore
    state: State
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_cancel_confirm_transaction_clicked' }
    | MinimizedMsg
    | { type: 'on_minimize_click' }

export type State = { type: 'minimised' } | { type: 'maximised' }

export const Skeleton = ({
    network,
    account,
    state,
    keystore,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    switch (state.type) {
        case 'minimised':
            return <Minimized onMsg={onMsg} />

        case 'maximised':
            return (
                <Screen background="light" padding="form">
                    <AccountActionBar
                        keystore={keystore}
                        network={network}
                        account={account}
                        right={
                            <IconButton
                                onClick={() =>
                                    onMsg({ type: 'on_minimize_click' })
                                }
                                aria-label={formatMessage({
                                    id: 'actions.minimize',
                                    defaultMessage: 'Minimize',
                                })}
                            >
                                <CloseCross size={24} />
                            </IconButton>
                        }
                    />

                    <Content>
                        <Content.Splash
                            onAnimationComplete={null}
                            variant="spinner"
                            title={
                                <FormattedMessage
                                    id="ConfirmTransaction.Simuation.Skeleton.title"
                                    defaultMessage="Simulating..."
                                />
                            }
                        />
                    </Content>
                </Screen>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
