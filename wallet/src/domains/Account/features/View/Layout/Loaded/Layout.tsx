import { FormattedMessage } from 'react-intl'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { Widget } from 'src/domains/Account/components/Widget'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { getLayoutBackground } from '@zeal/domains/Network/helpers/getLayoutBackground'
import { Portfolio } from '@zeal/domains/Portfolio'
import {
    Msg as ViewPortfolioMsg,
    View as ViewPortfolio,
} from 'src/domains/Portfolio/features/View'
import { CircleMore } from '@zeal/uikit/Icon/CircleMore'
import { Toast, ToastContainer, ToastText } from '@zeal/uikit/Toast'
import { ContentBox, HeaderBox, Screen } from '@zeal/uikit/Screen'
import { BridgeWidget } from 'src/domains/Currency/features/BridgeWidget'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Column } from '@zeal/uikit/Column'
import { SubmitedBridgesMap } from '@zeal/domains/Currency/domains/Bridge'
import { BankTransferInfo } from '@zeal/domains/Storage'
import { Address } from '@zeal/domains/Address'
import { Submited } from '@zeal/domains/TransactionRequest'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { SubmittedOfframpTransaction } from '@zeal/domains/Currency/domains/BankTransfer'

type Props = {
    account: Account
    submitedBridgesMap: SubmitedBridgesMap
    submittedOffRampTransactions: SubmittedOfframpTransaction[]
    transactionRequests: Record<Address, Submited[]>
    portfolio: Portfolio
    accountsMap: AccountsMap
    currentNetwork: CurrentNetwork
    fetchedAt: Date
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    isLoading: boolean
    keystore: KeyStore
    bankTransferInfo: BankTransferInfo
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | MsgOf<typeof Widget>
    | ViewPortfolioMsg
    | MsgOf<typeof BridgeWidget>

export const Layout = ({
    account,
    currentNetwork,
    portfolio,
    accountsMap,
    fetchedAt,
    keyStoreMap,
    isLoading,
    keystore,
    submitedBridgesMap,
    transactionRequests,
    submittedOffRampTransactions,
    networkMap,
    networkRPCMap,
    bankTransferInfo,
    currencyHiddenMap,
    currencyPinMap,
    onMsg,
}: Props) => {
    return (
        <Screen padding="main" background={getLayoutBackground(currentNetwork)}>
            <HeaderBox>
                <Widget
                    currencyHiddenMap={currencyHiddenMap}
                    keystore={keystore}
                    currentNetwork={currentNetwork}
                    portfolio={portfolio}
                    currentAccount={account}
                    onMsg={onMsg}
                />
            </HeaderBox>

            <ContentBox>
                <Column spacing={16}>
                    <ViewPortfolio
                        currencyHiddenMap={currencyHiddenMap}
                        currencyPinMap={currencyPinMap}
                        keyStoreMap={keyStoreMap}
                        accountsMap={accountsMap}
                        networkMap={networkMap}
                        submitedBridgesMap={submitedBridgesMap}
                        transactionRequests={transactionRequests}
                        currentNetwork={currentNetwork}
                        networkRPCMap={networkRPCMap}
                        account={account}
                        keystore={keystore}
                        fetchedAt={fetchedAt}
                        portfolio={portfolio}
                        bankTransferInfo={bankTransferInfo}
                        submittedOffRampTransactions={
                            submittedOffRampTransactions
                        }
                        onMsg={onMsg}
                    />
                </Column>
            </ContentBox>
            {isLoading && (
                <ToastContainer>
                    <Toast>
                        <CircleMore size={18} color="iconAccent2" />
                        <ToastText>
                            <FormattedMessage
                                id="accounts.view.reLoading.title"
                                defaultMessage="Loading assets..."
                            />
                        </ToastText>
                    </Toast>
                </ToastContainer>
            )}
        </Screen>
    )
}
