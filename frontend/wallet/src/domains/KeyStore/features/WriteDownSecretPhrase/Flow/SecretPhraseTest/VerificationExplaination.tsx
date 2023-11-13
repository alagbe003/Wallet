import { Layout2 } from 'src/uikit/Layout/Layout2'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Button, IconButton } from 'src/uikit'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { Column2 } from 'src/uikit/Column2'
import { Header } from 'src/uikit/Header'
import { FormattedMessage } from 'react-intl'
import { Spacer2 } from 'src/uikit/Spacer2'
import React from 'react'
import { ShieldEmpty } from 'src/uikit/Icon/ShieldEmpty'
import { Row } from '@zeal/uikit/Row'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    secretPhraseTestStepsCount: number
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_verification_explaination_close' }
    | { type: 'on_continue_click' }

export const VerificationExplaination = ({
    secretPhraseTestStepsCount,
    onMsg,
}: Props) => {
    return (
        <Layout2 padding="form" background="light">
            <ActionBar
                left={
                    <IconButton
                        onClick={() =>
                            onMsg({
                                type: 'on_verification_explaination_close',
                            })
                        }
                    >
                        <BackIcon size={24} />
                    </IconButton>
                }
            />
            <Column2 style={{ overflowY: 'auto' }} spacing={24}>
                <Header
                    icon={({ size, color }) => (
                        <ShieldEmpty size={size} color={color} />
                    )}
                    title={
                        <FormattedMessage
                            id="keystore.write_secret_phrase.test_ps.title"
                            defaultMessage="Test Account Recovery"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="keystore.write_secret_phrase.test_ps.subtitle"
                            defaultMessage="You’ll need your Secret Phrase to restore your account in this or other devices. Let’s test that your Secret Phrase is written correctly."
                        />
                    }
                />
                <Row spacing={0} alignX="center">
                    <Text2
                        variant="paragraph"
                        weight="bold"
                        color="textSecondary"
                        align="center"
                    >
                        <FormattedMessage
                            id="keystore.write_secret_phrase.test_ps.subtitle2"
                            defaultMessage="We’ll ask you for {count} words in your phrase."
                            values={{ count: secretPhraseTestStepsCount }}
                        />
                    </Text2>
                </Row>
            </Column2>
            <Spacer2 />

            <Button
                variant="primary"
                size="regular"
                onClick={() => {
                    onMsg({ type: 'on_continue_click' })
                }}
            >
                <FormattedMessage
                    id="keystore.write_secret_phrase.test_ps.lets_do_it"
                    defaultMessage="Let’s do it"
                />
            </Button>
        </Layout2>
    )
}
