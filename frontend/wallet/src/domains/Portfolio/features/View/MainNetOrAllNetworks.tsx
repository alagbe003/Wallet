import { useState } from 'react'
import {
    BridgeSubmitted,
    SubmitedBridgesMap,
} from '@zeal/domains/Currency/domains/Bridge'
import { Column } from '@zeal/uikit/Column'
import { BridgeWidget } from 'src/domains/Currency/features/BridgeWidget'
import { SecretPhraseVerificationNotification } from './SecretPhraseVerificationNotification'
import {
    Msg as TokenWidgetMsg,
    Widget as TokenWidget,
} from 'src/domains/Token/components/Widget'
import {
    Msg as AppWidgetMsg,
    Widget as AppWidget,
} from 'src/domains/App/components/Widget'
import {
    Msg as NFTWidgetMsg,
    Widget as NFTWidget,
} from 'src/domains/NFTCollection/components/Widget'
import { LastRefreshed } from './LastRefreshed'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { Portfolio } from '@zeal/domains/Portfolio'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { TestNetworkView } from './TestNetworkView'
import { Address } from '@zeal/domains/Address'
import { KYCStatusWidget } from 'src/domains/Currency/domains/BankTransfer/features/KYCStatusWidget'
import { BankTransferInfo } from '@zeal/domains/Storage'
import { Submited } from '@zeal/domains/TransactionRequest'
import {
    List as TransactionRequestList,
    Msg as TransactionRequestListMsg,
} from 'src/domains/TransactionRequest/features/List'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { DepositMonitorWidget } from 'src/domains/Currency/domains/BankTransfer/features/DepositMonitorWidget'
import { WithdrawalMonitorWidget } from 'src/domains/Currency/domains/BankTransfer/features/WithdrawalMonitorWidget'
import { SubmittedOfframpTransaction } from '@zeal/domains/Currency/domains/BankTransfer'

export type Msg =
    | TokenWidgetMsg
    | TransactionRequestListMsg
    | AppWidgetMsg
    | NFTWidgetMsg
    | {
          type: 'reload_button_click'
      }
    | {
          type: 'on_recovery_kit_setup'
          address: Address
      }
    | MsgOf<typeof TestNetworkView>
    | MsgOf<typeof BridgeWidget>
    | MsgOf<typeof KYCStatusWidget>
    | MsgOf<typeof DepositMonitorWidget>
    | MsgOf<typeof WithdrawalMonitorWidget>

type Props = {
    keystore: KeyStore
    account: Account
    portfolio: Portfolio
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    fetchedAt: Date
    currentNetwork: CurrentNetwork
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    submitedBridgesMap: SubmitedBridgesMap
    submittedOffRampTransactions: SubmittedOfframpTransaction[]
    transactionRequests: Record<Address, Submited[]>
    bankTransferInfo: BankTransferInfo
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

export const MainNetOrAllNetworks = ({
    submitedBridgesMap,
    transactionRequests,
    submittedOffRampTransactions,
    account,
    onMsg,
    accountsMap,
    keyStoreMap,
    keystore,
    portfolio,
    fetchedAt,
    networkMap,
    currentNetwork,
    networkRPCMap,
    bankTransferInfo,
    currencyHiddenMap,
    currencyPinMap,
}: Props) => {
    const [cachedTransactionRequests] = useState<Submited[]>(
        transactionRequests[account.address] || []
    )
    const [bridges] = useState<BridgeSubmitted[]>(
        submitedBridgesMap[account.address] || []
    )
    const [pendingOfframpTransactions] = useState<
        SubmittedOfframpTransaction[]
    >(submittedOffRampTransactions)

    return (
        <Column spacing={16}>
            {bridges.length > 0 && (
                <Column spacing={12}>
                    {bridges.map((bridge) => (
                        <BridgeWidget
                            key={bridge.sourceTransactionHash}
                            bridgeSubmitted={bridge}
                            onMsg={onMsg}
                        />
                    ))}
                </Column>
            )}

            {cachedTransactionRequests.length > 0 && (
                <TransactionRequestList
                    accountsMap={accountsMap}
                    keyStoreMap={keyStoreMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    transactionRequests={cachedTransactionRequests}
                    onMsg={onMsg}
                />
            )}

            <SecretPhraseVerificationNotification
                keystore={keystore}
                onClick={() =>
                    onMsg({
                        type: 'on_recovery_kit_setup',
                        address: account.address,
                    })
                }
            />

            <KYCStatusWidget
                bankTransferInfo={bankTransferInfo}
                onMsg={onMsg}
            />

            <DepositMonitorWidget
                bankTransferInfo={bankTransferInfo}
                networkMap={networkMap}
                onMsg={onMsg}
            />

            {pendingOfframpTransactions.length > 0 && (
                <Column spacing={12}>
                    {pendingOfframpTransactions.map((submittedTransaction) => (
                        <WithdrawalMonitorWidget
                            key={submittedTransaction.transactionHash}
                            bankTransferInfo={bankTransferInfo}
                            submittedTransaction={submittedTransaction}
                            networkMap={networkMap}
                            onMsg={onMsg}
                        />
                    ))}
                </Column>
            )}

            <TokenWidget
                currencyHiddenMap={currencyHiddenMap}
                currencyPinMap={currencyPinMap}
                networkMap={networkMap}
                currentNetwork={currentNetwork}
                tokens={portfolio.tokens}
                knownCurrencies={portfolio.currencies}
                onMsg={onMsg}
            />
            <AppWidget
                networkMap={networkMap}
                apps={portfolio.apps}
                currencies={portfolio.currencies}
                onMsg={onMsg}
            />
            <NFTWidget
                nftCollections={portfolio.nftCollections}
                currencies={portfolio.currencies}
                onMsg={onMsg}
            />

            <LastRefreshed
                fetchedAt={fetchedAt}
                onClick={() => onMsg({ type: 'reload_button_click' })}
            />
        </Column>
    )
}
