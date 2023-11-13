import { Column2 } from 'src/uikit/Column2'
import { Header } from 'src/uikit/Header'
import { Avatar } from 'src/uikit/Avatar'
import { BoldDangerTriangle } from 'src/uikit/Icon/BoldDangerTriangle'
import { FormattedMessage } from 'react-intl'
import { Popup } from 'src/uikit/Popup'
import { Button } from 'src/uikit'
import { Row } from '@zeal/uikit/Row'
import { ArrowLink } from 'src/uikit/Icon/ArrowLink'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const KycFailedModal = ({ onMsg }: Props) => (
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
                                color="iconStatusCritical"
                            />
                        }
                    />
                )}
                title={
                    <FormattedMessage
                        id="kyc.modal.failed.title"
                        defaultMessage="Verification failed"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="kyc.modal.failed.subtitle"
                        defaultMessage="Something went wrong. Please contact the Zeal team for support."
                    />
                }
            />
            <Button
                type="button"
                variant="primary"
                onClick={() =>
                    window.open('https://discord.gg/XN6j4Mg9JD', '_blank')
                }
                size="regular"
            >
                <Row spacing={6}>
                    <Text2>
                        <FormattedMessage
                            id="kyc.modal.failed.button-text"
                            defaultMessage="Contact Support"
                        />
                    </Text2>
                    <ArrowLink size={16} />
                </Row>
            </Button>
        </Column2>
    </Popup.Layout>
)
