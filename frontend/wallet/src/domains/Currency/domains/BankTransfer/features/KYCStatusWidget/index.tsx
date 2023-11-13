import { BankTransferInfo } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'
import { Flow } from './Flow'
import { MsgOf } from '@zeal/toolkit/MsgOf'

type Props = {
    bankTransferInfo: BankTransferInfo
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof Flow>

export const KYCStatusWidget = ({ bankTransferInfo, onMsg }: Props) => {
    switch (bankTransferInfo.type) {
        case 'not_started':
            return null

        case 'unblock_user_created':
            return bankTransferInfo.sumSubAccessToken ? (
                <Flow
                    unblockLoginSignature={
                        bankTransferInfo.unblockLoginSignature
                    }
                    onMsg={onMsg}
                />
            ) : null

        default:
            return notReachable(bankTransferInfo)
    }
}
