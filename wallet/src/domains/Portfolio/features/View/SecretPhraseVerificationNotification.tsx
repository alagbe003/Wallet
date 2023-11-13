import { FormattedMessage } from 'react-intl'
import { KeyStore } from '@zeal/domains/KeyStore'
import { recoveryKitStatus } from '@zeal/domains/KeyStore/helpers/recoveryKitStatus'
import { notReachable } from '@zeal/toolkit'
import { InfoCard } from '@zeal/uikit/InfoCard'
import { Shield } from '@zeal/uikit/Icon/Shield'

type Props = {
    keystore: KeyStore
    onClick: () => void
}

export const SecretPhraseVerificationNotification = ({
    keystore,
    onClick,
}: Props) => {
    switch (keystore.type) {
        case 'secret_phrase_key': {
            const status = recoveryKitStatus(keystore)
            switch (status) {
                case 'configured':
                    return null
                case 'not_configured':
                    return (
                        <InfoCard
                            onClick={onClick}
                            variant="warning"
                            icon={({ size }) => <Shield size={size} />}
                            title={
                                <FormattedMessage
                                    id="portfolio.view.set_up_recovery_kit.primary"
                                    defaultMessage="Set up your Recovery Kit"
                                />
                            }
                            subtitle={
                                <FormattedMessage
                                    id="portfolio.view.set_up_recovery_kit.secondary"
                                    defaultMessage="Avoid losing access to your assets"
                                />
                            }
                        />
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(status)
            }
        }

        case 'private_key_store':
        case 'ledger':
        case 'trezor':
        case 'track_only':
        case 'safe_v0':
            return null

        /* istanbul ignore next */
        default:
            return notReachable(keystore)
    }
}
