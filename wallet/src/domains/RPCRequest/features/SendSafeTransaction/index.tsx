import { useState } from 'react'

import { CryptoCurrency } from '@zeal/domains/Currency'
import { SafeV0 } from '@zeal/domains/KeyStore'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { notReachable } from '@zeal/toolkit'
import { SafeDeploymentFork } from './SafeDeploymentFork'
import { SelectGasCurrency } from './SelectGasCurrency'
import { MsgOf } from '@zeal/toolkit/MsgOf'

type Props = {
    keyStore: SafeV0
    network: Network
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
    rpcRequestToBundle: EthSendTransaction
    portfolio: Portfolio
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof SafeDeploymentFork>

type State =
    | { type: 'select_gas_currency' }
    | { type: 'confirm'; gasCurrency: CryptoCurrency }

export const SendSafeTransaction = ({
    onMsg,
    keyStore,
    networkRPCMap,
    sessionPassword,
    rpcRequestToBundle,
    network,
    portfolio,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'select_gas_currency' })

    switch (state.type) {
        case 'confirm':
            return (
                <SafeDeploymentFork
                    gasCurrency={state.gasCurrency}
                    keyStore={keyStore}
                    network={network}
                    networkRPCMap={networkRPCMap}
                    onMsg={onMsg}
                    rpcRequestToBundle={rpcRequestToBundle}
                    sessionPassword={sessionPassword}
                />
            )

        case 'select_gas_currency':
            return (
                <SelectGasCurrency
                    network={network}
                    portfolio={portfolio}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg({ type: 'on_sign_cancel_button_clicked' }) // FIXME @resetko-zeal message remap, we can do better
                                break

                            case 'on_gas_currency_clicked':
                                setState({
                                    type: 'confirm',
                                    gasCurrency: msg.gasCurrency,
                                })
                                break

                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )

        default:
            return notReachable(state)
    }
}
