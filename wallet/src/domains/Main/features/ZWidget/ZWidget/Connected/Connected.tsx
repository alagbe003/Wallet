import { useEffect } from 'react'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { Connected as ConnectedState } from 'src/domains/DApp/domains/ConnectionState'
import {
    Connected as ConnectedComponent,
    Msg as ConnectedComponentMsg,
} from 'src/domains/DApp/domains/ConnectionState/components/Connected'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { InteractionRequest } from '@zeal/domains/RPCRequest'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { notReachable } from '@zeal/toolkit'
import { Msg as VisualStateMsg, VisualState } from './VisualState'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { AlternativeProvider } from '@zeal/domains/Main'

type Props = {
    interactionRequest: InteractionRequest | null
    ethNetworkChange: Network
    networkRPCMap: NetworkRPCMap

    encryptedPassword: string

    installationId: string
    account: Account

    connectionState: ConnectedState
    alternativeProvider: AlternativeProvider
    accounts: AccountsMap
    portfolios: PortfolioMap
    customCurrencyMap: CustomCurrencyMap
    keystores: KeyStoreMap
    sessionPassword: string | null
    networkMap: NetworkMap
    feePresetMap: FeePresetMap
    currencyHiddenMap: CurrencyHiddenMap

    onMsg: (msg: Msg) => void
}

export type Msg = ConnectedComponentMsg | VisualStateMsg

export const Connected = ({
    account,
    interactionRequest,
    connectionState,
    accounts,
    keystores,
    portfolios,
    ethNetworkChange,
    networkRPCMap,
    alternativeProvider,
    sessionPassword,
    encryptedPassword,
    installationId,
    customCurrencyMap,
    networkMap,
    feePresetMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    useEffect(() => {
        if (interactionRequest) {
            switch (interactionRequest.method) {
                case 'eth_requestAccounts':
                    captureError(
                        new ImperativeError(
                            'Got eth_requestAccounts in connected state'
                        )
                    )
                    break
                case 'eth_sendTransaction':
                case 'eth_signTypedData_v4':
                case 'eth_signTypedData_v3':
                case 'eth_signTypedData':
                case 'personal_sign':
                case 'wallet_addEthereumChain':
                    break
                /* istanbul ignore next */
                default:
                    return notReachable(interactionRequest)
            }
        }
    }, [interactionRequest])

    if (interactionRequest) {
        return (
            <VisualState
                portfolioMap={portfolios}
                feePresetMap={feePresetMap}
                networkMap={networkMap}
                installationId={installationId}
                accounts={accounts}
                keystores={keystores}
                key={interactionRequest.id}
                encryptedPassword={encryptedPassword}
                sessionPassword={sessionPassword}
                account={account}
                network={ethNetworkChange}
                networkRPCMap={networkRPCMap}
                keyStore={getKeyStore({
                    keyStoreMap: keystores,
                    address: account.address,
                })}
                interactionRequest={interactionRequest}
                connectionState={connectionState}
                onMsg={onMsg}
            />
        )
    } else {
        return (
            <ConnectedComponent
                alternativeProvider={alternativeProvider}
                currencyHiddenMap={currencyHiddenMap}
                networkMap={networkMap}
                customCurrencyMap={customCurrencyMap}
                selectedNetwork={ethNetworkChange}
                networkRPCMap={networkRPCMap}
                selectedAccount={account}
                sessionPassword={sessionPassword}
                encryptedPassword={encryptedPassword}
                connectionState={connectionState}
                keystores={keystores}
                accounts={accounts}
                portfolios={portfolios}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'account_item_clicked':
                        case 'add_wallet_clicked':
                        case 'disconnect_button_click':
                        case 'drag':
                        case 'expanded':
                        case 'hardware_wallet_clicked':
                        case 'minimized':
                        case 'on_account_create_request':
                        case 'on_continue_with_meta_mask':
                        case 'on_network_item_click':
                        case 'on_rpc_change_confirmed':
                        case 'on_select_rpc_click':
                        case 'session_password_decrypted':
                        case 'track_wallet_clicked':
                            onMsg(msg)
                            break

                        default:
                            notReachable(msg)
                    }
                }}
            />
        )
    }
}
