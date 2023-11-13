import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'
import { IconButton } from 'src/uikit'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column2 } from 'src/uikit/Column2'
import { Group } from 'src/uikit/Group'
import { Header } from 'src/uikit/Header'
import { CustomLedger } from 'src/uikit/Icon/CustomLedger'
import { CustomTrezor } from 'src/uikit/Icon/CustomTrezor'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { ForwardIcon } from 'src/uikit/Icon/Navigation/ForwardIcon'
import { Screen } from '@zeal/uikit/Screen'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'

import { AddFromTrezor } from './AddFromTrezor'
import { Ledger } from './Ledger'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

type Props = {
    accounts: AccountsMap
    keystoreMap: KeyStoreMap
    sessionPassword: string
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    closable: boolean
    onMsg: (msg: Msg) => void
}

type State =
    | { type: 'select_type_of_wallet' }
    | { type: 'ledger_flow' }
    | { type: 'trezor_flow' }

export type Msg =
    | { type: 'close' }
    | Extract<
          MsgOf<typeof Ledger>,
          {
              type:
                  | 'on_account_create_request'
                  | 'on_accounts_create_success_animation_finished'
          }
      >
    | Extract<
          MsgOf<typeof AddFromTrezor>,
          {
              type:
                  | 'on_account_create_request'
                  | 'on_accounts_create_success_animation_finished'
          }
      >

export const AddFromHardwareWallet = ({
    accounts,
    keystoreMap,
    customCurrencies,
    sessionPassword,
    networkMap,
    networkRPCMap,
    closable,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'select_type_of_wallet' })

    switch (state.type) {
        case 'select_type_of_wallet':
            return (
                <Screen background="light" padding="form">
                    <ActionBar
                        left={
                            closable && (
                                <IconButton
                                    onClick={() => onMsg({ type: 'close' })}
                                >
                                    <BackIcon size={24} />
                                </IconButton>
                            )
                        }
                    />

                    <Column2 style={{ overflowY: 'auto' }} spacing={24}>
                        <Header
                            title={
                                <FormattedMessage
                                    id="AddFromHardwareWallet.title"
                                    defaultMessage="Hardware Wallet"
                                />
                            }
                            subtitle={
                                <FormattedMessage
                                    id="AddFromHardwareWallet.subtitle"
                                    defaultMessage="Select you hardware wallet to connect to Zeal"
                                />
                            }
                        />

                        <Group variant="default">
                            <ListItem2
                                size="regular"
                                aria-selected={false}
                                avatar={({ size }) => (
                                    <CustomLedger
                                        color="iconAccent2"
                                        size={size}
                                    />
                                )}
                                onClick={() =>
                                    setState({ type: 'ledger_flow' })
                                }
                                primaryText="Ledger"
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
                                avatar={({ size }) => (
                                    <CustomTrezor
                                        color="iconAccent2"
                                        size={size}
                                    />
                                )}
                                onClick={() =>
                                    setState({ type: 'trezor_flow' })
                                }
                                primaryText="Trezor"
                                side={{
                                    rightIcon: ({ size }) => (
                                        <ForwardIcon
                                            size={size}
                                            color="iconDefault"
                                        />
                                    ),
                                }}
                            />
                        </Group>
                    </Column2>
                </Screen>
            )

        case 'ledger_flow':
            return (
                <Ledger
                    currencyHiddenMap={currencyHiddenMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    customCurrencies={customCurrencies}
                    sessionPassword={sessionPassword}
                    accounts={values(accounts)}
                    keystoreMap={keystoreMap}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_account_create_request':
                            case 'on_accounts_create_success_animation_finished':
                                onMsg(msg)
                                break

                            case 'close':
                                setState({ type: 'select_type_of_wallet' })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'trezor_flow':
            return (
                <AddFromTrezor
                    currencyHiddenMap={currencyHiddenMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    customCurrencies={customCurrencies}
                    accounts={values(accounts)}
                    keystoreMap={keystoreMap}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_account_create_request':
                            case 'on_accounts_create_success_animation_finished':
                                onMsg(msg)
                                break

                            case 'close':
                                setState({ type: 'select_type_of_wallet' })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
