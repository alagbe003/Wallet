import { KeyStoreMap } from '@zeal/domains/KeyStore'

import { components } from '@zeal/api/portfolio'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'
import { notReachable } from '@zeal/toolkit'
import { SendSafeTransaction } from 'src/domains/RPCRequest/features/SendSafeTransaction'
import { SendTransaction } from 'src/domains/RPCRequest/features/SendTransaction'
import { MsgOf } from '@zeal/toolkit/MsgOf'

type Props = {
    network: Network
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
    portfolioMap: PortfolioMap
    sendTransactionRequest: EthSendTransaction

    account: Account
    dApp: DAppSiteInfo | null

    accounts: AccountsMap
    keystores: KeyStoreMap
    networkMap: NetworkMap
    feePresetMap: FeePresetMap
    installationId: string
    source: components['schemas']['TransactionSubmittedEventSource']

    fetchSimulationByRequest: ({
        network,
        rpcRequest,
    }: {
        network: Network
        rpcRequest: EthSendTransaction
    }) => Promise<SimulationResult> // FIXME @resetko-zeal this cannot be exported directly from regular SendTransaction feature

    state: State

    onMsg: (msg: Msg) => void
}

type State = { type: 'minimised' } | { type: 'maximised' }

type Msg = MsgOf<typeof SendSafeTransaction> | MsgOf<typeof SendTransaction>

// FIXME @resetko-zeal it should be some form inside current SendTransaction feature I think, separated for now just to reduce diff
export const SendRegularOrGasAbstractionTransaction = ({
    network,
    networkRPCMap,
    portfolioMap,
    sessionPassword,
    account,
    accounts,
    dApp,
    feePresetMap,
    fetchSimulationByRequest,
    installationId,
    keystores,
    networkMap,
    sendTransactionRequest,
    source,
    state,
    onMsg,
}: Props) => {
    const keyStore = getKeyStore({
        address: account.address,
        keyStoreMap: keystores,
    })

    switch (keyStore.type) {
        case 'safe_v0':
            return (
                <SendSafeTransaction
                    keyStore={keyStore}
                    network={network}
                    networkRPCMap={networkRPCMap}
                    portfolio={portfolioMap[account.address]} // FIXME @resetko-zeal will blowup without null check as everywhere else
                    rpcRequestToBundle={sendTransactionRequest}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
            )

        case 'private_key_store':
        case 'ledger':
        case 'secret_phrase_key':
        case 'trezor':
        case 'track_only':
            return (
                <SendTransaction
                    account={account}
                    accounts={accounts}
                    dApp={dApp}
                    feePresetMap={feePresetMap}
                    fetchSimulationByRequest={fetchSimulationByRequest}
                    installationId={installationId}
                    keystores={keystores}
                    network={network}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    sendTransactionRequest={sendTransactionRequest}
                    sessionPassword={sessionPassword}
                    source={source}
                    state={state}
                    onMsg={onMsg}
                />
            )

        default:
            return notReachable(keyStore)
    }
}
