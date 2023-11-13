import { Address } from '@zeal/domains/Address'
import {
    KeyStore,
    KeyStoreMap,
    KeyStoreMapInternal,
} from '@zeal/domains/KeyStore'
import { ValueOf } from '@zeal/toolkit/Object'

export const getKeyStore = ({
    address,
    keyStoreMap,
}: {
    keyStoreMap: KeyStoreMap
    address: Address
}): KeyStore => {
    const keyStore: ValueOf<KeyStoreMapInternal> | null =
        (keyStoreMap as KeyStoreMapInternal)[address] || null

    return keyStore || { type: 'track_only' }
}
