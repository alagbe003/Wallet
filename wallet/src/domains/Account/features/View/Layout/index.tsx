import { Account, AccountsMap } from '@zeal/domains/Account'
import {
    FetchPortfolioRequest,
    FetchPortfolioResponse,
} from '@zeal/domains/Account/api/fetchAccounts'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { filterPortfolioByNetwork } from '@zeal/domains/Portfolio/helpers/filterPortfolioByNetwork'
import { notReachable } from '@zeal/toolkit'
import { ReloadableData } from '@zeal/toolkit/LoadableData/ReloadableData'
import { Error as ErrorView, Msg as ErrorMsg } from './Error'
import { Loaded, Msg as LoadedMsg } from './Loaded'
import { Loading } from './Loading'
import { SubmitedBridgesMap } from '@zeal/domains/Currency/domains/Bridge'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { BankTransferInfo } from '@zeal/domains/Storage'
import { Address } from '@zeal/domains/Address'
import { Submited } from '@zeal/domains/TransactionRequest'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { sortCurrencyByPinStatus } from '@zeal/domains/Currency/helpers/sortCurrencyByPinStatus'
import { SubmittedOfframpTransaction } from '@zeal/domains/Currency/domains/BankTransfer'

type Props = {
    keystoreMap: KeyStoreMap
    submitedBridgesMap: SubmitedBridgesMap
    submittedOffRampTransactions: SubmittedOfframpTransaction[]
    transactionRequests: Record<Address, Submited[]>
    account: Account
    accountsMap: AccountsMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    portfolioLoadable: ReloadableData<
        FetchPortfolioResponse,
        FetchPortfolioRequest
    >
    selectedNetwork: CurrentNetwork
    bankTransferInfo: BankTransferInfo
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

export type Msg = LoadedMsg | ErrorMsg

export const Layout = ({
    account,
    portfolioLoadable,
    selectedNetwork,
    keystoreMap,
    accountsMap,
    submitedBridgesMap,
    submittedOffRampTransactions,
    transactionRequests,
    networkMap,
    networkRPCMap,
    bankTransferInfo,
    currencyHiddenMap,
    currencyPinMap,
    onMsg,
}: Props) => {
    const keystore = getKeyStore({
        keyStoreMap: keystoreMap,
        address: account.address,
    })

    switch (portfolioLoadable.type) {
        case 'loading':
            return (
                <Loading
                    keystore={keystore}
                    account={account}
                    currentNetwork={selectedNetwork}
                    onMsg={onMsg}
                />
            )
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            const portfolio = filterPortfolioByNetwork(
                portfolioLoadable.data.portfolio,
                selectedNetwork,
                networkMap
            )

            portfolio.tokens.sort((a, b) =>
                sortCurrencyByPinStatus(currencyPinMap)(
                    portfolio.currencies[a.balance.currencyId],
                    portfolio.currencies[b.balance.currencyId]
                )
            )

            return (
                <Loaded
                    submittedOffRampTransactions={submittedOffRampTransactions}
                    currencyHiddenMap={currencyHiddenMap}
                    currencyPinMap={currencyPinMap}
                    bankTransferInfo={bankTransferInfo}
                    accountsMap={accountsMap}
                    networkMap={networkMap}
                    submitedBridgesMap={submitedBridgesMap}
                    transactionRequests={transactionRequests}
                    keystoreMap={keystoreMap}
                    fetchedAt={portfolioLoadable.data.fetchedAt}
                    isLoading={portfolioLoadable.type === 'reloading'}
                    portfolio={portfolio}
                    account={account}
                    currentNetwork={selectedNetwork}
                    networkRPCMap={networkRPCMap}
                    onMsg={onMsg}
                />
            )
        case 'error':
            return (
                <ErrorView
                    keystore={keystore}
                    account={account}
                    currentNetwork={selectedNetwork}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(portfolioLoadable)
    }
}
