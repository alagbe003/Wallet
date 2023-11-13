import { Submited } from '@zeal/domains/TransactionRequest'

import { IconButton } from 'src/uikit'

import { FormattedMessage, useIntl } from 'react-intl'
import { AccountsMap } from '@zeal/domains/Account'
import { ActionBar as AccountActionBar } from 'src/domains/Account/components/ActionBar'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { TransactionHeader } from 'src/domains/TransactionRequest/components/TransactionHeader'
import { SubmitedTransaction } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'
import { notReachable } from '@zeal/toolkit'
import { Column2 } from 'src/uikit/Column2'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { Content } from 'src/uikit/Layout/Content'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Minimized, Msg as MinimizedMsg } from 'src/uikit/Minimized'
import { ProgressStatusBar } from './ProgressStatusBar'

import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Actions, Msg as ActionsMsg } from './Actions'
import { SuccessSplash } from './SuccessSplash'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { OffRampTransactionView } from 'src/domains/Currency/domains/BankTransfer/components/OffRampTransactionView'
import { BridgeTrxView } from 'src/domains/Transactions/domains/SimulatedTransaction/components/BridgeTrx'
import { P2PTransactionView } from 'src/domains/Transactions/domains/SimulatedTransaction/components/P2PTransactionView'
import { Unknown } from 'src/domains/Transactions/domains/SimulatedTransaction/components/Unknown'
import { Failed } from 'src/domains/Transactions/domains/SimulatedTransaction/components/Failed'
import { Approve } from 'src/domains/Transactions/domains/SimulatedTransaction/components/Approve'
import { Group } from 'src/uikit/Group'
import { Text2 } from 'src/uikit/Text2'
import { ListItem } from 'src/domains/SmartContract/components/ListItem'
import { NftListItem } from 'src/domains/NFTCollection/components/NftListItem'
import { NftCollectionListItem } from 'src/domains/NFTCollection/components/NftCollectionListItem'

type Props = {
    transactionRequest: Submited
    accounts: AccountsMap
    keystores: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    state: State
    onMsg: (msg: Msg) => void
}

export type Msg =
    | ActionsMsg
    | MinimizedMsg
    | MsgOf<typeof SuccessSplash>
    | { type: 'on_minimize_click' }

export type State = { type: 'minimised' } | { type: 'maximised' }

export const Layout = ({
    transactionRequest,
    state,
    accounts,
    keystores,
    networkMap,
    networkRPCMap,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    const { account } = transactionRequest
    const network = findNetworkByHexChainId(
        transactionRequest.networkHexId,
        networkMap
    )

    switch (state.type) {
        case 'minimised':
            return <Minimized onMsg={onMsg} />

        case 'maximised':
            return (
                <Layout2 background="light" padding="form">
                    <AccountActionBar
                        keystore={getKeyStore({
                            keyStoreMap: keystores,
                            address: transactionRequest.account.address,
                        })}
                        network={network}
                        account={account}
                        right={
                            <IconButton
                                onClick={() =>
                                    onMsg({ type: 'on_minimize_click' })
                                }
                                aria-label={formatMessage({
                                    id: 'actions.minimize',
                                    defaultMessage: 'Minimize',
                                })}
                            >
                                <CloseCross size={24} />
                            </IconButton>
                        }
                    />

                    <Column2
                        spacing={12}
                        style={{ overflowY: 'auto', flex: '1' }}
                    >
                        <Content
                            header={
                                <TransactionHeader
                                    networkMap={networkMap}
                                    transactionRequest={transactionRequest}
                                    simulationResult={
                                        transactionRequest.simulation
                                    }
                                />
                            }
                            footer={
                                <Footer
                                    transactionRequest={transactionRequest}
                                    networkRPCMap={networkRPCMap}
                                    networkMap={networkMap}
                                    network={network}
                                />
                            }
                        >
                            <TransactionInfoSection
                                networkMap={networkMap}
                                network={network}
                                accounts={accounts}
                                dApp={transactionRequest.dApp}
                                keystores={keystores}
                                transactionRequest={transactionRequest}
                                simulationResult={transactionRequest.simulation}
                                submitedTransaction={
                                    transactionRequest.submitedTransaction
                                }
                                onMsg={onMsg}
                            />
                        </Content>

                        <Actions
                            networkMap={networkMap}
                            networkRPCMap={networkRPCMap}
                            transactionRequest={transactionRequest}
                            onMsg={onMsg}
                        />
                    </Column2>
                </Layout2>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}

const Footer = ({
    transactionRequest,
    network,
    networkMap,
    networkRPCMap,
}: {
    transactionRequest: Submited
    network: Network
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
}) => {
    const { submitedTransaction, simulation } = transactionRequest

    switch (simulation.type) {
        case 'failed':
        case 'not_supported':
            return (
                <ProgressStatusBar
                    submitedTransaction={submitedTransaction}
                    network={network}
                    networkRPCMap={networkRPCMap}
                />
            )
        case 'simulated': {
            const { transaction, checks } = simulation.simulation

            switch (transaction.type) {
                case 'BridgeTrx':
                case 'UnknownTransaction':
                case 'FailedTransaction':
                case 'P2PTransaction':
                case 'P2PNftTransaction':
                case 'WithdrawalTrx':
                    return (
                        <ProgressStatusBar
                            submitedTransaction={submitedTransaction}
                            network={network}
                            networkRPCMap={networkRPCMap}
                        />
                    )
                case 'ApprovalTransaction':
                case 'SingleNftApprovalTransaction':
                case 'NftCollectionApprovalTransaction':
                    return (
                        <Column2 spacing={0}>
                            <Group variant="default">
                                <Column2 spacing={0}>
                                    <Text2
                                        variant="paragraph"
                                        weight="regular"
                                        color="textSecondary"
                                    >
                                        <FormattedMessage
                                            id="check-confirmation.approve.footer.for"
                                            defaultMessage="For"
                                        />
                                    </Text2>
                                    <ListItem
                                        safetyChecks={(() => {
                                            switch (submitedTransaction.state) {
                                                case 'queued':
                                                case 'included_in_block':
                                                    return checks
                                                case 'completed':
                                                case 'failed':
                                                    return null
                                                /* istanbul ignore next */
                                                default:
                                                    return notReachable(
                                                        submitedTransaction
                                                    )
                                            }
                                        })()}
                                        smartContract={transaction.approveTo}
                                        networkMap={networkMap}
                                    />
                                </Column2>
                            </Group>

                            <ProgressStatusBar
                                submitedTransaction={submitedTransaction}
                                network={network}
                                networkRPCMap={networkRPCMap}
                            />
                        </Column2>
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(transaction)
            }
        }
        /* istanbul ignore next */
        default:
            return notReachable(simulation)
    }
}

const TransactionInfoSection = ({
    submitedTransaction,
    simulationResult,
    transactionRequest,
    accounts,
    dApp,
    keystores,
    network,
    networkMap,
    onMsg,
}: {
    transactionRequest: Submited
    network: Network
    submitedTransaction: SubmitedTransaction
    simulationResult: SimulationResult
    accounts: AccountsMap
    keystores: KeyStoreMap
    dApp: DAppSiteInfo | null
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}) => {
    switch (submitedTransaction.state) {
        case 'queued':
        case 'included_in_block': {
            switch (simulationResult.type) {
                case 'simulated':
                    return (
                        <TransactionInfo
                            networkMap={networkMap}
                            accounts={accounts}
                            dApp={dApp}
                            keystores={keystores}
                            simulation={simulationResult.simulation}
                        />
                    )

                case 'failed':
                case 'not_supported':
                    return (
                        <Content.Splash
                            onAnimationComplete={null}
                            variant="spinner"
                            title={
                                <FormattedMessage
                                    id="CheckConfirmation.InProgress"
                                    defaultMessage="In progress..."
                                />
                            }
                        />
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(simulationResult)
            }
        }

        case 'completed':
            return (
                <SuccessSplash
                    transactionRequest={transactionRequest}
                    networkMap={networkMap}
                    accounts={accounts}
                    dApp={dApp}
                    keystores={keystores}
                    network={network}
                    submitedTransaction={submitedTransaction}
                    onMsg={onMsg}
                />
            )

        case 'failed':
            return (
                <Content.Splash
                    onAnimationComplete={null}
                    variant="error"
                    title={
                        <FormattedMessage
                            id="submittedTransaction.failed.title"
                            defaultMessage="Transaction failed"
                        />
                    }
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(submitedTransaction)
    }
}

const TransactionInfo = ({
    simulation,
    accounts,
    keystores,
    networkMap,
    dApp,
}: {
    simulation: SimulateTransactionResponse
    dApp: DAppSiteInfo | null
    accounts: AccountsMap
    keystores: KeyStoreMap
    networkMap: NetworkMap
}) => {
    const { transaction, checks, currencies: knownCurrencies } = simulation

    switch (transaction.type) {
        case 'WithdrawalTrx':
            return (
                <OffRampTransactionView
                    variant={{ type: 'no_status' }}
                    networkMap={networkMap}
                    withdrawalRequest={transaction.withdrawalRequest}
                />
            )

        case 'BridgeTrx':
            return (
                <BridgeTrxView
                    networkMap={networkMap}
                    transaction={transaction}
                    knownCurrencies={knownCurrencies}
                />
            )
        case 'P2PTransaction':
        case 'P2PNftTransaction':
            return (
                <P2PTransactionView
                    networkMap={networkMap}
                    transaction={transaction}
                    dApp={dApp}
                    knownCurrencies={knownCurrencies}
                    checks={checks}
                    accounts={accounts}
                    keystores={keystores}
                />
            )

        case 'ApprovalTransaction':
            return (
                <Approve
                    checks={checks}
                    knownCurrencies={knownCurrencies}
                    transaction={transaction}
                />
            )

        case 'UnknownTransaction':
            return (
                <Unknown
                    networkMap={networkMap}
                    checks={checks}
                    knownCurrencies={knownCurrencies}
                    transaction={transaction}
                />
            )

        case 'FailedTransaction':
            return <Failed dApp={dApp} transaction={transaction} />

        case 'SingleNftApprovalTransaction':
            return (
                <NftListItem
                    networkMap={networkMap}
                    nft={transaction.nft}
                    checks={checks}
                    rightNode={null}
                />
            )

        case 'NftCollectionApprovalTransaction':
            return (
                <NftCollectionListItem
                    networkMap={networkMap}
                    checks={checks}
                    nftCollection={transaction.nftCollectionInfo}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(transaction)
    }
}
