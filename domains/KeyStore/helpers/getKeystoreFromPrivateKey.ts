import Web3 from 'web3'
import { PrivateKey } from '@zeal/domains/KeyStore'
import { encrypt } from '@zeal/toolkit/Crypto'

export const getKeystoreFromPrivateKey = async (
    privateKey: string,
    sessionPassword: string
): Promise<PrivateKey> => {
    const { address } = new Web3().eth.accounts.privateKeyToAccount(privateKey)

    return {
        type: 'private_key_store',
        address,
        encryptedPrivateKey: await encrypt(sessionPassword, privateKey),
    }
}
