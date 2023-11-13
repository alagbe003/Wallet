import {
    OffRampTransactionEvent,
    UnblockLoginSignature,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { fetchUnblockEvents } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchUnblockEvents'
import { notReachable } from '@zeal/toolkit'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'

type FetchParams = {
    transactionHash: string
    unblockLoginSignature: UnblockLoginSignature
    bankTransferCurrencies: BankTransferCurrencies
}

export const fetchLastOfframpEvent = async ({
    transactionHash,
    unblockLoginSignature,
    bankTransferCurrencies,
}: FetchParams): Promise<OffRampTransactionEvent | null> => {
    const events = await fetchUnblockEvents({
        bankTransferCurrencies,
        unblockLoginSignature,
    })

    const possibleEvents = events.filter(
        (event): event is OffRampTransactionEvent => {
            switch (event.type) {
                case 'unblock_offramp_in_progress':
                case 'unblock_offramp_fiat_transfer_issued':
                case 'unblock_offramp_success':
                case 'unblock_offramp_on_hold':
                case 'unblock_offramp_failed':
                    return event.transactionHash === transactionHash
                case 'kyc_event_status_changed':
                case 'unblock_onramp_transfer_received':
                case 'unblock_onramp_crypto_transfer_issued':
                case 'unblock_onramp_process_completed':
                case 'unblock_onramp_transfer_in_review':
                case 'unblock_onramp_transfer_approved':
                    return false

                default:
                    return notReachable(event)
            }
        }
    )

    const sortedEvents = possibleEvents.sort(
        (a, b) => b.createdAt - a.createdAt
    )

    return sortedEvents[0] || null
}
