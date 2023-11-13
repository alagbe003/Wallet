import { FormattedMessage } from 'react-intl'
import { IconButton } from 'src/uikit'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column2 } from 'src/uikit/Column2'
import { Group } from 'src/uikit/Group'
import { Header } from 'src/uikit/Header'
import { BoldNewWallet } from 'src/uikit/Icon/BoldNewWallet'
import { BoldUpload } from 'src/uikit/Icon/BoldUpload'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_import_secret_phrase_clicked' }
    | { type: 'on_create_new_secret_phrase_clicked' }

export const ChooseImportOrCreateSecretPhrase = ({ onMsg }: Props) => {
    return (
        <Layout2 padding="form" background="light">
            <ActionBar
                left={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <BackIcon size={24} />
                    </IconButton>
                }
            />

            <Column2 spacing={24} style={{ flex: '0 0 auto' }}>
                <Header
                    title={
                        <FormattedMessage
                            id="ChooseImportOrCreateSecretPhrase.title"
                            defaultMessage="Add Secret Phrase"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="ChooseImportOrCreateSecretPhrase.subtitle"
                            defaultMessage="Import a Secret Phrase or create a new one"
                        />
                    }
                />

                <Column2 style={{ flex: '0 0 auto' }} spacing={8}>
                    <Group style={{ flex: '0 0 auto' }} variant="default">
                        <ListItem2
                            size="regular"
                            aria-selected={false}
                            avatar={({ size }) => (
                                <BoldUpload size={size} color="iconAccent2" />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="account.add.import_secret_phrase"
                                    defaultMessage="Import Secret Phrase"
                                />
                            }
                            shortText={
                                <FormattedMessage
                                    id="account.add.import_secret_phrase.subtext"
                                    defaultMessage="Created on Zeal, Metamask, or others"
                                />
                            }
                            onClick={() =>
                                onMsg({
                                    type: 'on_import_secret_phrase_clicked',
                                })
                            }
                        />
                    </Group>

                    <Group style={{ flex: '0 0 auto' }} variant="default">
                        <ListItem2
                            size="regular"
                            aria-selected={false}
                            avatar={({ size }) => (
                                <BoldNewWallet
                                    size={size}
                                    color="iconAccent2"
                                />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="account.add.create_new_secret_phrase"
                                    defaultMessage="Create Secret Phrase"
                                />
                            }
                            shortText={
                                <FormattedMessage
                                    id="account.add.create_new_secret_phrase.subtext"
                                    defaultMessage="A new 12-word secret phrase"
                                />
                            }
                            onClick={() =>
                                onMsg({
                                    type: 'on_create_new_secret_phrase_clicked',
                                })
                            }
                        />
                    </Group>
                </Column2>
            </Column2>
        </Layout2>
    )
}
