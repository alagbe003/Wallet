import { Account } from '@zeal/domains/Account'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { sumPortfolio } from '@zeal/domains/Portfolio/helpers/sum'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

export const sortByBalance =
    (portfolios: PortfolioMap, currencyHiddenMap: CurrencyHiddenMap) =>
    (acc1: Account, acc2: Account): number => {
        const portfolio1 = portfolios[acc1.address]
        const portfolio2 = portfolios[acc2.address]
        const amount1 = portfolio1
            ? sumPortfolio(portfolio1, currencyHiddenMap).amount
            : 0n
        const amount2 = portfolio2
            ? sumPortfolio(portfolio2, currencyHiddenMap).amount
            : 0n

        if (amount1 < amount2) {
            return 1
        } else if (amount1 > amount2) {
            return -1
        } else {
            return 0
        }
    }
