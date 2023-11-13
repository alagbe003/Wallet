import { FormattedMessage } from 'react-intl'
import { KeyStore } from '@zeal/domains/KeyStore'
import { notReachable } from '@zeal/toolkit'
import { BoldPaper } from 'src/uikit/Icon/BoldPaper'
import { BoldUser } from 'src/uikit/Icon/BoldUser'
import { CustomLedger } from 'src/uikit/Icon/CustomLedger'
import { CustomTrezor } from 'src/uikit/Icon/CustomTrezor'
import { SolidStatusKey } from 'src/uikit/Icon/SolidStatusKey'
import { Row } from '@zeal/uikit/Row'
import { Text2 } from 'src/uikit/Text2'

type Props = { keystore: KeyStore }

export const KeyStoreTag = ({ keystore }: Props) => {
    switch (keystore.type) {
        case 'safe_v0':
            // FIXME @resetko-zeal - Safe implementation
            return <>safetag</>

        case 'track_only':
            return (
                <Row spacing={4}>
                    <BoldUser size={15} color="iconAccent2" />
                    <Text2
                        variant="caption1"
                        weight="regular"
                        color="textSecondary"
                    >
                        <FormattedMessage
                            id="account.details.keystoreType.viewOnly"
                            defaultMessage="Tracked"
                        />
                    </Text2>
                </Row>
            )

        case 'private_key_store':
            return (
                <Row spacing={4}>
                    <SolidStatusKey size={16} color="iconAccent2" />
                    <Text2
                        variant="caption1"
                        weight="regular"
                        color="textSecondary"
                    >
                        <FormattedMessage
                            id="account.details.keystoreType.privateKey"
                            defaultMessage="Private Key"
                        />
                    </Text2>
                </Row>
            )

        case 'ledger':
            return (
                <Row spacing={4}>
                    <CustomLedger size={16} />
                    <Text2
                        variant="caption1"
                        weight="regular"
                        color="textSecondary"
                    >
                        <FormattedMessage
                            id="account.details.keystoreType.hardwareWallet"
                            defaultMessage="Hardware Wallet"
                        />
                    </Text2>
                </Row>
            )

        case 'trezor':
            return (
                <Row spacing={4}>
                    <CustomTrezor size={16} />
                    <Text2
                        variant="caption1"
                        weight="regular"
                        color="textSecondary"
                    >
                        <FormattedMessage
                            id="account.details.keystoreType.hardwareWallet"
                            defaultMessage="Hardware Wallet"
                        />
                    </Text2>
                </Row>
            )

        case 'secret_phrase_key':
            return (
                <Row spacing={4}>
                    <BoldPaper size={16} color="iconAccent2" />
                    <Text2
                        variant="caption1"
                        weight="regular"
                        color="textSecondary"
                    >
                        <FormattedMessage
                            id="account.details.keystoreType.secretPhrase"
                            defaultMessage="Secret Phrase"
                        />
                    </Text2>
                </Row>
            )

        /* istanbul ignore next */
        default:
            return notReachable(keystore)
    }
}
