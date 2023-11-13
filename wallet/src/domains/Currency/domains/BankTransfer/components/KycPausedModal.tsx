import { Popup } from 'src/uikit/Popup'
import { Column2 } from 'src/uikit/Column2'
import { Header } from 'src/uikit/Header'
import { Avatar } from 'src/uikit/Avatar'
import { FormattedMessage } from 'react-intl'
import { Button } from 'src/uikit'
import { BoldDangerTriangle } from 'src/uikit/Icon/BoldDangerTriangle'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | { type: 'on_kyc_try_again_clicked' }

export const KycPausedModal = ({ onMsg }: Props) => (
    <Popup.Layout onMsg={onMsg} background="surfaceDefault">
        <Column2 spacing={24}>
            <Header
                icon={({ size }) => (
                    <Avatar
                        size={72}
                        variant="round"
                        backgroundColor="backgroundLight"
                        icon={
                            <BoldDangerTriangle
                                size={size}
                                color="iconStatusWarning"
                            />
                        }
                    />
                )}
                title={
                    <FormattedMessage
                        id="kyc.modal.paused.title"
                        defaultMessage="Your details look wrong"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="kyc.modal.paused.subtitle"
                        defaultMessage="It looks like some of your information doesn’t match. Please try again and double-check your details before submitting."
                    />
                }
            />

            <Button
                type="button"
                variant="primary"
                onClick={() => onMsg({ type: 'on_kyc_try_again_clicked' })}
                size="regular"
            >
                <FormattedMessage
                    id="kyc.modal.paused.button-text"
                    defaultMessage="Try again"
                />
            </Button>
        </Column2>
    </Popup.Layout>
)
