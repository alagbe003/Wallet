import { Account } from '@zeal/domains/Account'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { Network } from '@zeal/domains/Network'
import { WalletAddEthereumChain } from '@zeal/domains/RPCRequest'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Minimized } from 'src/uikit/Minimized'
import { Layout } from './Layout'
import { KeyStore } from '@zeal/domains/KeyStore'

type Props = {
    request: WalletAddEthereumChain
    account: Account
    dApp: DAppSiteInfo
    network: Network
    keyStore: KeyStore
    visualState: VisualState

    onMsg: (msg: Msg) => void
}

type VisualState = { type: 'minimised' } | { type: 'maximised' }

type Msg = MsgOf<typeof Minimized> | MsgOf<typeof Layout>

export const AddCustomNetwork = ({
    onMsg,
    account,
    dApp,
    network,
    request,
    visualState,
    keyStore,
}: Props) => {
    switch (visualState.type) {
        case 'minimised':
            return <Minimized onMsg={onMsg} />
        case 'maximised':
            return (
                <Layout
                    keyStore={keyStore}
                    request={request}
                    account={account}
                    dApp={dApp}
                    network={network}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(visualState)
    }
}
