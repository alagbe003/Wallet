import { AccountsMap } from '@zeal/domains/Account'
import { BankTransferInfo } from '@zeal/domains/Storage'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { notReachable } from '@zeal/toolkit'
import { ImperativeError } from '@zeal/domains/Error'
import { KycLogin } from './KycLogin'
import { MsgOf } from '@zeal/toolkit/MsgOf'

type Props = {
    accountsMap: AccountsMap
    bankTransferInfo: BankTransferInfo
    keyStoreMap: KeyStoreMap
    sessionPassword: string
    network: Network
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof KycLogin>

export const StorageDataValidator = ({
    accountsMap,
    bankTransferInfo,
    keyStoreMap,
    sessionPassword,
    network,
    networkMap,
    onMsg,
}: Props) => {
    switch (bankTransferInfo.type) {
        case 'not_started':
            throw new ImperativeError(
                'Cannot do KYC if bank transfer user has not been created'
            )
        case 'unblock_user_created':
            return (
                <KycLogin
                    networkMap={networkMap}
                    account={
                        accountsMap[bankTransferInfo.connectedWalletAddress]
                    }
                    keyStoreMap={keyStoreMap}
                    bankTransferInfo={bankTransferInfo}
                    sessionPassword={sessionPassword}
                    network={network}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(bankTransferInfo)
    }
}
