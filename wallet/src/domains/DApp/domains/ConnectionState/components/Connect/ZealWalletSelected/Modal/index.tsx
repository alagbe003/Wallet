import { Account, AccountsMap } from '@zeal/domains/Account'
import {
    ChangeAccount,
    Msg as ChangeAccountMsg,
} from 'src/domains/Account/features/ChangeAccount'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    Network,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { notReachable } from '@zeal/toolkit'
import { Modal as UIModal } from '@zeal/uikit/Modal'

import { AlternativeProvider } from '@zeal/domains/Main'
import { FormattedMessage } from 'react-intl'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { NetworkFilter } from 'src/domains/Network/features/Fillter'
import { ConnectionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { SafetyChecksPopup } from 'src/domains/SafetyCheck/components/SafetyChecksPopup'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Content } from 'src/uikit/Layout/Content'
import { Layout2 } from 'src/uikit/Layout/Layout2'

type Props = {
    state: State

    dAppSiteInfo: DAppSiteInfo

    networks: Network[]
    selectedNetwork: Network
    networkRPCMap: NetworkRPCMap
    accounts: AccountsMap
    selectedAccount: Account
    networkMap: NetworkMap
    alternativeProvider: AlternativeProvider
    currencyHiddenMap: CurrencyHiddenMap

    portfolios: PortfolioMap
    keystores: KeyStoreMap
    customCurrencyMap: CustomCurrencyMap
    sessionPassword: string

    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | ChangeAccountMsg
    | MsgOf<typeof NetworkFilter>
    | { type: 'connected_animation_complete' }

export type State =
    | { type: 'closed' }
    | { type: 'network_selector' }
    | { type: 'account_selector' }
    | { type: 'safety_checks'; safetyChecks: ConnectionSafetyCheck[] }
    | { type: 'connection_confirmation' }

export const Modal = ({
    state,
    networks,
    selectedNetwork,
    networkRPCMap,
    selectedAccount,
    accounts,
    portfolios,
    keystores,
    dAppSiteInfo,
    alternativeProvider,
    customCurrencyMap,
    sessionPassword,
    currencyHiddenMap,
    networkMap,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'connection_confirmation':
            return (
                <ConnectionSuccess
                    keystore={getKeyStore({
                        keyStoreMap: keystores,
                        address: selectedAccount.address,
                    })}
                    selectedNetwork={selectedNetwork}
                    selectedAccount={selectedAccount}
                    onMsg={onMsg}
                />
            )

        case 'network_selector':
            return (
                <UIModal>
                    <NetworkFilter
                        networkMap={networkMap}
                        currencyHiddenMap={currencyHiddenMap}
                        account={selectedAccount}
                        keyStoreMap={keystores}
                        portfolio={portfolios[selectedAccount.address]}
                        currentNetwork={
                            {
                                type: 'specific_network',
                                network: selectedNetwork,
                            } as CurrentNetwork
                        }
                        networkRPCMap={networkRPCMap}
                        networks={networks.map(
                            (network): CurrentNetwork => ({
                                type: 'specific_network',
                                network,
                            })
                        )}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'account_selector':
            return (
                <UIModal>
                    <ChangeAccount
                        alternativeProvider={alternativeProvider}
                        currencyHiddenMap={currencyHiddenMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        customCurrencyMap={customCurrencyMap}
                        sessionPassword={sessionPassword}
                        accounts={accounts}
                        portfolios={portfolios}
                        keystoreMap={keystores}
                        selectedProvider={{
                            type: 'zeal',
                            account: selectedAccount,
                        }}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'safety_checks':
            return (
                <SafetyChecksPopup
                    dAppSiteInfo={dAppSiteInfo}
                    onMsg={onMsg}
                    safetyChecks={state.safetyChecks}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}

const ConnectionSuccess = ({
    selectedNetwork,
    selectedAccount,
    keystore,
    onMsg,
}: {
    selectedNetwork: Network
    selectedAccount: Account
    keystore: KeyStore
    onMsg: (msg: { type: 'connected_animation_complete' }) => void
}) => {
    return (
        <UIModal>
            <Layout2 background="light" padding="form">
                <ActionBar
                    keystore={keystore}
                    network={selectedNetwork}
                    account={selectedAccount}
                />
                <Content
                    header={
                        <Content.Header
                            title={
                                <FormattedMessage
                                    id="connection_state.connect.expanded.title"
                                    defaultMessage="Connect"
                                />
                            }
                        />
                    }
                >
                    <Content.Splash
                        onAnimationComplete={() =>
                            onMsg({ type: 'connected_animation_complete' })
                        }
                        variant="success"
                        title={
                            <FormattedMessage
                                id="connection_state.connect.expanded.connected"
                                defaultMessage="Connected"
                            />
                        }
                    />
                </Content>
            </Layout2>
        </UIModal>
    )
}
