import {
    SendERC20Token as SendERC20Entrypoint,
    SendNFT as SendNFTEntrypoint,
} from '@zeal/domains/Main'

import { SendNFT } from './SendNFT'
import { SendERC20 } from './SendERC20'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'

type Props = {
    entrypoint: SendNFTEntrypoint | SendERC20Entrypoint

    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    sessionPassword: string
    installationId: string
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    customCurrencies: CustomCurrencyMap
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap

    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof SendERC20> | MsgOf<typeof SendNFT>

export const Send = ({
    entrypoint,
    accountsMap,
    customCurrencies,
    installationId,
    keyStoreMap,
    networkMap,
    networkRPCMap,
    feePresetMap,
    portfolioMap,
    sessionPassword,
    currencyHiddenMap,
    currencyPinMap,
    onMsg,
}: Props) => {
    switch (entrypoint.type) {
        case 'send_nft':
            return (
                <SendNFT
                    currencyHiddenMap={currencyHiddenMap}
                    feePresetMap={feePresetMap}
                    accountsMap={accountsMap}
                    customCurrencyMap={customCurrencies}
                    entryPoint={entrypoint}
                    installationId={installationId}
                    keyStoreMap={keyStoreMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    portfolioMap={portfolioMap}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
            )

        case 'send_erc20_token':
            return (
                <SendERC20
                    feePresetMap={feePresetMap}
                    currencyHiddenMap={currencyHiddenMap}
                    currencyPinMap={currencyPinMap}
                    account={accountsMap[entrypoint.fromAddress]}
                    accountsMap={accountsMap}
                    currencyId={entrypoint.tokenCurrencyId}
                    customCurrencies={customCurrencies}
                    installationId={installationId}
                    keyStoreMap={keyStoreMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    portfolioMap={portfolioMap}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(entrypoint)
    }
}
