import { Submited } from '@zeal/domains/TransactionRequest'
import { Widget as TransactionRequestWidget } from 'src/domains/TransactionRequest/features/Widget'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Column } from '@zeal/uikit/Column'

type Props = {
    transactionRequests: Submited[]
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof TransactionRequestWidget>

export const List = ({
    transactionRequests,
    networkMap,
    networkRPCMap,
    keyStoreMap,
    onMsg,
    accountsMap,
}: Props) => {
    return (
        <Column spacing={8}>
            {transactionRequests.map((request) => (
                <TransactionRequestWidget
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    keyStoreMap={keyStoreMap}
                    accountsMap={accountsMap}
                    key={request.rpcRequest.id}
                    transactionRequest={request}
                    onMsg={onMsg}
                />
            ))}
        </Column>
    )
}
