import { Account, AccountsMap } from '@zeal/domains/Account'
import { generateAccountsLabels } from '@zeal/domains/Account/helpers/generateAccountsLabel'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { SafeV0 } from '@zeal/domains/KeyStore'
import { generateSecretPhrase } from '@zeal/domains/KeyStore/helpers/generateSecretPhrase'
import { generateSecretPhraseAddressOnPath } from '@zeal/domains/KeyStore/helpers/generateSecretPhraseAddress'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { POLYGON } from '@zeal/domains/Network/constants'
import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { values } from '@zeal/toolkit/Object'
import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { AppErrorPopup } from 'src/domains/Error/components/AppErrorPopup'
import { LoadingLayout } from 'src/uikit/LoadingLayout'
import { SuccessLayout } from 'src/uikit/SuccessLayout'
import { getPredictedSafeInstance } from 'src/domains/KeyStore/helpers/getPredictedSafeInstance'
import { PasskeyV0 } from './CreatePasskey'

type Props = {
    accountsMap: AccountsMap
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
    passkey: PasskeyV0

    onMsg: (msg: Msg) => void
}

type Msg =
    | {
          type: 'on_account_create_request'
          accountsWithKeystores: {
              account: Account
              keystore: SafeV0
          }[]
      }
    | {
          type: 'on_accounts_create_success_animation_finished'
          accountsWithKeystores: {
              account: Account
              keystore: SafeV0
          }[]
      }

const DEFAULT_SAFE_BIP_PATH = `m/44'/60'/0'/0/0`

const configureSafe = async ({
    networkRPCMap,
    network,
    sessionPassword,
}: {
    networkRPCMap: NetworkRPCMap
    network: Network
    sessionPassword: string
    passkey: PasskeyV0
}): Promise<SafeV0> => {
    // FIXME @Nicvaniek replace PK owner with passkeySigner + add passkey details to SafeKeyStore
    const encryptedPhrase = await generateSecretPhrase({ sessionPassword })

    const secretPhraseAddress = await generateSecretPhraseAddressOnPath({
        encryptedPhrase,
        path: DEFAULT_SAFE_BIP_PATH,
        sessionPassword,
    })

    const safeDeplymentConfig: SafeV0['safeDeplymentConfig'] = {
        ownerKeyStore: {
            type: 'secret_phrase_key',
            bip44Path: secretPhraseAddress.path,
            confirmed: false,
            encryptedPhrase,
            googleDriveFile: null,
        },
        saltNonce: secretPhraseAddress.address,
        threshold: 1,
    }

    const safe = await getPredictedSafeInstance({
        safeDeplymentConfig,
        network,
        networkRPCMap,
        sessionPassword,
    })

    const address = await safe.getAddress()

    return {
        type: 'safe_v0',
        address,
        safeDeplymentConfig,
    }
}

export const CreateSafe = ({
    accountsMap,
    networkRPCMap,
    passkey,
    sessionPassword,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(configureSafe, {
        type: 'loading',
        params: {
            networkRPCMap,
            passkey,
            network: POLYGON, // FIXME @resetko-zeal we predict on polygon, because we don't have safe selected at the point of configuration
            sessionPassword,
        },
    })

    const onMsgLive = useLiveRef(onMsg)
    const accountsMapLive = useLiveRef(accountsMap)

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
            case 'error':
                break
            case 'loaded':
                onMsgLive.current({
                    type: 'on_account_create_request',
                    accountsWithKeystores: [
                        {
                            account: {
                                address: loadable.data.address,
                                label: generateAccountsLabels(
                                    values(accountsMapLive.current),
                                    'Safe',
                                    1
                                )[0],
                                avatarSrc: null,
                            },
                            keystore: loadable.data,
                        },
                    ],
                })
                // FIXME @resetko-zeal
                // eslint-disable-next-line no-console
                console.log('Predicted address: ', loadable.data)
                break

            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [accountsMapLive, loadable, onMsgLive])

    switch (loadable.type) {
        case 'loading':
            // FIXME @resetko-zeal - add loading state
            return <LoadingLayout actionBar={null} />
        case 'loaded':
            return (
                <SuccessLayout
                    title={
                        <FormattedMessage
                            id="safe-creation.success.title"
                            defaultMessage="Safe configured"
                        />
                    }
                    onAnimationComplete={() =>
                        onMsg({
                            type: 'on_accounts_create_success_animation_finished',
                            accountsWithKeystores: [
                                {
                                    account: {
                                        address: loadable.data.address,
                                        label: generateAccountsLabels(
                                            values(accountsMap),
                                            'Safe',
                                            1
                                        )[0],
                                        avatarSrc: null,
                                    },
                                    keystore: loadable.data,
                                },
                            ],
                        })
                    }
                />
            )
        case 'error':
            return (
                <AppErrorPopup
                    error={parseAppError(loadable.error)}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                // FIXME @resetko-zeal
                                break

                            case 'try_again_clicked':
                                setLoadable({
                                    type: 'loading',
                                    params: loadable.params,
                                })
                                break

                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
