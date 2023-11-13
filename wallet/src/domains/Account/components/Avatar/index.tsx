import { Account } from '@zeal/domains/Account'
import { KeyStore } from '@zeal/domains/KeyStore'
import { notReachable } from '@zeal/toolkit'
import {
    AvatarSize,
    BadgeSize,
    Avatar as UIAvatar,
    Badge as UIBadge,
} from '@zeal/uikit/Avatar'
import { BoldEye } from '@zeal/uikit/Icon/BoldEye'
import { CustomLedger } from '@zeal/uikit/Icon/CustomLedger'
import { CustomTrezor } from '@zeal/uikit/Icon/CustomTrezor'
import { SolidStatusKey } from '@zeal/uikit/Icon/SolidStatusKey'
import { AvatarImage } from './AvatarImage'

type Props = {
    account: Account
    keystore: KeyStore
    size: AvatarSize
}

export const AvatarWithoutBadge = ({
    account,
    keystore,
    size,
}: {
    size: AvatarSize
    account: Account
    keystore: KeyStore
}) => (
    <UIAvatar size={size}>
        <AvatarImage size={size} keystore={keystore} account={account} />
    </UIAvatar>
)

export const Avatar = ({ keystore, size, account }: Props) => {
    return (
        <UIAvatar
            size={size}
            rightBadge={({ size }) => <Badge keystore={keystore} size={size} />}
        >
            <AvatarImage size={size} keystore={keystore} account={account} />
        </UIAvatar>
    )
}

const Badge = ({ keystore, size }: { keystore: KeyStore; size: BadgeSize }) => {
    switch (keystore.type) {
        case 'safe_v0':
            // FIXME @resetko-zeal not implemented
            return <>fixme::safe</>
        case 'track_only':
            return (
                <UIBadge size={size} backgroundColor="surfaceDefault">
                    <BoldEye size={size} color="iconAccent2" />
                </UIBadge>
            )

        case 'private_key_store':
            return (
                <UIBadge size={size} backgroundColor="surfaceDefault">
                    <SolidStatusKey size={size} color="iconAccent2" />
                </UIBadge>
            )

        case 'ledger':
            return (
                <UIBadge size={size} backgroundColor="surfaceDefault">
                    <CustomLedger size={size} />
                </UIBadge>
            )

        case 'secret_phrase_key':
            return null

        case 'trezor':
            return (
                <UIBadge size={size} backgroundColor="surfaceDefault">
                    <CustomTrezor size={size} />
                </UIBadge>
            )

        /* istanbul ignore next */
        default:
            return notReachable(keystore)
    }
}
