import { Address } from '@zeal/domains/Address'

// TODO :: get rid of ethereumjs wallet, migrate to webjs

export type KeyStore =
    | PrivateKey
    | LEDGER
    | SecretPhrase
    | Trezor
    | SafeV0
    | TrackOnly

export type SigningKeyStore = Exclude<KeyStore, TrackOnly>

export type PrivateKey = {
    type: 'private_key_store'
    address: Address
    encryptedPrivateKey: string
}

export type Trezor = {
    type: 'trezor'
    address: Address
    path: string
}

export type LEDGER = {
    type: 'ledger'
    address: Address
    path: string
}

export type DecryptedPhraseEntropyString = {
    type: 'decrypted_phrase_entropy_string'
    entropy: string
}

export type SecretPhrase = {
    type: 'secret_phrase_key'
    encryptedPhrase: string
    bip44Path: string
    confirmed: boolean
    googleDriveFile: {
        modifiedTime: number
        id: string
    } | null
}

export type SafeV0 = {
    type: 'safe_v0'
    address: Address

    safeDeplymentConfig: {
        ownerKeyStore: SecretPhrase
        threshold: number
        saltNonce: string
    }
}

export type TrackOnly = {
    type: 'track_only'
}

/**
 * @deprecated Please do not use this type outside of KeyStore domain
 */
export type KeyStoreMapInternal = Record<Address, KeyStore>

declare const KeyStoreMapIndexSymbol: unique symbol

export type KeyStoreMap = Record<
    Address & {
        __keystoreMapIndex: typeof KeyStoreMapIndexSymbol
    },
    KeyStore
>
