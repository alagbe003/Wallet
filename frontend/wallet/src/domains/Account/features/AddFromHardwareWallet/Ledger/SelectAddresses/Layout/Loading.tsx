import { FormattedMessage } from 'react-intl'
import { noop } from '@zeal/toolkit'
import { Button } from 'src/uikit'
import { Avatar } from 'src/uikit/Avatar'
import { Screen } from '@zeal/uikit/Screen'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { ListItemSkeleton } from 'src/uikit/ListItem2/ListItemSkeleton'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'
import { ActionBar, Msg as ActionBarMsg } from './ActionBar'
import { Header, Msg as HeaderMsg } from './Header'

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
                    {[...Array(5).keys()].map((_, index) => {
                        return (
                            <ListItemSkeleton
                                key={`item-${index}`}
                                avatar={({ size }) => (
                                    <Avatar size={size} border="secondary">
                                        <Text
                                            variant="caption1"
                                            weight="medium"
                                            color="textPrimary"
                                            align="center"
                                        >
                                            {index + 1}
                                        </Text>
                                    </Avatar>
                                )}
                                shortText
                            />
                        )
                    })}
                </Group>
            </Column>
            <Spacer />
            <Button disabled size="regular" variant="primary" onClick={noop}>
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
        </Screen>
    )
}
