import { useState } from 'react'
import { useIntl } from 'react-intl'
import { Account, AccountsMap } from '@zeal/domains/Account'
import {
    FetchPortfolioRequest,
    FetchPortfolioResponse,
} from '@zeal/domains/Account/api/fetchAccounts'
import {
    Msg as ViewAccountsMsg,
    View as ViewAccounts,
} from 'src/domains/Account/features/View'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { SubmitedBridgesMap } from '@zeal/domains/Currency/domains/Bridge'
import { ConnectionMap } from 'src/domains/DApp/domains/ConnectionState'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Manifest } from 'src/domains/Manifest'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { Settings } from 'src/domains/Settings/components/Settings'
import { BankTransferInfo, CustomCurrencyMap } from '@zeal/domains/Storage'
import { Submited } from '@zeal/domains/TransactionRequest'
import {
    Msg as ViewTransactionHistoryMsg,
    ViewTransactionActivity,
} from 'src/domains/Transactions/features/ViewTransactionActivity'
import { notReachable } from '@zeal/toolkit'
import { ReloadableData } from '@zeal/toolkit/LoadableData/ReloadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { keys } from '@zeal/toolkit/Object'
import { IconButton } from 'src/uikit'
import { Column2 } from 'src/uikit/Column2'
import { BoldSwapHorizon } from 'src/uikit/Icon/BoldSwapHorizon'
import { Clock } from 'src/uikit/Icon/Clock'
import { Logo } from 'src/uikit/Icon/Logo/Logo'
import { Setting } from 'src/uikit/Icon/Setting'
import { TabsLayout } from '@zeal/uikit/TabsLayout'
import { Text2 } from 'src/uikit/Text2'
import { ActionsTab } from './ActionsTab'
import { SubmittedOfframpTransaction } from '@zeal/domains/Currency/domains/BankTransfer'

type Props = {
    manifest: Manifest

    account: Account
    accounts: AccountsMap
    portfolios: PortfolioMap
    portfolioLoadable: ReloadableData<
        FetchPortfolioResponse,
        FetchPortfolioRequest
    >
    keystoreMap: KeyStoreMap
    submitedBridgesMap: SubmitedBridgesMap
    submittedOffRampTransactions: SubmittedOfframpTransaction[]
    networkMap: NetworkMap
    bankTransferInfo: BankTransferInfo

    encryptedPassword: string
    sessionPassword: string
    transactionRequests: Record<Address, Submited[]>
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    customCurrencyMap: CustomCurrencyMap

    selectedNetwork: CurrentNetwork
    networkRPCMap: NetworkRPCMap
    connections: ConnectionMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | ViewAccountsMsg
    | ViewTransactionHistoryMsg
    | Extract<
          MsgOf<typeof Settings>,
          {
              type:
                  | 'on_lock_zeal_click'
                  | 'on_recovery_kit_setup'
                  | 'on_disconnect_dapps_click'
                  | 'on_delete_all_dapps_confirm_click'
                  | 'add_new_account_click'
          }
      >
    | Extract<
          MsgOf<typeof ActionsTab>,
          {
              type:
                  | 'on_send_clicked'
                  | 'on_swap_clicked'
                  | 'on_bridge_clicked'
                  | 'on_receive_selected'
                  | 'on_bank_transfer_selected'
                  | 'on_token_settings_click'
                  | 'on_token_pin_click'
                  | 'on_token_un_pin_click'
                  | 'on_token_hide_click'
                  | 'on_token_un_hide_click'
          }
      >

type State =
    | { type: 'portfolio' }
    | { type: 'activity' }
    | { type: 'settings' }
    | { type: 'actions' }

const TABS: Record<State['type'], true> = {
    portfolio: true,
    actions: true,
    activity: true,
    settings: true,
}

export const Layout = ({
    accounts,
    account,
    selectedNetwork,
    networkRPCMap,
    portfolios,
    portfolioLoadable,
    keystoreMap,
    submittedOffRampTransactions,
    encryptedPassword,
    manifest,
    transactionRequests,
    submitedBridgesMap,
    connections,
    networkMap,
    bankTransferInfo,
    currencyHiddenMap,
    currencyPinMap,
    customCurrencyMap,
    sessionPassword,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'portfolio' })

    const tabs = keys(TABS)

    return (
        <TabsLayout
            tabs={tabs.map((tab) => (
                <TabButton
                    key={tab}
                    tab={tab}
                    selected={tab === state.type}
                    onClick={() => setState({ type: tab })}
                />
            ))}
            content={(() => {
                switch (state.type) {
                    case 'portfolio':
                        return (
                            <ViewAccounts
                                sessionPassword={sessionPassword}
                                currencyHiddenMap={currencyHiddenMap}
                                currencyPinMap={currencyPinMap}
                                networkMap={networkMap}
                                networkRPCMap={networkRPCMap}
                                submitedBridgesMap={submitedBridgesMap}
                                encryptedPassword={encryptedPassword}
                                submittedOffRampTransactions={
                                    submittedOffRampTransactions
                                }
                                keystoreMap={keystoreMap}
                                selectedNetwork={selectedNetwork}
                                portfolioLoadable={portfolioLoadable}
                                transactionRequests={transactionRequests}
                                account={account}
                                portfolios={portfolios}
                                accounts={accounts}
                                bankTransferInfo={bankTransferInfo}
                                onMsg={onMsg}
                            />
                        )
                    case 'activity':
                        return (
                            <ViewTransactionActivity
                                currencyHiddenMap={currencyHiddenMap}
                                networkMap={networkMap}
                                submitedBridgesMap={submitedBridgesMap}
                                transactionRequests={transactionRequests}
                                keystoreMap={keystoreMap}
                                portfolios={portfolios}
                                accounts={accounts}
                                onMsg={onMsg}
                                account={account}
                                selectedNetwork={selectedNetwork}
                                networkRPCMap={networkRPCMap}
                            />
                        )
                    case 'settings':
                        return (
                            <Settings
                                sessionPassword={sessionPassword}
                                currencyHiddenMap={currencyHiddenMap}
                                networkMap={networkMap}
                                connections={connections}
                                encryptedPassword={encryptedPassword}
                                accounts={accounts}
                                portfolios={portfolios}
                                keystoreMap={keystoreMap}
                                portfolioLoadable={portfolioLoadable}
                                onMsg={onMsg}
                                currentAccount={account}
                                currentNetwork={selectedNetwork}
                                networkRPCMap={networkRPCMap}
                                manifest={manifest}
                            />
                        )

                    case 'actions':
                        return (
                            <ActionsTab
                                networkMap={networkMap}
                                currencyPinMap={currencyPinMap}
                                customCurrencyMap={customCurrencyMap}
                                currencyHiddenMap={currencyHiddenMap}
                                currentAccount={account}
                                currentNetwork={selectedNetwork}
                                keystore={getKeyStore({
                                    address: account.address,
                                    keyStoreMap: keystoreMap,
                                })}
                                portfolio={portfolios[account.address]}
                                onMsg={(msg) => {
                                    switch (msg.type) {
                                        case 'close':
                                            setState({ type: 'portfolio' })
                                            break

                                        case 'account_filter_click':
                                        case 'network_filter_click':
                                        case 'on_tracked_tag_click':
                                            captureError(
                                                new ImperativeError(
                                                    'Widget should not be clickable during actions'
                                                )
                                            )
                                            break

                                        case 'on_send_clicked':
                                        case 'on_swap_clicked':
                                        case 'on_bridge_clicked':
                                        case 'on_receive_selected':
                                        case 'on_bank_transfer_selected':
                                        case 'on_token_settings_click':
                                        case 'on_token_pin_click':
                                        case 'on_token_un_pin_click':
                                        case 'on_token_hide_click':
                                        case 'on_token_un_hide_click':
                                            onMsg(msg)
                                            break

                                        /* istanbul ignore next */
                                        default:
                                            notReachable(msg)
                                    }
                                }}
                            />
                        )

                    /* istanbul ignore next */
                    default:
                        return notReachable(state)
                }
            })()}
        />
    )
}

type TabButtonProps = {
    tab: State['type']
    selected: boolean
    onClick: () => void
}

const TabButton = ({ tab, selected, onClick }: TabButtonProps) => {
    const { formatMessage } = useIntl()

    switch (tab) {
        case 'portfolio':
            return (
                <IconButton
                    aria-pressed={selected}
                    aria-label={formatMessage({
                        id: 'mainTabs.portfolio.label',
                        defaultMessage: 'Portfolio',
                    })}
                    onClick={onClick}
                >
                    <Column2 alignX="center" spacing={4}>
                        <Logo
                            color={
                                selected ? 'actionPrimaryDefault' : undefined
                            }
                            size={20}
                        />
                        <Text2>
                            {formatMessage({
                                id: 'mainTabs.portfolio.label',
                                defaultMessage: 'Portfolio',
                            })}
                        </Text2>
                    </Column2>
                </IconButton>
            )

        case 'activity':
            return (
                <IconButton
                    aria-pressed={selected}
                    aria-label={formatMessage({
                        id: 'mainTabs.activity.label',
                        defaultMessage: 'Activity',
                    })}
                    onClick={onClick}
                >
                    <Column2 alignX="center" spacing={4}>
                        <Clock
                            color={
                                selected ? 'actionPrimaryDefault' : undefined
                            }
                            size={20}
                        />
                        <Text2>
                            {formatMessage({
                                id: 'mainTabs.activity.label',
                                defaultMessage: 'Activity',
                            })}
                        </Text2>
                    </Column2>
                </IconButton>
            )

        case 'settings':
            return (
                <IconButton
                    aria-pressed={selected}
                    aria-label={formatMessage({
                        id: 'mainTabs.settings.label',
                        defaultMessage: 'Settings',
                    })}
                    onClick={onClick}
                >
                    <Column2 alignX="center" spacing={4}>
                        <Setting
                            color={
                                selected ? 'actionPrimaryDefault' : undefined
                            }
                            size={20}
                        />
                        <Text2>
                            {formatMessage({
                                id: 'mainTabs.settings.label',
                                defaultMessage: 'Settings',
                            })}
                        </Text2>
                    </Column2>
                </IconButton>
            )

        case 'actions':
            return (
                <IconButton
                    aria-pressed={selected}
                    aria-label={formatMessage({
                        id: 'mainTabs.transact.label',
                        defaultMessage: 'Actions',
                    })}
                    onClick={onClick}
                >
                    <Column2 alignX="center" spacing={4}>
                        <BoldSwapHorizon size={20} />
                        <Text2>
                            {formatMessage({
                                id: 'mainTabs.transact.label',
                                defaultMessage: 'Actions',
                            })}
                        </Text2>
                    </Column2>
                </IconButton>
            )

        /* istanbul ignore next */
        default:
            return notReachable(tab)
    }
}
