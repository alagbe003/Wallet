import { notReachable } from '@zeal/toolkit'
import { Modal as UIModal } from '@zeal/uikit/Modal'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'
import {
    DetailsView,
    Msg as DetailsViewMsg,
} from 'src/domains/NFTCollection/components/DetailsView'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { PriceInfoPopup } from 'src/domains/NFTCollection/components/PriceInfoPopup'
import { Account } from '@zeal/domains/Account'
import { NetworkMap } from '@zeal/domains/Network'

type Props = {
    state: State
    account: Account
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' } | DetailsViewMsg

export type State =
    | { type: 'closed' }
    | { type: 'price_info_popup' }
    | {
          type: 'nft_detailed_view'
          nft: PortfolioNFT
          nftCollection: PortfolioNFTCollection
      }

export const Modal = ({
    state,
    knownCurrencies,
    account,
    networkMap,
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
                        knownCurrencies={knownCurrencies}
                    />
                </UIModal>
            )
        case 'price_info_popup':
            return <PriceInfoPopup onMsg={onMsg} />

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
