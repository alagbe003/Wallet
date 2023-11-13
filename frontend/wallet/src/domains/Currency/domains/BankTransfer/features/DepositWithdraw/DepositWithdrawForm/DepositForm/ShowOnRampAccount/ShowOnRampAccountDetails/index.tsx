import { useEffect, useState } from 'react'
import { Account } from '@zeal/domains/Account'
import {
    OnRampAccount,
    OnRampTransactionEvent,
    UnblockLoginSignature,
    UnblockUser,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { notReachable, useLiveRef } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { fetchLastUnfinishedOnRamp } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchLastUnfinishedOnRamp'

type Props = {
    currencies: BankTransferCurrencies
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    onRampAccount: OnRampAccount
    form: OnRampFeeParams
    unblockUser: UnblockUser
    unblockLoginSignature: UnblockLoginSignature
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_unfinished_onramp_found'; event: OnRampTransactionEvent }
    | Extract<
          MsgOf<typeof Layout>,
          { type: 'on_back_button_clicked' | 'on_sent_from_bank_click' }
      >

const ON_RAMP_DETECTION_POLLING_INTERVAL_MS = 5000

export const ShowOnRampAccountDetails = ({
    onRampAccount,
    onMsg,
    account,
    network,
    keyStoreMap,
    form,
    currencies,
    unblockUser,
    unblockLoginSignature,
}: Props) => {
    const msgLive = useLiveRef(onMsg)
    const [state, setState] = useState<ModalState>({ type: 'closed' })

    const [pollable] = usePollableData(
        fetchLastUnfinishedOnRamp,
        {
            type: 'loading',
            params: {
                bankTransferCurrencies: currencies,
                unblockLoginSignature,
            },
        },
        {
            pollIntervalMilliseconds: ON_RAMP_DETECTION_POLLING_INTERVAL_MS,
            stopIf: (pollable) => {
                switch (pollable.type) {
                    case 'loaded':
                    case 'reloading':
                    case 'subsequent_failed':
                        return !!pollable.data
                    case 'loading':
                    case 'error':
                        return false

                    default:
                        return notReachable(pollable)
                }
            },
        }
    )

    useEffect(() => {
        switch (pollable.type) {
            case 'loaded':
            case 'reloading':
            case 'subsequent_failed':
                if (pollable.data) {
                    msgLive.current({
                        type: 'on_unfinished_onramp_found',
                        event: pollable.data,
                    })
                }
                break

            case 'loading':
            case 'error':
                // We continue wait for event
                break

            default:
                notReachable(pollable)
        }
    }, [pollable, msgLive])

    return (
        <>
            <Layout
                unblockUser={unblockUser}
                account={account}
                network={network}
                keyStoreMap={keyStoreMap}
                currencies={currencies}
                onRampAccount={onRampAccount}
                form={form}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_sent_from_bank_click':
                        case 'on_back_button_clicked':
                        case 'close':
                            onMsg(msg)
                            break
                        case 'on_zeal_account_tooltip_click':
                            setState({
                                type: 'show_zeal_account_tooltip',
                            })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                state={state}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setState({ type: 'closed' })
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(msg.type)
                    }
                }}
            />
        </>
    )
}
