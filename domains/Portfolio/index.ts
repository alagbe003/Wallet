import { KnownCurrencies } from '@zeal/domains/Currency'
import { Token } from '@zeal/domains/Token'
import { App } from '@zeal/domains/App'
import { PortfolioNFTCollection } from '@zeal/domains/NFTCollection'
import { Address } from '@zeal/domains/Address'

export type Portfolio = {
    currencies: KnownCurrencies
    tokens: Token[]
    apps: App[]
    nftCollections: PortfolioNFTCollection[]
}

export type PortfolioMap = Record<Address, Portfolio>
