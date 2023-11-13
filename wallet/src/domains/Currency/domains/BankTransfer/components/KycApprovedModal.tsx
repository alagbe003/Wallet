import { Column2 } from 'src/uikit/Column2'
import { Header } from 'src/uikit/Header'
import { Avatar } from 'src/uikit/Avatar'
import { FormattedMessage } from 'react-intl'
import { Button } from 'src/uikit'
import { Popup } from 'src/uikit/Popup'
import { BoldGeneralBank } from 'src/uikit/Icon/BoldGeneralBank'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | { type: 'on_do_bank_transfer_clicked' }
export const KycApprovedModal = ({ onMsg }: Props) => (
    <Popup.Layout onMsg={onMsg} background="surfaceDefault">
        <Column2 spacing={24}>
            <Header
                icon={({ size }) => (
                    <Avatar
                        size={72}
                        variant="round"
                        backgroundColor="backgroundLight"
                        icon={
                            <BoldGeneralBank
                                size={size}
                                color="iconStatusSuccess"
                            />
                        }
                    />
                )}
                title={
                    <FormattedMessage
                        id="kyc.modal.approved.title"
                        defaultMessage="Bank transfers unlocked"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="kyc.modal.approved.subtitle"
                        defaultMessage="Your verification is complete you can now do limitless bank transfers."
                    />
                }
            />

            <Button
                type="button"
                variant="primary"
                onClick={() => onMsg({ type: 'on_do_bank_transfer_clicked' })}
                size="regular"
            >
                <FormattedMessage
                    id="kyc.modal.approved.button-text"
                    defaultMessage="Do bank transfer"
                />
            </Button>
        </Column2>
    </Popup.Layout>
)
