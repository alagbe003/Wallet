import { BankTransferInfo } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'
import { NetworkMap } from '@zeal/domains/Network'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { DataLoader } from './DataLoader'
import { SubmittedOfframpTransaction } from '@zeal/domains/Currency/domains/BankTransfer'

type Props = {
    bankTransferInfo: BankTransferInfo
    submittedTransaction: SubmittedOfframpTransaction
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof DataLoader>

export const WithdrawalMonitorWidget = ({
    bankTransferInfo,
    networkMap,
    submittedTransaction,
    onMsg,
}: Props) => {
    switch (bankTransferInfo.type) {
        case 'not_started':
            return null
        case 'unblock_user_created':
            return (
                <DataLoader
                    submittedTransaction={submittedTransaction}
                    networkMap={networkMap}
                    unblockLoginSignature={
                        bankTransferInfo.unblockLoginSignature
                    }
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(bankTransferInfo)
    }
}
