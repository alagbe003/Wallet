import { FormattedMessage } from 'react-intl'
import { IconButton } from 'src/uikit'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column2 } from 'src/uikit/Column2'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Modal } from '@zeal/uikit/Modal'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Spinner } from 'src/uikit/Spinner'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const LoadingLayout = ({ onMsg }: Props) => (
    <Modal>
        <Layout2 background="light" padding="form">
            <ActionBar
                right={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <CloseCross size={24} />
                    </IconButton>
                }
            />
            <Spacer2 />

            <Column2 alignX="center" spacing={16}>
                <Spinner size={72} color="iconStatusNeutral" />

                <Text2 variant="callout" weight="medium" color="textPrimary">
                    <FormattedMessage
                        id="currency.add_custom.token_removed"
                        defaultMessage="Verifying RPC"
                    />
                </Text2>
            </Column2>

            <Spacer2 />
        </Layout2>
    </Modal>
)
