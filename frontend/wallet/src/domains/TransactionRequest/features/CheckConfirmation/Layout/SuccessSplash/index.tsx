import { AccountsMap } from '@zeal/domains/Account'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { SubmitedTransactionCompleted } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { notReachable } from '@zeal/toolkit'

import { FinalSimulation } from './FinalSimulation'
import { SuccessLayout } from './SuccessLayout'
import { Submited } from '@zeal/domains/TransactionRequest'

type Props = {
    network: Network
    accounts: AccountsMap
    keystores: KeyStoreMap
    dApp: DAppSiteInfo | null
    networkMap: NetworkMap
    transactionRequest: Submited
    submitedTransaction: SubmitedTransactionCompleted
    onMsg: (msg: Msg) => void
}

export type Msg = {
    type: 'on_transaction_completed_splash_animation_screen_competed'
    transaction: SubmitedTransactionCompleted
    transactionRequest: Submited
}

export const SuccessSplash = ({
    transactionRequest,
    accounts,
    dApp,
    keystores,
    network,
    submitedTransaction,
    networkMap,
    onMsg,
}: Props) => {
    switch (network.type) {
        case 'custom':
            return (
                <SuccessLayout
                    onAnimationComplete={() =>
                        onMsg({
                            type: 'on_transaction_completed_splash_animation_screen_competed',
                            transaction: submitedTransaction,
                            transactionRequest,
                        })
                    }
                />
            )

        case 'predefined':
        case 'testnet':
            return (
                <FinalSimulation
                    accounts={accounts}
                    transactionRequest={transactionRequest}
                    dApp={dApp}
                    keystores={keystores}
                    network={network}
                    networkMap={networkMap}
                    onMsg={onMsg}
                    submitedTransaction={submitedTransaction}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}
