import { Modal as UIModal } from '@zeal/uikit/Modal'
import { notReachable } from '@zeal/toolkit'
import { Account } from '@zeal/domains/Account'
import {
    Msg as TokenListMsg,
    TokenList,
} from 'src/domains/Token/components/TokenList'
import { Portfolio } from '@zeal/domains/Portfolio'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { AppsList } from 'src/domains/App/components/AppsList'
import {
    AllNFTsList,
    Msg as AllNFTsListMsg,
} from 'src/domains/NFTCollection/components/AllNFTsList'
import { KeyStore } from '@zeal/domains/KeyStore'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'
import { DetailsView } from 'src/domains/NFTCollection/components/DetailsView'
import { AddFunds } from './AddFunds'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { App } from '@zeal/domains/App'
import { AppPositionDetails } from 'src/domains/App/components/AppPositionDetails'

type Props = {
    state: State
    account: Account
    currentNetwork: CurrentNetwork
    portfolio: Portfolio
    keystore: KeyStore
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | TokenListMsg
    | AllNFTsListMsg
    | MsgOf<typeof AddFunds>
    | MsgOf<typeof AppsList>

export type State =
    | { type: 'closed' }
    | { type: 'show_all_tokens' }
    | { type: 'show_all_apps' }
    | { type: 'show_all_nfts' }
    | {
          type: 'nft_detailed_view'
          nft: PortfolioNFT
          nftCollection: PortfolioNFTCollection
      }
    | { type: 'add_funds' }
    | { type: 'app_position'; app: App }

export const Modal = ({
    state,
    account,
    currentNetwork,
    portfolio,
    keystore,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    currencyPinMap,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'nft_detailed_view':
            return (
                <UIModal>
                    <DetailsView
                        networkMap={networkMap}
                        account={account}
                        onMsg={onMsg}
                        nft={state.nft}
                        nftCollection={state.nftCollection}
                        knownCurrencies={portfolio.currencies}
                    />
                </UIModal>
            )
        case 'show_all_nfts':
            return (
                <UIModal>
                    <AllNFTsList
                        currencyHiddenMap={currencyHiddenMap}
                        networkMap={networkMap}
                        keystore={keystore}
                        portfolio={portfolio}
                        nftCollections={portfolio.nftCollections}
                        account={account}
                        currincies={portfolio.currencies}
                        selectedNetwork={currentNetwork}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        case 'show_all_apps':
            return (
                <UIModal>
                    <AppsList
                        networkMap={networkMap}
                        keystore={keystore}
                        apps={portfolio.apps}
                        currincies={portfolio.currencies}
                        account={account}
                        selectedNetwork={currentNetwork}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        case 'show_all_tokens':
            return (
                <UIModal>
                    <TokenList
                        currencyHiddenMap={currencyHiddenMap}
                        currencyPinMap={currencyPinMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        keystore={keystore}
                        portfolio={portfolio}
                        account={account}
                        selectedNetwork={currentNetwork}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'add_funds':
            return <AddFunds onMsg={onMsg} />

        case 'app_position':
            return (
                <UIModal>
                    <AppPositionDetails
                        account={account}
                        keystore={keystore}
                        networkMap={networkMap}
                        knownCurrencies={portfolio.currencies}
                        app={state.app}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
