import { Account } from '@zeal/domains/Account'
import { KeyStore } from '@zeal/domains/KeyStore'

export const getAvatarImage = (
    keystore: KeyStore,
    account: Account
): string => {
    if (account.avatarSrc) {
        return account.avatarSrc
    }
    if (!keystore) {
        return '/account_avatars/watch_only.svg'
    }

    const addressNumber = BigInt(account.address) % 5n

    return `/account_avatars/avatar_${addressNumber}.svg`
}
