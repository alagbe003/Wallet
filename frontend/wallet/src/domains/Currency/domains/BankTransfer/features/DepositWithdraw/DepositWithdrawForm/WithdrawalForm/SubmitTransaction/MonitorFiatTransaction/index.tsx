import { useState } from 'react'
import { Account } from '@zeal/domains/Account'
import {
    OffRampFailedEvent,
    OffRampSuccessEvent,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'
import { MonitorProgress } from './MonitorProgress'
import { TransactionFailed } from './TransactionFailed'
import { TransactionSuccess } from './TransactionSuccess'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { MsgOf } from '@zeal/toolkit/MsgOf'

type Props = {
    account: Account
    network: Network
    networkMap: NetworkMap
    keyStoreMap: KeyStoreMap
    bankTransferInfo: BankTransferUnblockUserCreated
    loginInfo: UnblockLoginInfo
    transactionHash: string
    withdrawalRequest: WithdrawalRequest
    bankTransferCurrencies: BankTransferCurrencies
    onMsg: (msg: Msg) => void
}

type State =
    | { type: 'monitor_progress' }
    | { type: 'transaction_successful'; event: OffRampSuccessEvent }
    | { type: 'transaction_failed'; event: OffRampFailedEvent }

type Msg = MsgOf<typeof MonitorProgress>

export const MonitorFiatTransaction = ({
    transactionHash,
    loginInfo,
    bankTransferInfo,
    withdrawalRequest,
    account,
    network,
    keyStoreMap,
    networkMap,
    bankTransferCurrencies,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'monitor_progress' })

    switch (state.type) {
        case 'monitor_progress':
            return (
                <MonitorProgress
                    bankTransferCurrencies={bankTransferCurrencies}
                    account={account}
                    keyStoreMap={keyStoreMap}
                    network={network}
                    networkMap={networkMap}
                    withdrawalRequest={withdrawalRequest}
                    transactionHash={transactionHash}
                    loginInfo={loginInfo}
                    unblockLoginSignature={
                        bankTransferInfo.unblockLoginSignature
                    }
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'on_withdrawal_monitor_fiat_transaction_start':
                                onMsg(msg)
                                break
                            case 'on_withdrawal_monitor_fiat_transaction_success':
                                onMsg(msg)
                                setState({
                                    type: 'transaction_successful',
                                    event: msg.event,
                                })
                                break
                            case 'on_withdrawal_monitor_fiat_transaction_failed':
                                onMsg(msg)
                                setState({
                                    type: 'transaction_failed',
                                    event: msg.event,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'transaction_successful':
            return (
                <TransactionSuccess
                    transactionHash={transactionHash}
                    networkMap={networkMap}
                    account={account}
                    keyStoreMap={keyStoreMap}
                    network={network}
                    offRampTransactionEvent={state.event}
                    withdrawalRequest={withdrawalRequest}
                    onMsg={onMsg}
                />
            )

        case 'transaction_failed':
            return (
                <TransactionFailed
                    account={account}
                    keyStoreMap={keyStoreMap}
                    network={network}
                    networkMap={networkMap}
                    offRampTransactionEvent={state.event}
                    withdrawalRequest={withdrawalRequest}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
