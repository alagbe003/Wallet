import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { Group, Section } from 'src/uikit/Group'
import { GroupHeader } from '@zeal/uikit/Group'
import { BoldTrackWallet } from 'src/uikit/Icon/BoldTrackWallet'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'

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
    <Section style={{ flex: '0 0 auto' }}>
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
                <ListItem2
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
