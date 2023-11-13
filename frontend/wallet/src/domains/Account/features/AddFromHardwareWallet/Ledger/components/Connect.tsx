import { Screen } from '@zeal/uikit/Screen'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { Header } from 'src/uikit/Header'
import { FormattedMessage } from 'react-intl'
import { Avatar } from 'src/uikit/Avatar'
import { Button, IconButton } from 'src/uikit'
import { Spacer2 } from 'src/uikit/Spacer2'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { Text2 } from 'src/uikit/Text2'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'

type Props = {
    isLoading: boolean
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'on_connect_button_click' } | { type: 'close' }

export const Connect = ({ onMsg, isLoading }: Props) => {
    return (
        <Screen background="default" padding="form">
            <ActionBar
                left={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <BackIcon size={24} />
                    </IconButton>
                }
            />
            <Column spacing={24}>
                <Header
                    title={
                        <FormattedMessage
                            id="ledger.connect.title"
                            defaultMessage="Connect Ledger to Zeal"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="ledger.connect.subtitle"
                            defaultMessage="Follow these steps to import your Ledger accounts to Zeal"
                        />
                    }
                />
                <Column spacing={4}>
                    <ListItem2
                        size="large"
                        aria-selected={false}
                        primaryText={
                            <FormattedMessage
                                id="ledger.connect.step1"
                                defaultMessage="Connect Ledger to your device"
                            />
                        }
                        avatar={({ size }) => (
                            <Avatar border="secondary" size={size}>
                                <Text2
                                    variant="caption1"
                                    weight="medium"
                                    color="textPrimary"
                                    align="center"
                                >
                                    1
                                </Text2>
                            </Avatar>
                        )}
                    />

                    <ListItem2
                        size="large"
                        aria-selected={false}
                        primaryText={
                            <FormattedMessage
                                id="ledger.connect.step2"
                                defaultMessage="Open the Ethereum app on Ledger"
                            />
                        }
                        avatar={({ size }) => (
                            <Avatar border="secondary" size={size}>
                                <Text2
                                    variant="caption1"
                                    weight="medium"
                                    color="textPrimary"
                                    align="center"
                                >
                                    2
                                </Text2>
                            </Avatar>
                        )}
                    />

                    <ListItem2
                        size="large"
                        aria-selected={false}
                        primaryText={
                            <FormattedMessage
                                id="ledger.connect.step3"
                                defaultMessage="Then sync your Ledger 👇"
                            />
                        }
                        avatar={({ size }) => (
                            <Avatar border="secondary" size={size}>
                                <Text2
                                    variant="caption1"
                                    weight="medium"
                                    color="textPrimary"
                                    align="center"
                                >
                                    3
                                </Text2>
                            </Avatar>
                        )}
                    />
                </Column>
            </Column>
            <Spacer2 />
            <Button
                size="regular"
                variant="primary"
                disabled={isLoading}
                onClick={() => {
                    onMsg({ type: 'on_connect_button_click' })
                }}
            >
                <FormattedMessage
                    id="ledger.connect.cta"
                    defaultMessage="Sync Ledger"
                />
            </Button>
        </Screen>
    )
}
