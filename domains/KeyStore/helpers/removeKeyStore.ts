import { Address } from '@zeal/domains/Address'
import { KeyStoreMap, KeyStoreMapInternal } from '@zeal/domains/KeyStore'

export const removeKeyStore = ({
    address,
    keyStoreMap,
}: {
    keyStoreMap: KeyStoreMap
    address: Address
}): KeyStoreMap => {
    const { [address]: _, ...remainingKeyStoreMap } =
        keyStoreMap as KeyStoreMapInternal

    return remainingKeyStoreMap
}
