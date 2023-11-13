import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { FormattedMessage } from 'react-intl'
import { IconButton } from 'src/uikit'
import { TransactionList } from 'src/domains/Transactions/components/TransactionList'
import React from 'react'
import { CurrentNetwork, NetworkMap } from '@zeal/domains/Network'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { KeyStore } from '@zeal/domains/KeyStore'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Screen } from '@zeal/uikit/Screen'
import { Column } from '@zeal/uikit/Column'
import { Text } from '@zeal/uikit/Text'

type Props = {
    networkMap: NetworkMap
    accountsMap: AccountsMap
    account: Account
    selectedNetwork: CurrentNetwork
    keystore: KeyStore
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | MsgOf<typeof TransactionList>

export const Layout = ({
    account,
    selectedNetwork,
    accountsMap,
    keystore,
    onMsg,
    networkMap,
}: Props) => {
    return (
        <Screen padding="form" background="light">
            <ActionBar
                account={account}
                keystore={keystore}
                network={null}
                right={
                    <IconButton
                        onClick={() => {
                            onMsg({ type: 'close' })
                        }}
                    >
                        <CloseCross size={24} />
                    </IconButton>
                }
            />
            <Column spacing={12}>
                <Text variant="title3" weight="semi_bold" color="textPrimary">
                    <FormattedMessage
                        id="transactions.hidden-activity.page.title"
                        defaultMessage="Hidden activity"
                    />
                </Text>
                <TransactionList
                    scam
                    onMsg={onMsg}
                    account={account}
                    accountsMap={accountsMap}
                    networkMap={networkMap}
                    selectedNetwork={selectedNetwork}
                />
            </Column>
        </Screen>
    )
}
