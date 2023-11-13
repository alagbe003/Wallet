import { Popup } from 'src/uikit/Popup'
import { Column2 } from 'src/uikit/Column2'
import { Header } from 'src/uikit/Header'
import { Avatar } from 'src/uikit/Avatar'
import { FormattedMessage } from 'react-intl'
import { Button } from 'src/uikit'
import { notReachable } from '@zeal/toolkit'
import { Forward } from 'src/uikit/Icon/Forward'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_continue_clicked' }

export const ContinueWithPartner = ({ onMsg }: Props) => {
    return (
        <Popup.Layout
            onMsg={(msg) => {
                switch (msg.type) {
                    case 'close':
                        onMsg({ type: 'on_continue_clicked' })
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(msg.type)
                }
            }}
            background="surfaceDefault"
        >
            <Column2 spacing={24}>
                <Header
                    icon={({ size, color }) => (
                        <Avatar
                            size={72}
                            variant="round"
                            backgroundColor="backgroundLight"
                            icon={<Forward size={size} color={color} />}
                        />
                    )}
                    title={
                        <FormattedMessage
                            id="kyc.modal.continue-with-partner.title"
                            defaultMessage="Continue with our partner"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="kyc.modal.continue-with-partner.subtitle"
                            defaultMessage="We’ll now forward you to our partner to collect your documentation and complete verification application."
                        />
                    }
                />

                <Button
                    type="button"
                    variant="primary"
                    onClick={() => onMsg({ type: 'on_continue_clicked' })}
                    size="regular"
                >
                    <FormattedMessage
                        id="kyc.modal.continue-with-partner.button-text"
                        defaultMessage="Continue"
                    />
                </Button>
            </Column2>
        </Popup.Layout>
    )
}
