import { formatDistanceToNowStrict } from 'date-fns'
import { FormattedMessage } from 'react-intl'
import { SecretPhrase } from '@zeal/domains/KeyStore'
import { IconButton } from 'src/uikit'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Avatar, Badge } from 'src/uikit/Avatar'
import { Column2 } from 'src/uikit/Column2'
import { Group } from 'src/uikit/Group'
import { Header } from 'src/uikit/Header'
import { BoldTickSmall } from 'src/uikit/Icon/BoldTickSmall'
import { CustomGoogleDrive } from 'src/uikit/Icon/CustomGoogleDrive'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { Paper } from 'src/uikit/Icon/Paper'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'

type Props = {
    keystore: SecretPhrase
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_google_drive_backup_click' }
    | { type: 'on_write_down_secret_phrase_click' }

export const Layout = ({ keystore, onMsg }: Props) => {
    return (
        <Layout2 padding="form" background="light">
            <ActionBar
                left={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <BackIcon size={24} />
                    </IconButton>
                }
            />

            <Column2 spacing={24}>
                <Header
                    title={
                        <FormattedMessage
                            id="SetupRecoveryKit.title"
                            defaultMessage="Set Up Recovery Kit"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="SetupRecoveryKit.subtitle"
                            defaultMessage="You’ll need at least one way to restore your account if you uninstall Zeal or switch devices"
                        />
                    }
                />

                <Column2 spacing={8}>
                    <Group variant="default">
                        <ListItem2
                            size="regular"
                            aria-selected={false}
                            avatar={({ size }) => (
                                <Avatar
                                    size={size}
                                    icon={
                                        <CustomGoogleDrive
                                            size={size}
                                            color="iconAccent2"
                                        />
                                    }
                                    rightBadge={({ size }) =>
                                        keystore.googleDriveFile ? (
                                            <Badge
                                                size={size}
                                                backgroundColor="statusSuccess"
                                            >
                                                <BoldTickSmall
                                                    size={size}
                                                    color="iconDefaultOnDark"
                                                />
                                            </Badge>
                                        ) : null
                                    }
                                />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="SetupRecoveryKit.google.title"
                                    defaultMessage="Google Drive backup"
                                />
                            }
                            shortText={
                                keystore.googleDriveFile ? (
                                    <FormattedMessage
                                        id="SetupRecoveryKit.google.subtitle"
                                        defaultMessage="Synced {date}"
                                        values={{
                                            date: formatDistanceToNowStrict(
                                                keystore.googleDriveFile
                                                    .modifiedTime,
                                                {
                                                    addSuffix: true,
                                                    roundingMethod: 'floor',
                                                }
                                            ),
                                        }}
                                    />
                                ) : (
                                    <FormattedMessage
                                        id="SetupRecoveryKit.google.encrypt_a_recovery_file_with_password"
                                        defaultMessage="Encrypt a Recovery File with password"
                                    />
                                )
                            }
                            onClick={() =>
                                onMsg({ type: 'on_google_drive_backup_click' })
                            }
                        />
                    </Group>

                    <Group variant="default">
                        <ListItem2
                            size="regular"
                            aria-selected={false}
                            avatar={({ size }) => (
                                <Avatar
                                    size={size}
                                    icon={
                                        <Paper
                                            size={size}
                                            color="iconAccent2"
                                        />
                                    }
                                    rightBadge={({ size }) =>
                                        keystore.confirmed ? (
                                            <Badge
                                                size={size}
                                                backgroundColor="statusSuccess"
                                            >
                                                <BoldTickSmall
                                                    size={size}
                                                    color="iconDefaultOnDark"
                                                />
                                            </Badge>
                                        ) : null
                                    }
                                />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="SetupRecoveryKit.writeDown.title"
                                    defaultMessage="Manual backup"
                                />
                            }
                            shortText={
                                <FormattedMessage
                                    id="SetupRecoveryKit.writeDown.subtitle"
                                    defaultMessage="Write down Secret Phrase"
                                />
                            }
                            onClick={() =>
                                onMsg({
                                    type: 'on_write_down_secret_phrase_click',
                                })
                            }
                        />
                    </Group>
                </Column2>
            </Column2>
        </Layout2>
    )
}
