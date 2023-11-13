import { Popup } from 'src/uikit/Popup'
import { Header } from 'src/uikit/Header'
import { FormattedMessage } from 'react-intl'
import { Avatar } from 'src/uikit/Avatar'
import { BoldShieldCaution } from 'src/uikit/Icon/BoldShieldCaution'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const HighSpendLimitInfo = ({ onMsg }: Props) => (
    <Popup.Layout aria-labelledby="high-spend-limit-info" onMsg={onMsg}>
        <Header
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
            titleId="high-spend-limit-info"
            title={
                <FormattedMessage
                    id="spend-limits.high.modal.title"
                    defaultMessage="High spend limit"
                />
            }
            subtitle={
                <FormattedMessage
                    id="spend-limits.high.modal.text"
                    defaultMessage="Set a spend limit close to the amount of tokens you'll actually use with an app or smart contract. High limits are risky and can make it easier for scammers to steal your tokens."
                />
            }
        />
    </Popup.Layout>
)
