import Web3 from 'web3'

import { Address } from '@zeal/domains/Address'
import { PersonalECRecover } from '@zeal/domains/RPCRequest'

export const getSignatureAddress = (
    request: PersonalECRecover
): Promise<Address> =>
    new Promise((resolve, reject) =>
        setTimeout(async () => {
            try {
                const web3 = new Web3()
                const [message, signature] = request.params
                const address: Address = await web3.eth.personal.ecRecover(
                    message,
                    signature
                )
                resolve(address)
            } catch (e) {
                reject(e)
            }
        }, 0)
    )
