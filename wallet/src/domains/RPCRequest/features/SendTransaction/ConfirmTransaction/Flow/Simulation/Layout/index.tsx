import { FormattedMessage } from 'react-intl'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NotSigned } from '@zeal/domains/TransactionRequest'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { Button, IconButton } from 'src/uikit'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'

import { AccountsMap } from '@zeal/domains/Account'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { TransactionStatusButton } from 'src/domains/SafetyCheck/components/TransactionStatusButton'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { Column2 } from 'src/uikit/Column2'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Row } from '@zeal/uikit/Row'
import { ActionButton, Msg as ActionButtonMsg } from '../../ActionButton'
import { validateSafetyCheckFailedWithFailedChecksOnly } from '../helpers/validation'

import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { NetworkMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { TransactionHeader } from './TransactionHeader'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'
import { Content } from 'src/uikit/Layout/Content'
import {
    FeeForecastWidget,
    Msg as FeeForecastMsg,
} from '../../../../FeeForecastWidget'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { OffRampTransactionView } from 'src/domains/Currency/domains/BankTransfer/components/OffRampTransactionView'
import { BridgeTrxView } from 'src/domains/Transactions/domains/SimulatedTransaction/components/BridgeTrx'
import { P2PTransactionView } from 'src/domains/Transactions/domains/SimulatedTransaction/components/P2PTransactionView'
import { Unknown } from 'src/domains/Transactions/domains/SimulatedTransaction/components/Unknown'
import { Failed } from 'src/domains/Transactions/domains/SimulatedTransaction/components/Failed'
import { notReachable } from '@zeal/toolkit'
import { EditableApprove } from 'src/domains/Transactions/domains/SimulatedTransaction/components/EditableApprove'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { TransactionSafetyCheckResult } from '@zeal/domains/SafetyCheck'
import { ListItem } from 'src/domains/SmartContract/components/ListItem'
import { Group } from 'src/uikit/Group'
import { Text2 } from 'src/uikit/Text2'
import { NftListItem } from 'src/domains/NFTCollection/components/NftListItem'
import { NftCollectionListItem } from 'src/domains/NFTCollection/components/NftCollectionListItem'

type Props = {
    transactionRequest: NotSigned
    simulation: SimulateTransactionResponse
    nonce: number
    gasEstimate: string

    networkMap: NetworkMap

    pollableData: PollableData<FeeForecastResponse, FeeForecastRequest>
    pollingInterval: number
    pollingStartedAt: number

    accounts: AccountsMap
    keystores: KeyStoreMap

    onMsg: (msg: Msg) => void
}

export type Msg =
    | {
          type: 'on_cancel_confirm_transaction_clicked'
      }
    | {
          type: 'safety_checks_clicked'
      }
    | {
          type: 'on_minimize_click'
      }
    | ActionButtonMsg
    | FeeForecastMsg
    | MsgOf<typeof EditableApprove>
    | MsgOf<typeof TransactionHeader>

export const Layout = ({
    onMsg,
    simulation,
    nonce,
    gasEstimate,
    transactionRequest,
    pollingInterval,
    pollingStartedAt,
    pollableData,
    accounts,
    keystores,
    networkMap,
}: Props) => {
    const { account } = transactionRequest

    const keystore = getKeyStore({
        keyStoreMap: keystores,
        address: account.address,
    })

    const simulationResult: SimulationResult = { type: 'simulated', simulation }

    const safetyCheckResult = validateSafetyCheckFailedWithFailedChecksOnly({
        simulationResult,
    })

    return (
        <Layout2 background="light" padding="form">
            <ActionBar
                keystore={keystore}
                account={account}
                network={findNetworkByHexChainId(
                    transactionRequest.networkHexId,
                    networkMap
                )}
                right={
                    <IconButton
                        onClick={() => {
                            onMsg({ type: 'on_minimize_click' })
                        }}
                    >
                        <CloseCross size={24} />
                    </IconButton>
                }
            />
            <Column2 spacing={12} style={{ flex: '1' }}>
                <Content
                    header={
                        <TransactionHeader
                            transactionRequest={transactionRequest}
                            onMsg={onMsg}
                            simulationResult={simulationResult}
                        />
                    }
                    footer={
                        <Footer
                            safetyCheckResult={safetyCheckResult}
                            simulation={simulation}
                            networkMap={networkMap}
                            onMsg={onMsg}
                        />
                    }
                >
                    <TransactionInfo
                        networkMap={networkMap}
                        keystores={keystores}
                        originalEthSendTransaction={
                            transactionRequest.rpcRequest
                        }
                        accounts={accounts}
                        dApp={transactionRequest.dApp}
                        simulation={simulation}
                        onMsg={onMsg}
                    />
                </Content>

                <FeeForecastWidget
                    keystore={keystore}
                    nonce={nonce}
                    gasEstimate={gasEstimate}
                    pollingStartedAt={pollingStartedAt}
                    simulateTransactionResponse={{
                        type: 'simulated',
                        simulation,
                    }}
                    transactionRequest={transactionRequest}
                    onMsg={onMsg}
                    pollingInterval={pollingInterval}
                    pollableData={pollableData}
                />

                <Row spacing={8}>
                    <Button
                        size="regular"
                        variant="secondary"
                        onClick={() =>
                            onMsg({
                                type: 'on_cancel_confirm_transaction_clicked',
                            })
                        }
                    >
                        <FormattedMessage
                            id="action.cancel"
                            defaultMessage="Cancel"
                        />
                    </Button>

                    <ActionButton
                        nonce={nonce}
                        gasEstimate={gasEstimate}
                        pollableData={pollableData}
                        transactionRequest={transactionRequest}
                        simulationResult={{ type: 'simulated', simulation }}
                        onMsg={onMsg}
                        keystore={getKeyStore({
                            keyStoreMap: keystores,
                            address: transactionRequest.account.address,
                        })}
                    />
                </Row>
            </Column2>
        </Layout2>
    )
}

const Footer = ({
    safetyCheckResult,
    simulation,
    networkMap,
    onMsg,
}: {
    safetyCheckResult: TransactionSafetyCheckResult
    simulation: SimulateTransactionResponse
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}) => {
    const { transaction, currencies, checks } = simulation

    switch (transaction.type) {
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
                                    id="simulation.approve.footer.for"
                                    defaultMessage="For"
                                />
                            </Text2>
                            <ListItem
                                safetyChecks={checks}
                                smartContract={transaction.approveTo}
                                networkMap={networkMap}
                            />
                        </Column2>
                    </Group>

                    <TransactionStatusButton
                        safetyCheckResult={safetyCheckResult}
                        knownCurrencies={currencies}
                        onClick={() => onMsg({ type: 'safety_checks_clicked' })}
                    />
                </Column2>
            )
        case 'UnknownTransaction':
        case 'FailedTransaction':
        case 'P2PTransaction':
        case 'P2PNftTransaction':
        case 'BridgeTrx':
        case 'WithdrawalTrx':
            return (
                <TransactionStatusButton
                    safetyCheckResult={safetyCheckResult}
                    knownCurrencies={currencies}
                    onClick={() => onMsg({ type: 'safety_checks_clicked' })}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(transaction)
    }
}

const TransactionInfo = ({
    simulation,
    accounts,
    keystores,
    originalEthSendTransaction,
    onMsg,
    networkMap,
    dApp,
}: {
    simulation: SimulateTransactionResponse
    dApp: DAppSiteInfo | null
    accounts: AccountsMap
    originalEthSendTransaction: EthSendTransaction
    keystores: KeyStoreMap
    onMsg: (msg: Msg) => void
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
                <EditableApprove
                    originalEthSendTransaction={originalEthSendTransaction}
                    checks={checks}
                    knownCurrencies={knownCurrencies}
                    transaction={transaction}
                    onMsg={onMsg}
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
