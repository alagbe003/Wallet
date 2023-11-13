import { AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { BankTransferInfo, CustomCurrencyMap } from '@zeal/domains/Storage'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Flow } from './Flow'
import {
    BankTransferCurrencies,
    fetchBankTransferCurrencies,
} from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { notReachable } from '@zeal/toolkit'
import React from 'react'
import { AppErrorPopup } from 'src/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { LoadingLayout } from 'src/uikit/LoadingLayout'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

type Props = {
    bankTransfer: BankTransferInfo
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    sessionPassword: string
    customCurrencies: CustomCurrencyMap
    currencyHiddenMap: CurrencyHiddenMap
    networkMap: NetworkMap
    feePresetMap: FeePresetMap
    installationId: string
    network: Network
    networkRPCMap: NetworkRPCMap
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof Flow>

type Data = {
    currencies: BankTransferCurrencies
}

const fetch = async (): Promise<Data> =>
    fetchBankTransferCurrencies().then((result) => ({
        currencies: result,
    }))

export const DepositWithdraw = ({
    customCurrencies,
    sessionPassword,
    bankTransfer,
    portfolioMap,
    accountsMap,
    keystoreMap,
    networkMap,
    networkRPCMap,
    feePresetMap,
    installationId,
    network,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(fetch, {
        type: 'loading',
        params: undefined,
    })

    switch (loadable.type) {
        case 'loading':
            return <LoadingLayout actionBar={null} />
        case 'loaded':
            return (
                <Flow
                    currencyHiddenMap={currencyHiddenMap}
                    feePresetMap={feePresetMap}
                    bankTransferCurrencies={loadable.data.currencies}
                    accountsMap={accountsMap}
                    bankTransfer={bankTransfer}
                    customCurrencies={customCurrencies}
                    installationId={installationId}
                    keystoreMap={keystoreMap}
                    network={network}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    portfolioMap={portfolioMap}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
            )
        case 'error':
            return (
                <>
                    <LoadingLayout actionBar={null} />
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
                                        params: loadable.params,
                                    })
                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(msg)
                            }
                        }}
                    />
                </>
            )
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
