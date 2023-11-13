import { components } from '@zeal/api/portfolio'
import { KeyStore } from '@zeal/domains/KeyStore'
import { notReachable } from '@zeal/toolkit'

export type UserEvent = components['schemas']['UserEvent']

export const keystoreToUserEventType = (
    keystore: KeyStore
): components['schemas']['KeystoreType'] => {
    switch (keystore.type) {
        case 'safe_v0':
            return 'Safe'
        case 'track_only':
            return 'Contact'
        case 'private_key_store':
            return 'PrivateKey'
        case 'ledger':
            return 'Ledger'
        case 'secret_phrase_key':
            return 'SecretPhrase'
        case 'trezor':
            return 'Trezor'
        /* istanbul ignore next */
        default:
            return notReachable(keystore)
    }
}
