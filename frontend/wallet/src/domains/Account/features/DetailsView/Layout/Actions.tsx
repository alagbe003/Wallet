import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { KeyStore, PrivateKey, SecretPhrase } from '@zeal/domains/KeyStore'
import { recoveryKitStatus } from '@zeal/domains/KeyStore/helpers/recoveryKitStatus'
import { notReachable } from '@zeal/toolkit'
import { Column2 } from 'src/uikit/Column2'
import { Group } from 'src/uikit/Group'
import { BoldNewWallet } from 'src/uikit/Icon/BoldNewWallet'
import { BoldPaper } from 'src/uikit/Icon/BoldPaper'
import { InfoCircle } from 'src/uikit/Icon/InfoCircle'
import { ForwardIcon } from 'src/uikit/Icon/Navigation/ForwardIcon'
import { ShieldFail } from 'src/uikit/Icon/ShieldFail'
import { SolidStatusKey } from 'src/uikit/Icon/SolidStatusKey'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'

type Props = {
    keystore: KeyStore
    account: Account
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_account_delete_click' }
    | { type: 'on_add_private_key_click' }
    | { type: 'on_show_secret_phrase_click'; keystore: SecretPhrase }
    | {
          type: 'on_recovery_kit_setup'
          keystore: SecretPhrase
          address: Address
      }
    | { type: 'on_show_private_key_click'; keystore: PrivateKey | SecretPhrase }

export const Actions = ({ keystore, account, onMsg }: Props) => {
    switch (keystore.type) {
        case 'safe_v0': // FIXME @resetko-zeal - Safe implementation
            return (
                <Group variant="default">
                    <Column2 spacing={8}>
                        <Delete
                            onClick={() =>
                                onMsg({ type: 'on_account_delete_click' })
                            }
                        />
                    </Column2>
                    <ListItem2
                        size="regular"
                        aria-selected={false}
                        onClick={() => {
                            onMsg({
                                type: 'on_show_secret_phrase_click',
                                keystore:
                                    keystore.safeDeplymentConfig.ownerKeyStore,
                            })
                        }}
                        avatar={({ size }) => (
                            <BoldPaper size={size} color="iconAccent2" />
                        )}
                        primaryText={
                            <FormattedMessage
                                id="storage.accountDetails.viewSsecretPhrase"
                                defaultMessage="View Secret Phrase"
                            />
                        }
                        side={{
                            rightIcon: ({ size }) => (
                                <ForwardIcon size={size} color="iconDefault" />
                            ),
                        }}
                    />
                </Group>
            )

        case 'track_only':
            return (
                <Group variant="default">
                    <Column2 spacing={8}>
                        <ListItem2
                            size="regular"
                            aria-selected={false}
                            onClick={() =>
                                onMsg({ type: 'on_add_private_key_click' })
                            }
                            avatar={({ size }) => (
                                <BoldNewWallet
                                    size={size}
                                    color="iconAccent2"
                                />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="storage.accountDetails.activateWallet"
                                    defaultMessage="Activate wallet"
                                />
                            }
                            side={{
                                rightIcon: ({ size }) => (
                                    <ForwardIcon
                                        size={size}
                                        color="iconDefault"
                                    />
                                ),
                            }}
                        />

                        <Delete
                            onClick={() =>
                                onMsg({ type: 'on_account_delete_click' })
                            }
                        />
                    </Column2>
                </Group>
            )

        case 'private_key_store':
            return (
                <Group variant="default">
                    <Column2 spacing={8}>
                        <ShowPrivateKey
                            onClick={() =>
                                onMsg({
                                    type: 'on_show_private_key_click',
                                    keystore,
                                })
                            }
                        />

                        <Delete
                            onClick={() =>
                                onMsg({ type: 'on_account_delete_click' })
                            }
                        />
                    </Column2>
                </Group>
            )

        case 'trezor':
        case 'ledger':
            return (
                <Group variant="default">
                    <Column2 spacing={8}>
                        <Delete
                            onClick={() =>
                                onMsg({ type: 'on_account_delete_click' })
                            }
                        />
                    </Column2>
                </Group>
            )

        case 'secret_phrase_key':
            return (
                <Group variant="default">
                    <Column2 spacing={8}>
                        <ListItem2
                            size="regular"
                            aria-selected={false}
                            onClick={() => {
                                onMsg({
                                    type: 'on_recovery_kit_setup',
                                    keystore,
                                    address: account.address,
                                })
                            }}
                            avatar={({ size }) => (
                                <InfoCircle
                                    size={size}
                                    color={(() => {
                                        const status =
                                            recoveryKitStatus(keystore)
                                        switch (status) {
                                            case 'configured':
                                                return 'iconAccent2'
                                            case 'not_configured':
                                                return 'iconStatusWarning'
                                            /* istanbul ignore next */
                                            default:
                                                return notReachable(status)
                                        }
                                    })()}
                                />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="storage.accountDetails.setup_recovery_kit"
                                    defaultMessage="Recovery Kit"
                                />
                            }
                            side={{
                                rightIcon: ({ size }) => (
                                    <ForwardIcon
                                        size={size}
                                        color="iconDefault"
                                    />
                                ),
                            }}
                        />
                        <ListItem2
                            size="regular"
                            aria-selected={false}
                            onClick={() => {
                                onMsg({
                                    type: 'on_show_secret_phrase_click',
                                    keystore,
                                })
                            }}
                            avatar={({ size }) => (
                                <BoldPaper size={size} color="iconAccent2" />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="storage.accountDetails.viewSsecretPhrase"
                                    defaultMessage="View Secret Phrase"
                                />
                            }
                            side={{
                                rightIcon: ({ size }) => (
                                    <ForwardIcon
                                        size={size}
                                        color="iconDefault"
                                    />
                                ),
                            }}
                        />

                        <ShowPrivateKey
                            onClick={() =>
                                onMsg({
                                    type: 'on_show_private_key_click',
                                    keystore,
                                })
                            }
                        />

                        <Delete
                            onClick={() =>
                                onMsg({ type: 'on_account_delete_click' })
                            }
                        />
                    </Column2>
                </Group>
            )

        /* istanbul ignore next */
        default:
            return notReachable(keystore)
    }
}

const Delete = ({ onClick }: { onClick: () => void }) => (
    <ListItem2
        size="regular"
        aria-selected={false}
        onClick={onClick}
        avatar={({ size }) => <ShieldFail size={size} color="iconAccent2" />}
        primaryText={
            <FormattedMessage
                id="storage.accountDetails.deleteWallet"
                defaultMessage="Remove wallet"
            />
        }
        side={{
            rightIcon: ({ size }) => (
                <ForwardIcon size={size} color="iconDefault" />
            ),
        }}
    />
)

const ShowPrivateKey = ({ onClick }: { onClick: () => void }) => (
    <ListItem2
        size="regular"
        aria-selected={false}
        onClick={onClick}
        avatar={({ size }) => (
            <SolidStatusKey size={size} color="iconAccent2" />
        )}
        primaryText={
            <FormattedMessage
                id="storage.accountDetails.privateKey"
                defaultMessage="Private Key"
            />
        }
        side={{
            rightIcon: ({ size }) => (
                <ForwardIcon size={size} color="iconDefault" />
            ),
        }}
    />
)
