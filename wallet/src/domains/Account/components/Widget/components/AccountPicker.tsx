import { Tertiary } from '@zeal/uikit/Tertiary'
import { ArrowDown } from 'src/uikit/Icon/Navigation/ArrowDown'
import { Account } from '@zeal/domains/Account'
import { Avatar } from 'src/domains/Account/components/Avatar'
import { KeyStore } from '@zeal/domains/KeyStore'
import { Text } from '@zeal/uikit/Text'

type Props = {
    currentAccount: Account
    keystore: KeyStore
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'account_filter_click' }

export const AccountPicker = ({ onMsg, keystore, currentAccount }: Props) => {
    return (
        <Tertiary
            size="regular"
            color="on_dark"
            onClick={() => {
                onMsg({ type: 'account_filter_click' })
            }}
        >
            <Avatar account={currentAccount} size={32} keystore={keystore} />
            <Text ellipsis>{currentAccount.label}</Text>
            <ArrowDown size={16} />
        </Tertiary>
    )
}
