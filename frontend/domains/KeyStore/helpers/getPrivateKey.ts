import { string } from '@zeal/toolkit/Result'
import { Address } from '@zeal/domains/Address'
import { decrypt } from '@zeal/toolkit/Crypto'
import { decryptSecretPhrase } from '@zeal/domains/KeyStore/helpers/decryptSecretPhrase'
import * as bip39 from '@scure/bip39'
import { hdkey } from 'ethereumjs-wallet'
import { notReachable } from '@zeal/toolkit'
import { PrivateKey, SecretPhrase } from '@zeal/domains/KeyStore'

export const getPrivateKey = async ({
    keyStore,
    sessionPassword,
}: {
    sessionPassword: string
    keyStore: PrivateKey | SecretPhrase
}): Promise<{ address: Address; pk: string }> => {
    switch (keyStore.type) {
        case 'private_key_store': {
            const pk = await decrypt(
                sessionPassword,
                keyStore.encryptedPrivateKey,
                string
            )
            return { address: keyStore.address, pk: `0x${pk}` }
        }

        case 'secret_phrase_key': {
            const decryptedSecretPhrase = await decryptSecretPhrase({
                encryptedPhrase: keyStore.encryptedPhrase,
                sessionPassword,
            })
            const seed = await bip39.mnemonicToSeed(decryptedSecretPhrase)

            const hdwallet = hdkey.fromMasterSeed(Buffer.from(seed))

            const wallet = hdwallet.derivePath(keyStore.bip44Path).getWallet()
            const address = wallet.getChecksumAddressString()
            const pk = wallet.getPrivateKeyString()
            return { address, pk }
        }

        /* istanbul ignore next */
        default:
            return notReachable(keyStore)
    }
}
