import { FormattedMessage } from 'react-intl'
import { notReachable } from '@zeal/toolkit'
import { Button } from 'src/uikit'
import { Header } from 'src/uikit/Header'
import { Popup } from 'src/uikit/Popup'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

export type State = { type: 'closed' } | { type: 'hardware_wallet_tips' }

type Msg = { type: 'close' }

export const Modal = ({ state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'hardware_wallet_tips':
            return (
                <Popup.Layout onMsg={onMsg}>
                    <Header
                        title={
                            <FormattedMessage
                                id="AddFromTrezor.hwWalletTip.title"
                                defaultMessage="Accounts in Hardware Wallet"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="AddFromTrezor.hwWalletTip.subtitle"
                                defaultMessage="A hardware wallet holds millions of accounts. You can import as many accounts as you need now or add more later."
                            />
                        }
                    />
                    <Popup.Actions>
                        <Button
                            variant="primary"
                            size="regular"
                            onClick={() => onMsg({ type: 'close' })}
                        >
                            <FormattedMessage
                                id="actions.continue"
                                defaultMessage="Continue"
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
