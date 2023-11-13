import { Account } from '@zeal/domains/Account'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStore } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import {
    EthSignTypedData,
    EthSignTypedDataV3,
    EthSignTypedDataV4,
    PersonalSign,
} from '@zeal/domains/RPCRequest'
import { notReachable } from '@zeal/toolkit'
import { Minimized, Msg as MinimizedMsg } from 'src/uikit/Minimized'

import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Layout } from './Layout'

type Props = {
    keyStore: KeyStore
    request:
        | PersonalSign
        | EthSignTypedDataV4
        | EthSignTypedData
        | EthSignTypedDataV3

    isLoading: boolean

    account: Account
    dApp: DAppSiteInfo
    network: Network

    state: State

    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof Layout> | MinimizedMsg

export type State = { type: 'minimised' } | { type: 'maximised' }

// TODO @resetko-zeal we can remove this and have simulation always pass to unknown
export const NoSimulation = ({
    account,
    request,
    keyStore,
    dApp,
    state,
    network,
    isLoading,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'minimised':
            return <Minimized onMsg={onMsg} />
        case 'maximised':
            return (
                <Layout
                    isLoading={isLoading}
                    keyStore={keyStore}
                    request={request}
                    dApp={dApp}
                    account={account}
                    network={network}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
