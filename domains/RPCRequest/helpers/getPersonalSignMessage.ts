import Web3 from 'web3'

import { SignMessageRequest } from '@zeal/domains/RPCRequest'
import { notReachable } from '@zeal/toolkit'
import { Result, failure, success } from '@zeal/toolkit/Result'

export const getPersonalSignMessage = (
    request: SignMessageRequest
): Result<unknown, string> => {
    try {
        switch (request.method) {
            case 'personal_sign':
                const w3 = new Web3()
                return success(w3.utils.hexToUtf8(request.params[0]))
            case 'eth_signTypedData':
                return success(
                    JSON.stringify(JSON.parse(request.params[1]), null, 4)
                )

            case 'eth_signTypedData_v4':
            case 'eth_signTypedData_v3':
                return success(
                    JSON.stringify(
                        JSON.parse(request.params[1]).message,
                        null,
                        4
                    )
                )
            /* istanbul ignore next */
            default:
                return notReachable(request)
        }
    } catch (e) {
        return failure(e)
    }
}
