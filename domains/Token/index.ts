import { NetworkHexId } from '@zeal/domains/Network'
import { Money } from '@zeal/domains/Money'
import { FXRate } from '@zeal/domains/FXRate'
import { Address } from '@zeal/domains/Address'

type PriceChange24H =
    | { direction: 'Unchanged' }
    | { direction: 'Up'; percentage: number }
    | { direction: 'Down'; percentage: number }

export type Token = {
    networkHexId: NetworkHexId
    balance: Money
    //TODO remove address and network should be got from KnownCurrencies when needed
    address: Address
    rate: FXRate | null
    priceInDefaultCurrency: Money | null
    marketData: null | { priceChange24h: PriceChange24H }
    scam: boolean
}
