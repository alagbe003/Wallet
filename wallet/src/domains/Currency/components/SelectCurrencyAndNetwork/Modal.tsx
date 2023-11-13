import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Account } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Portfolio } from '@zeal/domains/Portfolio'
import { Modal as UIModal } from '@zeal/uikit/Modal'
import { NetworkFilter } from 'src/domains/Network/features/Fillter'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

type Props = {
    state: State

    account: Account
    keyStoreMap: KeyStoreMap
    portfolio: Portfolio

    networks: CurrentNetwork[]
    currentNetwork: CurrentNetwork
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    networkMap: NetworkMap

    onMsg: (msg: Msg) => void
}

export type State = { type: 'closed' } | { type: 'select_network' }

type Msg = MsgOf<typeof NetworkFilter>

export const Modal = ({
    state,
    networks,
    account,
    currentNetwork,
    networkRPCMap,
    keyStoreMap,
    portfolio,
    currencyHiddenMap,
    networkMap,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'select_network': {
            return (
                <UIModal>
                    <NetworkFilter
                        networkMap={networkMap}
                        currencyHiddenMap={currencyHiddenMap}
                        account={account}
                        currentNetwork={currentNetwork}
                        networkRPCMap={networkRPCMap}
                        keyStoreMap={keyStoreMap}
                        networks={networks}
                        portfolio={portfolio}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        }

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
