import { Account } from '@zeal/domains/Account'
import { Screen } from '@zeal/uikit/Screen'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { IconButton } from 'src/uikit'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { Column2 } from 'src/uikit/Column2'
import { FormattedMessage } from 'react-intl'
import { Header } from 'src/uikit/Header'
import { Group, Section } from 'src/uikit/Group'
import { SolidStatusKey } from 'src/uikit/Icon/SolidStatusKey'
import { keys } from '@zeal/toolkit/Object'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { SecretPhrase } from '@zeal/domains/KeyStore'

type Props = {
    secretPhraseMap: Record<
        string,
        { keystore: SecretPhrase; account: Account }[]
    >
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | {
          type: 'on_phrase_selected'
          keystore: SecretPhrase
      }

export const Layout = ({ secretPhraseMap, onMsg }: Props) => {
    const phrases = keys(secretPhraseMap)

    return (
        <Screen background="light" padding="form">
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
                            id="AddFromExistingSecretPhrase.SelectPhrase.title"
                            defaultMessage="Pick a Secret Phrase"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="AddFromExistingSecretPhrase.SelectPhrase.subtitle"
                            defaultMessage="Create new accounts from one of your existing Secret Phrases"
                        />
                    }
                />

                <Section style={{ overflow: 'auto' }}>
                    <Group variant="default" style={{ overflow: 'auto' }}>
                        <Column2 spacing={8}>
                            {phrases.map((phrase, index) => (
                                <ListItem2
                                    size="regular"
                                    aria-selected={false}
                                    avatar={({ size }) => (
                                        <SolidStatusKey
                                            color="iconAccent2"
                                            size={size}
                                        />
                                    )}
                                    key={phrase}
                                    onClick={() =>
                                        onMsg({
                                            type: 'on_phrase_selected',

                                            keystore:
                                                secretPhraseMap[phrase][0]
                                                    .keystore,
                                        })
                                    }
                                    primaryText={
                                        <FormattedMessage
                                            id="AddFromExistingSecretPhrase.SelectPhrase.PhraseItem.title"
                                            defaultMessage="Secret Phrase {index}"
                                            values={{
                                                index: index + 1,
                                            }}
                                        />
                                    }
                                    shortText={
                                        <FormattedMessage
                                            id="AddFromExistingSecretPhrase.SelectPhrase.PhraseItem.subtitle"
                                            defaultMessage="{count, plural, =0 {No accounts} one {{count} Account} other {{count} Accounts}}"
                                            values={{
                                                count: secretPhraseMap[phrase]
                                                    .length,
                                            }}
                                        />
                                    }
                                />
                            ))}
                        </Column2>
                    </Group>
                </Section>
            </Column2>
        </Screen>
    )
}
