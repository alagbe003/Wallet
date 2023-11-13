import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { Group, Section, GroupHeader } from '@zeal/uikit/Group'
import { BoldAddWallet } from 'src/uikit/Icon/BoldAddWallet'
import { ListItem } from '@zeal/uikit/ListItem'

type Props = {
    accounts: Account[]
    listItem: (_: { account: Account }) => React.ReactNode
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'add_new_account_click' }

export const ActiveAccountsSection = ({ accounts, listItem, onMsg }: Props) => (
    <Section>
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
                <ListItem
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
