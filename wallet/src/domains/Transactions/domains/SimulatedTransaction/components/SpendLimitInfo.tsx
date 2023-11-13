import { Popup } from 'src/uikit/Popup'
import { Header } from 'src/uikit/Header'
import { FormattedMessage } from 'react-intl'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const SpendLimitInfo = ({ onMsg }: Props) => (
    <Popup.Layout
        aria-labelledby="what-is-spend-limit-dialog-title"
        onMsg={onMsg}
    >
        <Header
            titleId="what-is-spend-limit-dialog-title"
            title={
                <FormattedMessage
                    id="spend-limits.modal.title"
                    defaultMessage="What is spend limit?"
                />
            }
            subtitle={
                <FormattedMessage
                    id="spend-limits.modal.text"
                    defaultMessage="Spend limit is how many tokens an app can use on your behalf. You can change or remove this limit anytime. To stay secure, keep Spend limits close to the amount of tokens you’ll actually use with an app."
                />
            }
        />
    </Popup.Layout>
)
