import { Account, AccountsMap } from '@zeal/domains/Account'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { InteractionRequest } from '@zeal/domains/RPCRequest'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { fetchSimulationByRequest } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Connected as ConnectedState } from 'src/domains/DApp/domains/ConnectionState'
import {
    LockScreen,
    Msg as LockScreenMsg,
} from 'src/domains/Password/features/LockScreen'
import { AddCustomNetwork } from 'src/domains/RPCRequest/features/AddCustomNetwork'
import { SendRegularOrGasAbstractionTransaction } from 'src/domains/RPCRequest/features/SendRegularOrGasAbstractionTransaction'
import { State as SendTransactionState } from 'src/domains/RPCRequest/features/SendTransaction'
import { Sign, Msg as SignMsg } from 'src/domains/RPCRequest/features/Sign'

type Props = {
    encryptedPassword: string
    sessionPassword: string | null

    account: Account
    network: Network
    keyStore: KeyStore

    accounts: AccountsMap
    keystores: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    portfolioMap: PortfolioMap

    interactionRequest: InteractionRequest

    connectionState: ConnectedState
    state: State

    installationId: string

    onMsg: (msg: Msg) => void
}

export type State = SendTransactionState

export type Msg =
    | LockScreenMsg
    | MsgOf<typeof SendRegularOrGasAbstractionTransaction>
    | SignMsg
    | MsgOf<typeof AddCustomNetwork>

type InternalState =
    | { type: 'locked' }
    | { type: 'unlocked'; sessionPassword: string }

const calculateState = ({
    sessionPassword,
}: {
    sessionPassword: string | null
}): InternalState => {
    if (sessionPassword) {
        return { type: 'unlocked', sessionPassword }
    }
    return { type: 'locked' }
}

export const AccessChecker = ({
    account,
    keyStore,
    connectionState,
    interactionRequest,
    network,
    sessionPassword,
    encryptedPassword,
    state,
    accounts,
    keystores,
    installationId,
    networkMap,
    networkRPCMap,
    feePresetMap,
    portfolioMap,
    onMsg,
}: Props) => {
    const internalState = calculateState({ sessionPassword })

    switch (internalState.type) {
        case 'locked':
            return (
                <LockScreen
                    encryptedPassword={encryptedPassword}
                    onMsg={onMsg}
                />
            )
        case 'unlocked':
            switch (interactionRequest.method) {
                case 'eth_requestAccounts':
                    return null
                case 'eth_sendTransaction':
                    return (
                        <SendRegularOrGasAbstractionTransaction
                            portfolioMap={portfolioMap}
                            feePresetMap={feePresetMap}
                            networkMap={networkMap}
                            networkRPCMap={networkRPCMap}
                            source="zwidget"
                            fetchSimulationByRequest={fetchSimulationByRequest}
                            installationId={installationId}
                            accounts={accounts}
                            keystores={keystores}
                            state={state}
                            account={account}
                            dApp={connectionState.dApp}
                            network={network}
                            sendTransactionRequest={interactionRequest}
                            sessionPassword={internalState.sessionPassword}
                            onMsg={onMsg}
                        />
                    )

                case 'eth_signTypedData_v4':
                case 'eth_signTypedData_v3':
                case 'eth_signTypedData':
                case 'personal_sign':
                    return (
                        <Sign
                            networkMap={networkMap}
                            state={state}
                            sessionPassword={internalState.sessionPassword}
                            keyStore={keyStore}
                            request={interactionRequest}
                            account={account}
                            dApp={connectionState.dApp}
                            network={network}
                            onMsg={onMsg}
                        />
                    )

                case 'wallet_addEthereumChain':
                    return (
                        <AddCustomNetwork
                            request={interactionRequest}
                            visualState={state}
                            account={account}
                            dApp={connectionState.dApp}
                            network={network}
                            onMsg={onMsg}
                            keyStore={keyStore}
                        />
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(interactionRequest)
            }

        /* istanbul ignore next */
        default:
            return notReachable(internalState)
    }
}
