import { Account } from '@zeal/domains/Account'
import { UnblockUser } from '@zeal/domains/Currency/domains/BankTransfer'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { KycApprovedModal } from 'src/domains/Currency/domains/BankTransfer/components/KycApprovedModal'
import { KycFailedModal } from 'src/domains/Currency/domains/BankTransfer/components/KycFailedModal'
import { KycPendingModal } from 'src/domains/Currency/domains/BankTransfer/components/KycPendingModal'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { FormSubmitter } from './FormSubmitter'
import { LoadingLayout } from './LoadingLayout'

type Props = {
    unblockUser: UnblockUser
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    bankTransferInfo: BankTransferUnblockUserCreated
    loginInfo: UnblockLoginInfo
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof FormSubmitter>,
          {
              type:
                  | 'close'
                  | 'on_back_button_clicked'
                  | 'kyc_applicant_created'
                  | 'kyc_data_updated'
          }
      >
    | Extract<
          MsgOf<typeof KycApprovedModal>,
          { type: 'on_do_bank_transfer_clicked' }
      >
export const Kyc = ({
    unblockUser,
    loginInfo,
    account,
    network,
    keyStoreMap,
    bankTransferInfo,
    onMsg,
}: Props) => {
    const { kycStatus } = unblockUser

    switch (kycStatus.type) {
        case 'not_started':
        case 'paused':
            return (
                <FormSubmitter
                    unblockUser={unblockUser}
                    account={account}
                    network={network}
                    keyStoreMap={keyStoreMap}
                    loginInfo={loginInfo}
                    bankTransferInfo={bankTransferInfo}
                    onMsg={onMsg}
                />
            )
        case 'approved':
            return (
                <>
                    <LoadingLayout
                        account={account}
                        network={network}
                        keyStoreMap={keyStoreMap}
                        onMsg={onMsg}
                    />
                    <KycApprovedModal onMsg={onMsg} />
                </>
            )
        case 'failed':
            return (
                <>
                    <LoadingLayout
                        account={account}
                        network={network}
                        keyStoreMap={keyStoreMap}
                        onMsg={onMsg}
                    />
                    <KycFailedModal onMsg={onMsg} />
                </>
            )
        case 'in_progress':
            return (
                <>
                    <LoadingLayout
                        account={account}
                        network={network}
                        keyStoreMap={keyStoreMap}
                        onMsg={onMsg}
                    />
                    <KycPendingModal onMsg={onMsg} />
                </>
            )
        /* istanbul ignore next */
        default:
            return notReachable(kycStatus)
    }
}
