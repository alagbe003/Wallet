import { notReachable } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'
import { Story } from '@zeal/uikit/Story'
import { FormattedMessage } from 'react-intl'
import { LoadingLayout } from 'src/uikit/LoadingLayout'
import { Address } from '@zeal/domains/Address'
import { ec as EC } from 'elliptic'
import { decode } from 'cbor-x'
import { parseAuthenticatorData } from '@simplewebauthn/server/helpers'
import { ImperativeError } from '@zeal/domains/Error'
import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

// FIXME @Nicvaniek move this type
export type PasskeyV0 = {
    credentialId: string
    publicKey: {
        xCoordinate: string
        yCoordinate: string
    }
    signerAddress: Address
}

// FIXME @Nicvaniek move to frontend/wallet/src/domains/KeyStore/helpers once type is extracted to domain
const getPredictedPasskeySignerAddress = async (
    publicKey: PasskeyV0['publicKey']
): Promise<Address> => {
    // FIXME
    throw new Error(`Not implemented ${publicKey}`)
}

const bufferToHexString = (buffer: ArrayBuffer): string =>
    new Uint8Array(buffer).reduce(
        (acc, v) => acc + v.toString(16).padStart(2, '0'),
        '0x'
    )

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_passkey_created'; passkey: PasskeyV0 }

const createPasskeyCredential = async (): Promise<PasskeyV0> => {
    const curve = new EC('p256')

    const config: PublicKeyCredentialCreationOptions = {
        challenge: Uint8Array.from(
            window.crypto.getRandomValues(new Uint8Array(26)), // Not meaningful during registration
            (c) => c
        ),
        rp: { name: 'Zeal Wallet' },
        user: {
            id: Uint8Array.from(
                window.crypto.getRandomValues(new Uint8Array(16)), // Ensure we create a new passkey each time
                (c) => c
            ),
            name: 'Zeal', // This shows up in passkey list modal for user to differentiate between passkeys
            displayName: 'Zeal', // Not used in browser modals yet
        },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
        timeout: 6000000, // Ugly timeout UI shown to user if this value is small and user takes long
    }

    const credential: any = await navigator.credentials.create({
        // Fixme @Nicvaniek types
        publicKey: config,
    })

    const attestation = decode(
        new Uint8Array(credential?.response?.attestationObject)
    )

    const authData = parseAuthenticatorData(attestation.authData)

    if (!authData.credentialPublicKey) {
        throw new ImperativeError('No credential public key found')
    }

    const publicKey = decode(authData?.credentialPublicKey)
    const x = publicKey[-2]
    const y = publicKey[-3]

    const point = curve.curve.point(x, y)

    const publicKeyData: PasskeyV0['publicKey'] = {
        xCoordinate: `0x${point.getX().toString(16)}`,
        yCoordinate: `0x${point.getY().toString(16)}`,
    }

    const predictedSignerAddress = await getPredictedPasskeySignerAddress(
        publicKeyData
    )

    return {
        credentialId: bufferToHexString(credential.rawId),
        publicKey: publicKeyData,
        signerAddress: predictedSignerAddress,
    }
}

export const CreatePasskey = ({ onMsg }: Props) => {
    const [loadable, setLoadable] = useLazyLoadableData(createPasskeyCredential)

    switch (loadable.type) {
        case 'not_asked':
            return (
                <Story
                    stories={[
                        {
                            title: (
                                <FormattedMessage
                                    id="passkey-story.title"
                                    defaultMessage="Set up Passkey, no need for passwords or seed phrases"
                                />
                            ),
                            subtitle: (
                                <FormattedMessage
                                    id="passkey-story.subtitle"
                                    defaultMessage="Passkey technology uses the hardware security of your device. They’re more secure than passwords or seed phrases."
                                />
                            ),
                            artworkSrc: require('./wallet_stories/passkey_welcome.png'),
                        },
                    ]}
                    mainCtaTitle={
                        <FormattedMessage
                            id="passkey-story.cta"
                            defaultMessage="Create passkey"
                        />
                    }
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_stories_completed':
                                setLoadable({
                                    type: 'loading',
                                    params: undefined,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg.type)
                        }
                    }}
                />
            )
        case 'loading':
            return <LoadingLayout actionBar={null} />
        case 'loaded':
            return (
                <SuccessLayout
                    title={
                        <FormattedMessage
                            id="create-passkey.done.title"
                            defaultMessage="Passkey created"
                        />
                    }
                    onAnimationComplete={() =>
                        onMsg({
                            type: 'on_passkey_created',
                            passkey: loadable.data,
                        })
                    }
                />
            )
        case 'error':
            // FIXME @Nicvaniek implement
            throw new Error('Not implemented')
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
