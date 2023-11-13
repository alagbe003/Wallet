import { FormattedMessage } from 'react-intl'
import { Network } from '@zeal/domains/Network'
import { Button } from 'src/uikit'
import { Header } from 'src/uikit/Header'
import { CloseSquare } from 'src/uikit/Icon/CloseSquare'
import { Actions } from 'src/uikit/Popup/Actions'
import { Layout as PopupLayout } from 'src/uikit/Popup/Layout'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    network: Network
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const StopIsNotSupportedPopup = ({ onMsg, network }: Props) => {
    return (
        <PopupLayout onMsg={onMsg}>
            <Header
                icon={({ size }) => (
                    <CloseSquare size={size} color="iconStatusCritical" />
                )}
                title={
                    <FormattedMessage
                        id="transaction.cancel_popup.not_supported.title"
                        defaultMessage="Not supported"
                    />
                }
            />
            <Text2 variant="callout" weight="medium" color="textPrimary">
                <FormattedMessage
                    id="transaction.cancel_popup.not_supported.subtitle"
                    defaultMessage="Stopping transactions are not supported on {network}"
                    values={{ network: network.name }}
                />
            </Text2>
            <Actions>
                <Button
                    variant="secondary"
                    size="regular"
                    onClick={() => onMsg({ type: 'close' })}
                >
                    <FormattedMessage
                        id="action.close"
                        defaultMessage="close"
                    />
                </Button>
            </Actions>
        </PopupLayout>
    )
}
