import { Header } from '@zeal/uikit/Header'
import { Popup } from '@zeal/uikit/Popup'
import { FormattedMessage } from 'react-intl'
import { Avatar } from 'src/uikit/Avatar'
import { BoldShieldCaution } from 'src/uikit/Icon/BoldShieldCaution'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const HighSpendLimitInfo = ({ onMsg }: Props) => (
    <Popup.Layout onMsg={onMsg} aria-labelledby="high-spend-limit-modal-title">
        <Header
            titleId="high-spend-limit-modal-title"
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
                    id="spend-limits.high.modal.title"
                    defaultMessage="High spend limit"
                />
            }
            subtitle={
                <FormattedMessage
                    id="spend-limits.high.modal.text"
                    defaultMessage="Spend limit should be close to the amount of tokens you'll actually use with an app or smart contract. High limits are risky and can make it easier for scammers to steal your tokens."
                />
            }
        />
    </Popup.Layout>
)
