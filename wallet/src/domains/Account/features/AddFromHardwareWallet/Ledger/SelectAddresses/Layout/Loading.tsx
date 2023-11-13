import { FormattedMessage } from 'react-intl'
import { noop } from '@zeal/toolkit'
import { Button } from '@zeal/uikit/Button'
import { Avatar } from 'src/uikit/Avatar'
import { Screen } from '@zeal/uikit/Screen'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { ListItemSkeleton } from '@zeal/uikit/ListItem'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'
import { ActionBar, Msg as ActionBarMsg } from './ActionBar'
import { Header, Msg as HeaderMsg } from './Header'
import { Actions } from '@zeal/uikit/Actions'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg = ActionBarMsg | HeaderMsg

export const Loading = ({ onMsg }: Props) => {
    return (
        <Screen background="light" padding="form">
            <ActionBar onMsg={onMsg} />
            <Column spacing={24}>
                <Header />
                <Group variant="default">
                    <ListItemSkeleton
                        avatar={({ size }) => (
                            <Avatar size={size} border="secondary">
                                <Text
                                    variant="caption1"
                                    weight="medium"
                                    color="textPrimary"
                                    align="center"
                                >
                                    {1}
                                </Text>
                            </Avatar>
                        )}
                        shortText
                    />
                </Group>
            </Column>
            <Spacer />
            <Actions>
                <Button
                    disabled
                    size="regular"
                    variant="primary"
                    onClick={noop}
                >
                    <FormattedMessage
                        id="ledger.select_account.path_settings"
                        defaultMessage={`{count, plural,
              =0 {No accounts selected}
              one {Import account}
              other {Import {count} accounts}}`}
                        values={{
                            count: 0,
                        }}
                    />
                </Button>
            </Actions>
        </Screen>
    )
}
