import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { notReachable } from '@zeal/toolkit'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrencyHiddenMap,
    CurrencyId,
    CurrencyPinMap,
} from '@zeal/domains/Currency'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Flow } from './Flow'
import { AppErrorPopup } from 'src/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { fetchCurrenciesMatrix } from '@zeal/domains/Currency/api/fetchCurrenciesMatrix'
import { Skeleton } from 'src/domains/Currency/domains/Bridge/components/Skeleton'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

type Props = {
    account: Account
    portfolioMap: PortfolioMap
    keystoreMap: KeyStoreMap
    fromCurrencyId: CurrencyId | null
    sessionPassword: string
    accountMap: AccountsMap
    installationId: string
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    swapSlippagePercent: number | null
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' } | MsgOf<typeof Flow>

export const DataLoader = ({
    fromCurrencyId,
    accountMap,
    installationId,
    sessionPassword,
    portfolioMap,
    account,
    keystoreMap,
    swapSlippagePercent,
    networkMap,
    networkRPCMap,
    feePresetMap,
    currencyHiddenMap,
    currencyPinMap,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(fetchCurrenciesMatrix, {
        type: 'loading',
        params: undefined,
    })
    switch (loadable.type) {
        case 'loading':
            return (
                <Skeleton
                    account={account}
                    keystoreMap={keystoreMap}
                    onClose={() => onMsg({ type: 'close' })}
                />
            )

        case 'error':
            return (
                <>
                    <Skeleton
                        account={account}
                        keystoreMap={keystoreMap}
                        onClose={() => onMsg({ type: 'close' })}
                    />

                    <AppErrorPopup
                        error={parseAppError(loadable.error)}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                    onMsg(msg)
                                    break

                                case 'try_again_clicked':
                                    setLoadable({
                                        type: 'loading',
                                        params: undefined,
                                    })
                                    break

                                /* istanbul ignore next */
                                default:
                                    notReachable(msg)
                            }
                        }}
                    />
                </>
            )

        case 'loaded':
            return (
                <Flow
                    feePresetMap={feePresetMap}
                    currencyHiddenMap={currencyHiddenMap}
                    currencyPinMap={currencyPinMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    swapSlippagePercent={swapSlippagePercent}
                    account={account}
                    currenciesMatrix={loadable.data}
                    keystoreMap={keystoreMap}
                    portfolioMap={portfolioMap}
                    fromCurrencyId={fromCurrencyId}
                    installationId={installationId}
                    accountMap={accountMap}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
