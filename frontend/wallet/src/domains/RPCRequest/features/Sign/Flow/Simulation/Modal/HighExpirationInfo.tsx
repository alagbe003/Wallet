import { Header } from '@zeal/uikit/Header'
import { Popup } from '@zeal/uikit/Popup'
import { FormattedMessage } from 'react-intl'
import { Avatar } from 'src/uikit/Avatar'
import { BoldShieldCaution } from 'src/uikit/Icon/BoldShieldCaution'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'close'
}

export const HighExpirationInfo = ({ onMsg }: Props) => (
    <Popup.Layout
        onMsg={onMsg}
        aria-labelledby="high-expiration-time-modal-title"
    >
        <Header
            titleId="high-expiration-time-modal-title"
            icon={({ size }) => (
                <Avatar
                    size={72}
                    variant="round"
                    backgroundColor="surfaceDefault"
                    icon={
                        <BoldShieldCaution
                            size={size}
                            color="iconStatusWarning"
                        />
                    }
                />
            )}
            title={
                <FormattedMessage
                    id="expiration-time.high.modal.title"
                    defaultMessage="Long expiry time"
                />
            }
            subtitle={
                <FormattedMessage
                    id="expiration-time.high.modal.text"
                    defaultMessage="Expiry times should be short and based on how long you'll actually need. Long times are risky, giving scammers more chance to misuse your tokens."
                />
            }
        />
    </Popup.Layout>
)
