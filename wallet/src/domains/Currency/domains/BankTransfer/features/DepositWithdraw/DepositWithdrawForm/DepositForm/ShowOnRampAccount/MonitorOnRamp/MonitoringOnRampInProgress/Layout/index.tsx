import { Account } from '@zeal/domains/Account'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { OnRampTransactionEvent } from '@zeal/domains/Currency/domains/BankTransfer'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { IconButton } from 'src/uikit'
import { Column2 } from 'src/uikit/Column2'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Completed } from './Completed'
import { CryptoTransferIssued } from './CryptoTransferIssued'
import { TransferReceivedOrInReview } from './TransferReceivedOrInReview'

type Props = {
    now: number
    startedAt: number
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    form: OnRampFeeParams
    onRampTransactionEvent: OnRampTransactionEvent
    knownCurrencies: KnownCurrencies
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | MsgOf<typeof Completed>

export const Layout = ({
    onMsg,
    now,
    startedAt,
    form,
    account,
    keyStoreMap,
    network,
    onRampTransactionEvent,
    knownCurrencies,
    networkMap,
}: Props) => {
    return (
        <Layout2 padding="form" background="light">
            <ActionBar
                network={network}
                account={account}
                keystore={getKeyStore({
                    keyStoreMap,
                    address: account.address,
                })}
                right={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <CloseCross size={24} />
                    </IconButton>
                }
            />

            <Column2 spacing={12} style={{ overflowY: 'auto', flex: '1' }}>
                {(() => {
                    switch (onRampTransactionEvent.type) {
                        case 'unblock_onramp_transfer_received':
                        case 'unblock_onramp_transfer_in_review':
                        case 'unblock_onramp_transfer_approved':
                            return (
                                <TransferReceivedOrInReview
                                    networkMap={networkMap}
                                    event={onRampTransactionEvent}
                                    form={form}
                                    knownCurrencies={knownCurrencies}
                                    now={now}
                                    startedAt={startedAt}
                                />
                            )

                        case 'unblock_onramp_crypto_transfer_issued':
                            return (
                                <CryptoTransferIssued
                                    networkMap={networkMap}
                                    event={onRampTransactionEvent}
                                    knownCurrencies={knownCurrencies}
                                    now={now}
                                    startedAt={startedAt}
                                />
                            )

                        case 'unblock_onramp_process_completed':
                            return (
                                <Completed
                                    networkMap={networkMap}
                                    event={onRampTransactionEvent}
                                    knownCurrencies={knownCurrencies}
                                    onMsg={onMsg}
                                />
                            )

                        default:
                            return notReachable(onRampTransactionEvent)
                    }
                })()}
            </Column2>
        </Layout2>
    )
}
