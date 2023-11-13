import { FormattedMessage } from 'react-intl'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { BoldHistory } from 'src/uikit/Icon/BoldHistory'
import { BoldNewWallet } from 'src/uikit/Icon/BoldNewWallet'
import { BoldTrackWallet } from 'src/uikit/Icon/BoldTrackWallet'
import { ForwardIcon } from '@zeal/uikit/Icon/ForwardIcon'
import { OutlinedInterfaceLink } from 'src/uikit/Icon/OutlinedInterfaceLink'
import { ListItem } from '@zeal/uikit/ListItem'
import { Popup } from '@zeal/uikit/Popup'
import { isLocal } from '@zeal/toolkit/Environment/isLocal'
import { isDevelopment } from '@zeal/toolkit/Environment/isDevelopment'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'track_wallet_clicked' }
    | { type: 'add_wallet_clicked' }
    | { type: 'create_clicked' }
    | { type: 'hardware_wallet_clicked' }
    | { type: 'safe_wallet_clicked' }

export const SelectTypeOfAccountToAdd = ({ onMsg }: Props) => {
    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                title={
                    <FormattedMessage
                        id="account.select_type_of_account.header"
                        defaultMessage="Add wallet"
                    />
                }
            />
            <Popup.Content>
                <Column spacing={24}>
                    <Group variant="default">
                        {(isDevelopment() || isLocal()) && (
                            <ListItem
                                size="regular"
                                aria-selected={false}
                                avatar={({ size }) => (
                                    <OutlinedInterfaceLink
                                        size={size}
                                        color="iconAccent2"
                                    />
                                )}
                                primaryText={
                                    <FormattedMessage
                                        id="account.select_type_of_account.hardware_wallet"
                                        defaultMessage="Safe wallet"
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
                                onClick={() =>
                                    onMsg({ type: 'safe_wallet_clicked' })
                                }
                            />
                        )}
                        <ListItem
                            size="regular"
                            aria-selected={false}
                            avatar={({ size }) => (
                                <BoldNewWallet
                                    size={size}
                                    color="iconAccent2"
                                />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="account.select_type_of_account.create"
                                    defaultMessage="Create"
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
                            onClick={() => onMsg({ type: 'create_clicked' })}
                        />

                        <ListItem
                            size="regular"
                            aria-selected={false}
                            avatar={({ size }) => (
                                <BoldHistory size={size} color="iconAccent2" />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="account.select_type_of_account.wallet"
                                    defaultMessage="Import / Restore"
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
                            onClick={() =>
                                onMsg({ type: 'add_wallet_clicked' })
                            }
                        />

                        <ListItem
                            size="regular"
                            aria-selected={false}
                            avatar={({ size }) => (
                                <OutlinedInterfaceLink
                                    size={size}
                                    color="iconAccent2"
                                />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="account.select_type_of_account.hardware_wallet"
                                    defaultMessage="Hardware Wallet"
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
                            onClick={() =>
                                onMsg({ type: 'hardware_wallet_clicked' })
                            }
                        />
                    </Group>

                    <Group variant="default">
                        <ListItem
                            size="regular"
                            aria-selected={false}
                            avatar={({ size }) => (
                                <BoldTrackWallet
                                    size={size}
                                    color="iconAccent2"
                                />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="account.select_type_of_account.track"
                                    defaultMessage="Track"
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
                            onClick={() =>
                                onMsg({ type: 'track_wallet_clicked' })
                            }
                        />
                    </Group>
                </Column>
            </Popup.Content>
        </Popup.Layout>
    )
}
