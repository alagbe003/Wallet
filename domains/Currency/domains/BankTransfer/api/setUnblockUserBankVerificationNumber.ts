import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { UnblockLoginSignature } from '@zeal/domains/Currency/domains/BankTransfer'
import { patch } from '@zeal/api/request'

export const setUnblockUserBankVerificationNumber = ({
    loginInfo,
    bankVerificationNumber,
    unblockLoginSignature,
    signal,
}: {
    loginInfo: UnblockLoginInfo
    unblockLoginSignature: UnblockLoginSignature
    bankVerificationNumber: string
    signal?: AbortSignal
}): Promise<void> =>
    patch(
        '/wallet/unblock/',
        {
            body: {
                bvn: bankVerificationNumber,
            },
            query: {
                path: '/user',
            },
            auth: {
                type: 'unblock_auth',
                message: unblockLoginSignature.message,
                signature: unblockLoginSignature.signature,
                sessionId: loginInfo.unblockSessionId,
            },
        },
        signal
    ).then(() => undefined)
