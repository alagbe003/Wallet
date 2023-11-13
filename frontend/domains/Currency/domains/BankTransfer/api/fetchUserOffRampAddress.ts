import { get } from '@zeal/api/request'
import { Address } from '@zeal/domains/Address'
import { fromString as parseAddressFromString } from '@zeal/domains/Address/helpers/fromString'
import { UnblockLoginSignature } from '@zeal/domains/Currency/domains/BankTransfer'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import {
    Result,
    array,
    failure,
    object,
    string,
    success,
} from '@zeal/toolkit/Result'

type Params = {
    unblockLoginSignature: UnblockLoginSignature
    unblockLoginInfo: UnblockLoginInfo
    signal?: AbortSignal
}

export const fetchUserOffRampAddress = ({
    unblockLoginInfo,
    unblockLoginSignature,
    signal,
}: Params): Promise<Address> =>
    get(
        '/wallet/unblock/',
        {
            query: {
                path: `/user/wallet/polygon`,
            },
            auth: {
                type: 'unblock_auth',
                message: unblockLoginSignature.message,
                signature: unblockLoginSignature.signature,
                sessionId: unblockLoginInfo.unblockSessionId,
            },
        },
        signal
    ).then((response) =>
        parseUserOffRampAddress(response).getSuccessResultOrThrow(
            'Faield to parse offramp address'
        )
    )

const parseUserOffRampAddress = (input: unknown): Result<unknown, Address> =>
    array(input)
        .andThen((arr) =>
            arr.length === 0
                ? failure({ type: 'address_array_is_empty' })
                : success(arr[0])
        )
        .andThen(object)
        .andThen((obj) => string(obj.address))
        .andThen(parseAddressFromString)
