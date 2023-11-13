import { get } from '@zeal/api/request'
import {
    UnblockLoginSignature,
    UnblockUser,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { parseUser } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseUnblockUser'
import { object } from '@zeal/toolkit/Result'

export const fetchUser = ({
    unblockLoginInfo,
    unblockLoginSignature: { message, signature },
    signal,
}: {
    unblockLoginSignature: UnblockLoginSignature
    unblockLoginInfo: UnblockLoginInfo
    signal?: AbortSignal
}): Promise<UnblockUser> =>
    get(
        '/wallet/unblock/',
        {
            query: {
                path: `/user`,
            },
            auth: {
                type: 'unblock_auth',
                message,
                signature,
                sessionId: unblockLoginInfo.unblockSessionId,
            },
        },
        signal
    ).then((data) =>
        object(data)
            .andThen(parseUser)
            .getSuccessResultOrThrow(
                'Failed to parse kyc status during fetchUnblockKycStatus'
            )
    )
