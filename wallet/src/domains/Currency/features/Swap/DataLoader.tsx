import { Account, AccountsMap } from '@zeal/domains/Account'
import {
    CurrencyHiddenMap,
    CurrencyId,
    CurrencyPinMap,
} from '@zeal/domains/Currency'
import { AppErrorPopup } from 'src/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Portfolio, PortfolioMap } from '@zeal/domains/Portfolio'
import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Form } from './Form'
import { Skeleton } from './components/Skeleton'
import { fetchCurrenciesMatrix } from '@zeal/domains/Currency/api/fetchCurrenciesMatrix'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

type Props = {
    fromCurrencyId: CurrencyId | null
    fromAccount: Account
    portfolio: Portfolio

    sessionPassword: string
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    installationId: string
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap

    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap

    swapSlippagePercent: number | null

    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof Form>

export const DataLoader = ({
    fromAccount,
    portfolio,
    fromCurrencyId,
    accountsMap,
    installationId,
    keystoreMap,
    portfolioMap,
    sessionPassword,
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
                    account={fromAccount}
                    keystoreMap={keystoreMap}
                    onClose={() => onMsg({ type: 'close' })}
                />
            )

        case 'error':
            return (
                <>
                    <Skeleton
                        account={fromAccount}
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
                <Form
                    feePresetMap={feePresetMap}
                    currencyHiddenMap={currencyHiddenMap}
                    currencyPinMap={currencyPinMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    swapSlippagePercent={swapSlippagePercent}
                    accountsMap={accountsMap}
                    keystoreMap={keystoreMap}
                    portfolioMap={portfolioMap}
                    sessionPassword={sessionPassword}
                    installationId={installationId}
                    fromCurrencyId={fromCurrencyId}
                    fromAccount={fromAccount}
                    currenciesMatrix={loadable.data}
                    portfolio={portfolio}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
