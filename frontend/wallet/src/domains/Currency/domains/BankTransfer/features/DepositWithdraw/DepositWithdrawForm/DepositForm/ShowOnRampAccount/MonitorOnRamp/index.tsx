import { useState } from 'react'
import { Account } from '@zeal/domains/Account'
import {
    OnRampTransactionEvent,
    UnblockLoginSignature,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { LookForUnfinishedOnRamp } from './LookForUnfinishedOnRamp'
import { MonitoringOnRampInProgress } from './MonitoringOnRampInProgress'

type Props = {
    network: Network
    networkMap: NetworkMap
    account: Account
    keyStoreMap: KeyStoreMap
    event: OnRampTransactionEvent | null
    form: OnRampFeeParams
    unblockLoginSignature: UnblockLoginSignature
    bankTransferCurrencies: BankTransferCurrencies
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | MsgOf<typeof MonitoringOnRampInProgress>

type State =
    | { type: 'looking_for_unfinished_on_ramp' }
    | {
          type: 'monitoring_on_ramp_in_progress'
          event: OnRampTransactionEvent
      }

export const MonitorOnRamp = ({
    onMsg,
    account,
    keyStoreMap,
    network,
    form,
    bankTransferCurrencies,
    unblockLoginSignature,
    networkMap,
    event,
}: Props) => {
    const [state, setState] = useState<State>(
        event
            ? { type: 'monitoring_on_ramp_in_progress', event }
            : { type: 'looking_for_unfinished_on_ramp' }
    )

    switch (state.type) {
        case 'looking_for_unfinished_on_ramp':
            return (
                <LookForUnfinishedOnRamp
                    networkMap={networkMap}
                    account={account}
                    bankTransferCurrencies={bankTransferCurrencies}
                    form={form}
                    keyStoreMap={keyStoreMap}
                    unblockLoginSignature={unblockLoginSignature}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break

                            case 'on_onramp_found':
                                setState({
                                    type: 'monitoring_on_ramp_in_progress',
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

        case 'monitoring_on_ramp_in_progress':
            return (
                <MonitoringOnRampInProgress
                    networkMap={networkMap}
                    account={account}
                    bankTransferCurrencies={bankTransferCurrencies}
                    form={form}
                    keyStoreMap={keyStoreMap}
                    network={network}
                    previousEvent={state.event}
                    unblockLoginSignature={unblockLoginSignature}
                    onMsg={onMsg}
                />
            )

        default:
            return notReachable(state)
    }
}
