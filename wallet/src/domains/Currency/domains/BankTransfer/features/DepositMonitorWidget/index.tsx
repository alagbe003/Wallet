import { BankTransferInfo } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'
import { Flow } from './Flow'
import { NetworkMap } from '@zeal/domains/Network'
import { MsgOf } from '@zeal/toolkit/MsgOf'

type Props = {
    bankTransferInfo: BankTransferInfo
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof Flow>

export const DepositMonitorWidget = ({
    bankTransferInfo,
    networkMap,
    onMsg,
}: Props) => {
    switch (bankTransferInfo.type) {
        case 'not_started':
            return null
        case 'unblock_user_created':
            return (
                <Flow
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
