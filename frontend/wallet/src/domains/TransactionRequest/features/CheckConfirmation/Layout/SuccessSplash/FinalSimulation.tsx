import { useLayoutEffect } from 'react'
import { AccountsMap } from '@zeal/domains/Account'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    NetworkMap,
    PredefinedNetwork,
    TestNetwork,
} from '@zeal/domains/Network'
import { SubmitedTransactionCompleted } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { fetchSimulationSubmittedSimulation } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSubmitedTransactionSimulation'
import { notReachable, useLiveRef } from '@zeal/toolkit'
import { withDelay } from '@zeal/toolkit/delay'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { SuccessLayout } from './SuccessLayout'
import { OffRampTransactionView } from 'src/domains/Currency/domains/BankTransfer/components/OffRampTransactionView'
import { BridgeTrxView } from 'src/domains/Transactions/domains/SimulatedTransaction/components/BridgeTrx'
import { P2PTransactionView } from 'src/domains/Transactions/domains/SimulatedTransaction/components/P2PTransactionView'
import { Unknown } from 'src/domains/Transactions/domains/SimulatedTransaction/components/Unknown'
import { Failed } from 'src/domains/Transactions/domains/SimulatedTransaction/components/Failed'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { Approve } from 'src/domains/Transactions/domains/SimulatedTransaction/components/Approve'
import { Submited } from '@zeal/domains/TransactionRequest'
import { NftListItem } from 'src/domains/NFTCollection/components/NftListItem'
import { NftCollectionListItem } from 'src/domains/NFTCollection/components/NftCollectionListItem'

type Props = {
    network: PredefinedNetwork | TestNetwork
    accounts: AccountsMap
    transactionRequest: Submited
    keystores: KeyStoreMap
    dApp: DAppSiteInfo | null
    networkMap: NetworkMap
    submitedTransaction: SubmitedTransactionCompleted
    onMsg: (msg: Msg) => void
}

const SUCCESS_ANIMATION_TIME_MS = 1000

export type Msg = {
    type: 'on_transaction_completed_splash_animation_screen_competed'
    transaction: SubmitedTransactionCompleted
    transactionRequest: Submited
}

export const FinalSimulation = ({
    accounts,
    dApp,
    keystores,
    transactionRequest,
    network,
    submitedTransaction,
    networkMap,
    onMsg,
}: Props) => {
    const [loadable] = useLoadableData(
        withDelay(
            fetchSimulationSubmittedSimulation,
            SUCCESS_ANIMATION_TIME_MS
        ),
        {
            type: 'loading',
            params: { hash: submitedTransaction.hash, network },
        }
    )

    const liveOnMsg = useLiveRef(onMsg)

    useLayoutEffect(() => {
        switch (loadable.type) {
            case 'loading':
                break
            case 'loaded':
                liveOnMsg.current({
                    type: 'on_transaction_completed_splash_animation_screen_competed',
                    transaction: submitedTransaction,
                    transactionRequest,
                })
                break

            case 'error':
                captureError(loadable.error)
                break
            /* istanbul ignore next */
            default:
                notReachable(loadable)
        }
    }, [liveOnMsg, loadable, submitedTransaction, transactionRequest])

    switch (loadable.type) {
        case 'loaded':
            return (
                <TransactionInfo
                    networkMap={networkMap}
                    accounts={accounts}
                    dApp={dApp}
                    keystores={keystores}
                    simulation={{
                        transaction: loadable.data.transaction,
                        checks: [],
                        currencies: loadable.data.currencies,
                    }}
                />
            )

        case 'loading':
        case 'error':
            return <SuccessLayout onAnimationComplete={null} />

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}

const TransactionInfo = ({
    simulation,
    accounts,
    keystores,
    networkMap,
    dApp,
}: {
    simulation: SimulateTransactionResponse
    dApp: DAppSiteInfo | null
    accounts: AccountsMap
    keystores: KeyStoreMap
    networkMap: NetworkMap
}) => {
    const { transaction, checks, currencies: knownCurrencies } = simulation

    switch (transaction.type) {
        case 'WithdrawalTrx':
            return (
                <OffRampTransactionView
                    variant={{ type: 'no_status' }}
                    networkMap={networkMap}
                    withdrawalRequest={transaction.withdrawalRequest}
                />
            )

        case 'BridgeTrx':
            return (
                <BridgeTrxView
                    networkMap={networkMap}
                    transaction={transaction}
                    knownCurrencies={knownCurrencies}
                />
            )
        case 'P2PTransaction':
        case 'P2PNftTransaction':
            return (
                <P2PTransactionView
                    networkMap={networkMap}
                    transaction={transaction}
                    dApp={dApp}
                    knownCurrencies={knownCurrencies}
                    checks={checks}
                    accounts={accounts}
                    keystores={keystores}
                />
            )

        case 'ApprovalTransaction':
            return (
                <Approve
                    checks={checks}
                    knownCurrencies={knownCurrencies}
                    transaction={transaction}
                />
            )

        case 'UnknownTransaction':
            return (
                <Unknown
                    networkMap={networkMap}
                    checks={checks}
                    knownCurrencies={knownCurrencies}
                    transaction={transaction}
                />
            )

        case 'FailedTransaction':
            return <Failed dApp={dApp} transaction={transaction} />

        case 'SingleNftApprovalTransaction':
            return (
                <NftListItem
                    networkMap={networkMap}
                    nft={transaction.nft}
                    checks={checks}
                    rightNode={null}
                />
            )

        case 'NftCollectionApprovalTransaction':
            return (
                <NftCollectionListItem
                    networkMap={networkMap}
                    checks={checks}
                    nftCollection={transaction.nftCollectionInfo}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(transaction)
    }
}
