import { Column2 } from 'src/uikit/Column2'
import { Header } from 'src/uikit/Header'
import { Avatar } from 'src/uikit/Avatar'
import { FormattedMessage } from 'react-intl'
import { Button } from 'src/uikit'
import { Popup } from 'src/uikit/Popup'
import { Clock } from 'src/uikit/Icon/Clock'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const KycPendingModal = ({ onMsg }: Props) => (
    <Popup.Layout onMsg={onMsg} background="surfaceDefault">
        <Column2 spacing={24}>
            <Header
                icon={({ size, color }) => (
                    <Avatar
                        size={72}
                        variant="round"
                        backgroundColor="backgroundLight"
                        icon={<Clock size={size} color={color} />}
                    />
                )}
                title={
                    <FormattedMessage
                        id="kyc.modal.pending.title"
                        defaultMessage="We'll keep you updated"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="kyc.modal.pending.subtitle"
                        defaultMessage="Verification normally takes less than 10 minutes to complete, but sometimes it can take a bit longer."
                    />
                }
            />

            <Button
                type="button"
                variant="primary"
                onClick={() => onMsg({ type: 'close' })}
                size="regular"
            >
                <FormattedMessage
                    id="kyc.modal.pending.button-text"
                    defaultMessage="Close"
                />
            </Button>
        </Column2>
    </Popup.Layout>
)
