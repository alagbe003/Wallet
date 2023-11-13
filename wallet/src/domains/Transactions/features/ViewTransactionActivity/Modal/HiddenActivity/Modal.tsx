import { notReachable } from '@zeal/toolkit'
import { Popup } from '@zeal/uikit/Popup'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { IconButton } from 'src/uikit'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { TransactionDetails } from '../TransactionDetails'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { ActivityTransaction } from '@zeal/domains/Transactions'
import { KnownCurrencies } from '@zeal/domains/Currency'

type Props = {
    account: Account
    accountsMap: AccountsMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    state: State
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export type State =
    | { type: 'closed' }
    | {
          type: 'transaction_details'
          transaction: ActivityTransaction
          currencies: KnownCurrencies
      }

export const Modal = ({
    state,
    account,
    accountsMap,
    networkMap,
    networkRPCMap,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'transaction_details':
            return (
                <Popup.Layout onMsg={onMsg}>
                    <Popup.Content>
                        <ActionBar
                            right={
                                <IconButton
                                    onClick={() => onMsg({ type: 'close' })}
                                >
                                    <CloseCross size={24} />
                                </IconButton>
                            }
                        />
                        <TransactionDetails
                            transaction={state.transaction}
                            accountsMap={accountsMap}
                            account={account}
                            knownCurrencies={state.currencies}
                            networkMap={networkMap}
                            networkRPCMap={networkRPCMap}
                        />
                    </Popup.Content>
                </Popup.Layout>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
