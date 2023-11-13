import { Address } from '@zeal/domains/Address'
import { hdkey } from 'ethereumjs-wallet'
import * as bip39 from '@scure/bip39'
import { decryptSecretPhrase } from '@zeal/domains/KeyStore/helpers/decryptSecretPhrase'

type Params = {
    sessionPassword: string
    encryptedPhrase: string
    offset: number
}

export const generateSecretPhraseAddress = async ({
    encryptedPhrase,
    offset,
    sessionPassword,
}: Params): Promise<{ address: Address; path: string }> => {
    const path = `m/44'/60'/0'/0/${offset}`
    return generateSecretPhraseAddressOnPath({
        encryptedPhrase,
        path,
        sessionPassword,
    })
}

export const generateSecretPhraseAddressOnPath = async ({
    encryptedPhrase,
    path,
    sessionPassword,
}: {
    sessionPassword: string
    encryptedPhrase: string
    path: string
}): Promise<{ address: Address; path: string }> => {
    const decryptedPhrase = await decryptSecretPhrase({
        encryptedPhrase,
        sessionPassword,
    })

    const seed = await bip39.mnemonicToSeed(decryptedPhrase)

    const hdwallet = hdkey.fromMasterSeed(Buffer.from(seed.buffer))

    const wallet = hdwallet.derivePath(path).getWallet()
    const address = wallet.getChecksumAddressString()

    return { address, path }
}
