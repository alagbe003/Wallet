import { Swap as SwapEntrypoint } from '@zeal/domains/Main'

import { DataLoader } from './DataLoader'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { AccountsMap } from '@zeal/domains/Account'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'

type Props = {
    entrypoint: SwapEntrypoint

    accountsMap: AccountsMap
    portfolioMap: PortfolioMap

    sessionPassword: string
    keystoreMap: KeyStoreMap
    installationId: string
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap

    swapSlippagePercent: number | null

    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap

    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof DataLoader>

export const Swap = ({
    entrypoint: { fromAddress, fromCurrencyId },
    portfolioMap,
    accountsMap,
    installationId,
    keystoreMap,
    sessionPassword,
    swapSlippagePercent,
    networkMap,
    networkRPCMap,
    feePresetMap,
    currencyHiddenMap,
    currencyPinMap,
    onMsg,
}: Props) => {
    return (
        <DataLoader
            feePresetMap={feePresetMap}
            currencyHiddenMap={currencyHiddenMap}
            currencyPinMap={currencyPinMap}
            networkMap={networkMap}
            networkRPCMap={networkRPCMap}
            swapSlippagePercent={swapSlippagePercent}
            accountsMap={accountsMap}
            installationId={installationId}
            keystoreMap={keystoreMap}
            portfolioMap={portfolioMap}
            sessionPassword={sessionPassword}
            fromCurrencyId={fromCurrencyId}
            fromAccount={accountsMap[fromAddress]}
            portfolio={portfolioMap[fromAddress]}
            onMsg={onMsg}
        />
    )
}
