import { FormattedMessage } from 'react-intl'
import { Button } from 'src/uikit'
import { Avatar } from 'src/uikit/Avatar'
import { Column2 } from 'src/uikit/Column2'
import { Header } from 'src/uikit/Header'
import { BoldId } from 'src/uikit/Icon/BoldID'
import { Popup } from 'src/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | { type: 'on_get_started_clicked' }

export const KycModal = ({ onMsg }: Props) => (
    <Popup.Layout onMsg={onMsg} background="surfaceDefault">
        <Column2 spacing={24}>
            <Header
                icon={({ size, color }) => (
                    <Avatar
                        size={72}
                        variant="round"
                        backgroundColor="backgroundLight"
                        icon={<BoldId size={size} color={color} />}
                    />
                )}
                title={
                    <FormattedMessage
                        id="bank_transfers.deposit.modal.kyc.title"
                        defaultMessage="Verify your identity to increase limits"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="bank_transfers.deposit.modal.kyc.text"
                        defaultMessage="To verify your identity we’ll need some personal details and documentation. This usually only takes a couple of minutes to submit."
                    />
                }
            />

            <Button
                type="button"
                variant="primary"
                onClick={() => onMsg({ type: 'on_get_started_clicked' })}
                size="regular"
            >
                <FormattedMessage
                    id="bank_transfers.deposit.modal.kyc.button-text"
                    defaultMessage="Get started"
                />
            </Button>
        </Column2>
    </Popup.Layout>
)
