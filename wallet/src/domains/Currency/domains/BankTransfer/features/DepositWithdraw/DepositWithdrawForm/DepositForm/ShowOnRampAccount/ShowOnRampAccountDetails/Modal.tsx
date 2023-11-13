import { FormattedMessage } from 'react-intl'
import { notReachable } from '@zeal/toolkit'
import { Header } from 'src/uikit/Header'
import { Popup } from 'src/uikit/Popup'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export type State = { type: 'closed' } | { type: 'show_zeal_account_tooltip' }

export const Modal = ({ state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'show_zeal_account_tooltip':
            return (
                <Popup.Layout onMsg={onMsg}>
                    <Header
                        title={
                            <FormattedMessage
                                id="bank_transfers.deposit.modal.zeal-account.title"
                                defaultMessage="Zeal bank transfer details"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="bank_transfers.deposit.modal.zeal-account.text"
                                defaultMessage="This is a bank account setup with by our partner. It’s setup to match the name on your personal bank account so transfers happen quickly and failure free.{br}{br}Tip: You can transfer directly to this bank account anytime and it will be automatically sent to your wallet as USDC (Polygon). "
                                values={{ br: <br /> }}
                            />
                        }
                    />
                </Popup.Layout>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
