import { FormattedMessage } from 'react-intl'
import { notReachable } from '@zeal/toolkit'
import { Button } from 'src/uikit'
import { Header } from 'src/uikit/Header'
import { Modal as UIModal } from 'src/uikit/Modal'
import { Popup } from 'src/uikit/Popup'
import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

export type State =
    | { type: 'closed' }
    | { type: 'secret_phrase_accounts_hint' }
    | { type: 'success' }

type Msg =
    | { type: 'close' }
    | { type: 'on_accounts_create_success_animation_finished' }

export const Modal = ({ state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'success':
            return (
                <UIModal>
                    <SuccessLayout
                        onAnimationComplete={() =>
                            onMsg({
                                type: 'on_accounts_create_success_animation_finished',
                            })
                        }
                        title={
                            <FormattedMessage
                                id="AddFromNewSecretPhrase.success"
                                defaultMessage="Accounts added to Zeal"
                            />
                        }
                    />
                </UIModal>
            )

        case 'secret_phrase_accounts_hint':
            return (
                <Popup.Layout onMsg={onMsg}>
                    <Header
                        title={
                            <FormattedMessage
                                id="AddFromNewSecretPhrase.secretPhraseTip.title"
                                defaultMessage="Secret Phrase Wallets"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="AddFromNewSecretPhrase.secretPhraseTip.subtitle"
                                defaultMessage="A Secret Phrase acts like a keychain for millions of wallets, each with a unique private key.{br}{br}You can import as many wallets as you need now or add more later."
                                values={{
                                    br: <br />,
                                }}
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
