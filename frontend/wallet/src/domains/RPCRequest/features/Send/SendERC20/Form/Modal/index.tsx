import { Account, AccountsMap } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import {
    CurrencyHiddenMap,
    CurrencyPinMap,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { Token } from '@zeal/domains/Token'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Modal as UIModal } from '@zeal/uikit/Modal'
import { SelectToAddress } from '../../../SelectToAddress'
import { ChooseToken } from './ChooseToken'

type Props = {
    state: State
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    account: Account
    keyStoreMap: KeyStoreMap
    accountsMap: AccountsMap
    portfolioMap: PortfolioMap
    selectedToken: Token | null
    toAddress: Address | null
    sessionPassword: string
    customCurrencies: CustomCurrencyMap
    knownCurrencies: KnownCurrencies
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof ChooseToken> | MsgOf<typeof SelectToAddress>

export type State =
    | { type: 'closed' }
    | { type: 'select_token' }
    | { type: 'select_to_address' }

export const Modal = ({
    state,
    onMsg,
    account,
    accountsMap,
    keyStoreMap,
    networkMap,
    networkRPCMap,
    portfolioMap,
    selectedToken,
    toAddress,
    knownCurrencies,
    customCurrencies,
    sessionPassword,
    currencyHiddenMap,
    currencyPinMap,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'select_token':
            return (
                <UIModal>
                    <ChooseToken
                        currencyHiddenMap={currencyHiddenMap}
                        currencyPinMap={currencyPinMap}
                        networkMap={networkMap}
                        portfolioMap={portfolioMap}
                        keyStoreMap={keyStoreMap}
                        account={account}
                        selectedToken={selectedToken}
                        knownCurrencies={knownCurrencies}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        case 'select_to_address':
            return (
                <UIModal>
                    <SelectToAddress
                        currencyHiddenMap={currencyHiddenMap}
                        customCurrencies={customCurrencies}
                        sessionPassword={sessionPassword}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        account={account}
                        toAddress={toAddress}
                        accountsMap={accountsMap}
                        keyStoreMap={keyStoreMap}
                        portfolioMap={portfolioMap}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
