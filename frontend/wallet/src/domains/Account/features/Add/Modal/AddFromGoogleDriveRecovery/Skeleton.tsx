import { FormattedMessage } from 'react-intl'
import { IconButton } from 'src/uikit'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column2 } from 'src/uikit/Column2'
import { Group, Section } from 'src/uikit/Group'
import { Header } from 'src/uikit/Header'
import { CustomGoogleDrive } from 'src/uikit/Icon/CustomGoogleDrive'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { ForwardIcon } from 'src/uikit/Icon/Navigation/ForwardIcon'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { ListItemSkeleton } from 'src/uikit/ListItem2/ListItemSkeleton'
import { Popup } from '@zeal/uikit/Popup'
import { Spinner } from '@zeal/uikit/Spinner'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const Skeleton = ({ onMsg }: Props) => {
    const skeletons = new Array(5).fill(true)
    return (
        <>
            <Layout2 background="light" padding="form">
                <ActionBar
                    left={
                        <IconButton onClick={() => onMsg({ type: 'close' })}>
                            <BackIcon size={24} />
                        </IconButton>
                    }
                />

                <Column2 style={{ flex: '1' }} spacing={24}>
                    <Header
                        title={
                            <FormattedMessage
                                id="account.recovery_kit.select_backup_file.title"
                                defaultMessage="Recovery File"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="account.recovery_kit.select_backup_file.subtitle"
                                defaultMessage="Select the Recovery File you want to restore"
                            />
                        }
                    />

                    <Section>
                        <Group variant="default" style={{ overflow: 'auto' }}>
                            <Column2 spacing={8}>
                                {skeletons.map((_, index) => (
                                    <ListItemSkeleton
                                        key={`skeleton-${index}-2`}
                                        avatar={({ size }) => (
                                            <CustomGoogleDrive size={size} />
                                        )}
                                        shortText
                                        side={{
                                            rightIcon: ({ size }) => (
                                                <ForwardIcon
                                                    size={size}
                                                    color="iconDefault"
                                                />
                                            ),
                                        }}
                                    />
                                ))}
                            </Column2>
                        </Group>
                    </Section>
                </Column2>
            </Layout2>

            <Popup.Layout onMsg={onMsg}>
                <Header
                    icon={({ size, color }) => (
                        <Spinner size={size} color={color} />
                    )}
                    title={
                        <FormattedMessage
                            id="add.account.google.login.title"
                            defaultMessage="Waiting for approval..."
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="add.account.google.login.subtitle"
                            defaultMessage="Please approve request on Google Drive to sync your Recovery File"
                        />
                    }
                />
            </Popup.Layout>
        </>
    )
}
