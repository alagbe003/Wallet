import { patch } from '@zeal/api/request'
import {
    OffRampAccount,
    UnblockLoginSignature,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'

export const makeOffRampAccountDefault = ({
    unblockLoginInfo,
    unblockLoginSignature,
    offRampAccount,
    signal,
}: {
    offRampAccount: OffRampAccount
    unblockLoginSignature: UnblockLoginSignature
    unblockLoginInfo: UnblockLoginInfo
    signal?: AbortSignal
}): Promise<void> =>
    patch(
        '/wallet/unblock/',
        {
            query: {
                path: '/user/bank-account/remote',
            },
            auth: {
                type: 'unblock_auth',
                message: unblockLoginSignature.message,
                signature: unblockLoginSignature.signature,
                sessionId: unblockLoginInfo.unblockSessionId,
            },
            body: {
                remote_bank_account_uuid: offRampAccount.uuid,
            },
        },
        signal
    ).then(() => undefined)
