import React, { useEffect } from 'react'
import { InteractionRequest } from '@zeal/domains/RPCRequest'
import { MinizedExpanded } from './MinizedExpanded'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { AlternativeProvider } from '@zeal/domains/Main'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { ConnectedToMetaMask as ConnectedToMetaMaskConnectionState } from 'src/domains/DApp/domains/ConnectionState'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { ImperativeError } from '@zeal/domains/Error'

type Props = {
    interactionRequest: InteractionRequest | null
    encryptedPassword: string
    sessionPassword: string | null
    connectionState: ConnectedToMetaMaskConnectionState
    requestedNetwork: Network
    networkRPCMap: NetworkRPCMap
    initialAccount: Account
    alternativeProvider: AlternativeProvider
    portfolios: PortfolioMap
    keystores: KeyStoreMap
    accounts: AccountsMap
    customCurrencyMap: CustomCurrencyMap
    networkMap: NetworkMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof MinizedExpanded>

export const ConnectedToMetaMask = ({
    interactionRequest,
    connectionState,
    requestedNetwork,
    alternativeProvider,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    customCurrencyMap,
    encryptedPassword,
    sessionPassword,
    initialAccount,
    accounts,
    portfolios,
    keystores,
    onMsg,
}: Props) => {
    useEffect(() => {
        if (interactionRequest) {
            captureError(
                new ImperativeError(
                    `got interaction request ${interactionRequest.method} in ConnectedToMetaMask `
                )
            )
        }
    }, [interactionRequest])

    return (
        <MinizedExpanded
            alternativeProvider={alternativeProvider}
            currencyHiddenMap={currencyHiddenMap}
            networkMap={networkMap}
            networkRPCMap={networkRPCMap}
            customCurrencyMap={customCurrencyMap}
            sessionPassword={sessionPassword}
            accounts={accounts}
            encryptedPassword={encryptedPassword}
            requestedNetwork={requestedNetwork}
            initialAccount={initialAccount}
            connectionState={connectionState}
            keystores={keystores}
            portfolios={portfolios}
            onMsg={onMsg}
        />
    )
}
