// https://corporatefinanceinstitute.com/resources/knowledge/economics/currency-pair/

import { CurrencyId } from '@zeal/domains/Currency'

export type FXRate = {
    base: CurrencyId
    quote: CurrencyId
    rate: bigint
}
