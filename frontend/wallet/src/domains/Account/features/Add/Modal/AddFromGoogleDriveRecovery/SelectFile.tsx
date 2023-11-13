import { ActionBar } from '@zeal/uikit/ActionBar'
import { IconButton } from 'src/uikit'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { Column2 } from 'src/uikit/Column2'
import { Header } from 'src/uikit/Header'
import { FormattedMessage } from 'react-intl'
import { Group, Section } from 'src/uikit/Group'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Text2 } from 'src/uikit/Text2'
import { parseEncryptedBackupContent } from '@zeal/domains/KeyStore/helpers/backup'
import { notReachable } from '@zeal/toolkit'
import { CustomGoogleDrive } from 'src/uikit/Icon/CustomGoogleDrive'
import { DangerCircle } from 'src/uikit/Icon/DangerCircle'
import { format } from 'date-fns'
import { ZEAL_BACKUP_FILE_EXTENSION_WITH_DOT } from '@zeal/domains/KeyStore/constants'
import { ForwardIcon } from 'src/uikit/Icon/Navigation/ForwardIcon'

type Props = {
    files: {
        id: string
        name: string
        modifiedTime: number
        encryptedContent: unknown
    }[]
    onMsg: (msg: Msg) => void
}

type File = {
    id: string
    name: string
    modifiedTime: number
    encryptedContent: string
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'backup_file_selected'
          file: File
      }

export const SelectFile = ({ files, onMsg }: Props) => {
    return (
        <Layout2 background="light" padding="form">
            <ActionBar
                left={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <BackIcon size={24} />
                    </IconButton>
                }
            />

            <Column2 style={{ overflowY: 'auto' }} spacing={24}>
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

                <Section style={{ overflow: 'auto' }}>
                    <Group variant="default" style={{ overflow: 'auto' }}>
                        <Column2 spacing={8}>
                            {files.map((file, index) => {
                                const parseEncryptedContent =
                                    parseEncryptedBackupContent(
                                        file.encryptedContent
                                    )
                                switch (parseEncryptedContent.type) {
                                    case 'Failure':
                                        return (
                                            <ListItem2
                                                key={index}
                                                size="regular"
                                                aria-selected={false}
                                                avatar={({ size }) => (
                                                    <DangerCircle
                                                        color="iconStatusCritical"
                                                        size={size}
                                                    />
                                                )}
                                                primaryText={file.name.replace(
                                                    ZEAL_BACKUP_FILE_EXTENSION_WITH_DOT,
                                                    ''
                                                )}
                                                shortText={
                                                    <Text2 color="textError">
                                                        <FormattedMessage
                                                            id="account.recovery_kit.select_backup_file.list.file_corrupted"
                                                            defaultMessage="Recovery File is not valid"
                                                        />
                                                    </Text2>
                                                }
                                            />
                                        )
                                    case 'Success':
                                        return (
                                            <ListItem2
                                                key={index}
                                                size="regular"
                                                aria-selected={false}
                                                onClick={() => {
                                                    onMsg({
                                                        type: 'backup_file_selected',
                                                        file: {
                                                            ...file,
                                                            encryptedContent:
                                                                parseEncryptedContent.data,
                                                        },
                                                    })
                                                }}
                                                avatar={({ size }) => (
                                                    <CustomGoogleDrive
                                                        size={size}
                                                    />
                                                )}
                                                primaryText={file.name.replace(
                                                    ZEAL_BACKUP_FILE_EXTENSION_WITH_DOT,
                                                    ''
                                                )}
                                                shortText={
                                                    <FormattedMessage
                                                        id="account.recovery_kit.select_backup_file.file_date"
                                                        defaultMessage="Created {date}"
                                                        values={{
                                                            date: format(
                                                                file.modifiedTime,
                                                                'd MMM yyyy'
                                                            ),
                                                        }}
                                                    />
                                                }
                                                side={{
                                                    rightIcon: ({ size }) => (
                                                        <ForwardIcon
                                                            size={size}
                                                            color="iconDefault"
                                                        />
                                                    ),
                                                }}
                                            />
                                        )
                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(
                                            parseEncryptedContent
                                        )
                                }
                            })}
                        </Column2>
                    </Group>
                </Section>
            </Column2>
        </Layout2>
    )
}
