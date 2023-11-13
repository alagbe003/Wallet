import { useState } from 'react'

import { Account, AccountsMap } from '@zeal/domains/Account'
import {
    FetchPortfolioRequest,
    FetchPortfolioResponse,
} from '@zeal/domains/Account/api/fetchAccounts'
import { ConnectionMap } from 'src/domains/DApp/domains/ConnectionState'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Manifest } from 'src/domains/Manifest'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { notReachable } from '@zeal/toolkit'
import { ReloadableData } from '@zeal/toolkit/LoadableData/ReloadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Layout } from './Layout'
import { Modal, Msg as ModalMsg, State as ModalState } from './Modal'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

type Props = {
    manifest: Manifest
    portfolioLoadable: ReloadableData<
        FetchPortfolioResponse,
        FetchPortfolioRequest
    >
    currentAccount: Account
    currentNetwork: CurrentNetwork
    networkRPCMap: NetworkRPCMap

    keystoreMap: KeyStoreMap
    encryptedPassword: string
    sessionPassword: string

    accounts: AccountsMap
    portfolios: PortfolioMap

    networkMap: NetworkMap

    connections: ConnectionMap
    currencyHiddenMap: CurrencyHiddenMap

    onMsg: (msg: Msg) => void
}

export type Msg =
    | Exclude<ModalMsg, { type: 'close' }>
    | Extract<
          MsgOf<typeof Layout>,
          {
              type:
                  | 'on_lock_zeal_click'
                  | 'add_new_account_click'
                  | 'track_wallet_clicked'
          }
      >

// TODO :: we need to refucktor this to bring Account / Network selectors modal upper in the tree

export const Settings = ({
    manifest,
    onMsg,
    currentNetwork,
    networkRPCMap,
    currentAccount,
    portfolioLoadable,
    keystoreMap,
    encryptedPassword,
    accounts,
    connections,
    portfolios,
    networkMap,
    currencyHiddenMap,
    sessionPassword,
}: Props) => {
    const [state, setState] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                currencyHiddenMap={currencyHiddenMap}
                keystore={getKeyStore({
                    keyStoreMap: keystoreMap,
                    address: currentAccount.address,
                })}
                manifest={manifest}
                portfolioLoadable={portfolioLoadable}
                currentAccount={currentAccount}
                currentNetwork={currentNetwork}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_lock_zeal_click':
                        case 'add_new_account_click':
                            onMsg(msg)
                            break
                        case 'on_manage_connections_click':
                            setState({ type: 'manage_connections' })
                            break
                        case 'account_filter_click':
                            setState({ type: 'account_filter' })
                            break
                        case 'network_filter_click':
                            setState({ type: 'network_filter' })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                sessionPassword={sessionPassword}
                currencyHiddenMap={currencyHiddenMap}
                networkMap={networkMap}
                state={state}
                accounts={accounts}
                portfolios={portfolios}
                selectedNetwork={currentNetwork}
                networkRPCMap={networkRPCMap}
                account={currentAccount}
                keystoreMap={keystoreMap}
                encryptedPassword={encryptedPassword}
                connections={connections}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setState({ type: 'closed' })
                            break

                        case 'on_account_label_change_submit':
                        case 'on_recovery_kit_setup':
                        case 'add_new_account_click':
                        case 'track_wallet_clicked':
                        case 'on_rpc_change_confirmed':
                        case 'on_select_rpc_click':
                            onMsg(msg)
                            break
                        case 'on_account_create_request':
                        case 'account_item_clicked':
                        case 'confirm_account_delete_click':
                        case 'on_network_item_click':
                        case 'on_disconnect_dapps_click':
                        case 'on_delete_all_dapps_confirm_click':
                            setState({ type: 'closed' })
                            onMsg(msg)

                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
        </>
    )
}
