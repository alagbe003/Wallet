import { FormattedMessage } from 'react-intl'
import { Button } from 'src/uikit'
import { Column2 } from 'src/uikit/Column2'
import { Header } from 'src/uikit/Header'
import { Rocket } from 'src/uikit/Icon/Rocket'
import { Actions } from 'src/uikit/Popup/Actions'
import { Layout as PopupLayout } from 'src/uikit/Popup/Layout'
import { Row } from '@zeal/uikit/Row'
import { Skeleton as UISkeleton } from 'src/uikit/Skeleton'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const Skeleton = ({ onMsg }: Props) => {
    return (
        <PopupLayout onMsg={onMsg}>
            <Header
                icon={({ size, color }) => <Rocket size={size} color={color} />}
                title={
                    <FormattedMessage
                        id="transaction.speed_up_popup.title"
                        defaultMessage="Speed up transaction?"
                    />
                }
            />
            <Column2 spacing={12}>
                <Row spacing={0} alignX="stretch" alignY="center">
                    <Text2
                        variant="callout"
                        weight="medium"
                        color="textPrimary"
                    >
                        <FormattedMessage
                            id="transaction.speed_up_popup.seed_up_fee_title"
                            defaultMessage="Network speed up fee"
                        />
                    </Text2>

                    <UISkeleton variant="default" height={12} width={48} />
                </Row>
                <Column2 spacing={8}>
                    <UISkeleton variant="default" height={12} width="85%" />
                    <UISkeleton variant="default" height={12} width="75%" />
                    <UISkeleton variant="default" height={12} width="65%" />
                </Column2>
            </Column2>
            <Actions>
                <Button
                    variant="secondary"
                    size="regular"
                    onClick={() => onMsg({ type: 'close' })}
                >
                    <FormattedMessage
                        id="transaction.cancel_popup.cancel"
                        defaultMessage="No, wait"
                    />
                </Button>

                <Button variant="primary" size="regular" disabled>
                    <FormattedMessage
                        id="transaction.speed_up_popup.confirm"
                        defaultMessage="Yes, speed up"
                    />
                </Button>
            </Actions>
        </PopupLayout>
    )
}
