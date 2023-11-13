import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { Group, Section } from '@zeal/uikit/Group'
import { GroupHeader } from '@zeal/uikit/Group'
import { BoldTrackWallet } from 'src/uikit/Icon/BoldTrackWallet'
import { ListItem } from '@zeal/uikit/ListItem'

type Props = {
    accounts: Account[]
    listItem: (_: { account: Account }) => React.ReactNode
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'track_wallet_clicked' }

export const TrackedAccountsSection = ({
    accounts,
    listItem,
    onMsg,
}: Props) => (
    <Section>
        <GroupHeader
            right={null}
            left={
                <FormattedMessage
                    id="address_book.change_account.tracked_header"
                    defaultMessage="Tracked"
                />
            }
        />

        <Group variant="default">
            {accounts.length ? (
                accounts.map((account) => listItem({ account }))
            ) : (
                <ListItem
                    size="regular"
                    aria-selected={false}
                    avatar={({ size }) => (
                        <BoldTrackWallet size={size} color="iconAccent2" />
                    )}
                    primaryText={
                        <FormattedMessage
                            id="account.add_tracked_wallet.primary_text"
                            defaultMessage="Add tracked wallet"
                        />
                    }
                    shortText={
                        <FormattedMessage
                            id="account.add_tracked_wallet.primary_text"
                            defaultMessage="See portfolio and activity"
                        />
                    }
                    onClick={() =>
                        onMsg({
                            type: 'track_wallet_clicked',
                        })
                    }
                />
            )}
        </Group>
    </Section>
)
