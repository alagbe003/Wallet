import { FormattedMessage } from 'react-intl'
import { Header } from 'src/uikit/Header'
import { Popup } from 'src/uikit/Popup'
import { Spinner } from 'src/uikit/Spinner'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const Skeleton = ({ onMsg }: Props) => {
    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                icon={({ size, color }) => (
                    <Spinner size={size} color={color} />
                )}
                title={
                    <FormattedMessage
                        id="GoogleDriveBackup.loader.title"
                        defaultMessage="Waiting for approval..."
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="GoogleDriveBackup.loader.subtitle"
                        defaultMessage="Please approve the request on Google Drive to upload your Recovery File"
                    />
                }
            />
        </Popup.Layout>
    )
}
