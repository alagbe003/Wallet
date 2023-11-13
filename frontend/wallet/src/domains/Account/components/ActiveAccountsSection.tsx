import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { Group, Section } from 'src/uikit/Group'
import { GroupHeader } from '@zeal/uikit/Group'
import { BoldAddWallet } from 'src/uikit/Icon/BoldAddWallet'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'

type Props = {
    accounts: Account[]
    listItem: (_: { account: Account }) => React.ReactNode
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'add_new_account_click' }

export const ActiveAccountsSection = ({ accounts, listItem, onMsg }: Props) => (
    <Section style={{ flex: '0 0 auto' }}>
        <GroupHeader
            right={null}
            left={
                <FormattedMessage
                    id="address_book.change_account.wallets_header"
                    defaultMessage="Active"
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
                        <BoldAddWallet size={size} color="iconAccent2" />
                    )}
                    primaryText={
                        <FormattedMessage
                            id="account.add_active_wallet.primary_text"
                            defaultMessage="Add wallet"
                        />
                    }
                    shortText={
                        <FormattedMessage
                            id="account.add_active_wallet.short_text"
                            defaultMessage="Create, import or use hardware wallet"
                        />
                    }
                    onClick={() =>
                        onMsg({
                            type: 'add_new_account_click',
                        })
                    }
                />
            )}
        </Group>
    </Section>
)
