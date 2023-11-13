import { FormattedMessage, useIntl } from 'react-intl'
import { TransactionRequest } from '@zeal/domains/TransactionRequest'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'
import { notReachable } from '@zeal/toolkit'
import { IconButton } from 'src/uikit'
import { InfoCircle } from 'src/uikit/Icon/InfoCircle'
import { Content } from 'src/uikit/Layout/Content'
import { Row } from '@zeal/uikit/Row'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    simulationResult: SimulationResult
    transactionRequest: TransactionRequest
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'on_approval_info_click'
}

export const TransactionHeader = ({
    simulationResult,
    onMsg,
    transactionRequest,
}: Props) => {
    const { formatMessage } = useIntl()

    switch (simulationResult.type) {
        case 'simulated': {
            const { transaction } = simulationResult.simulation

            switch (transaction.type) {
                case 'WithdrawalTrx':
                    return (
                        <Content.Header
                            title={
                                <FormattedMessage
                                    id="currency.bridge.withdrawal_status.title"
                                    defaultMessage="Withdrawal"
                                />
                            }
                        />
                    )

                case 'BridgeTrx':
                    return (
                        <Content.Header
                            title={
                                <FormattedMessage
                                    id="currency.bridge.bridge_status.title"
                                    defaultMessage="Bridge"
                                />
                            }
                            subtitle={
                                <FormattedMessage
                                    id="currency.bridge.bridge_status.subtitle"
                                    defaultMessage="Using {name}"
                                    values={{
                                        name: transaction.bridgeRoute
                                            .displayName,
                                    }}
                                />
                            }
                        />
                    )
                case 'FailedTransaction':
                case 'UnknownTransaction':
                    const dApp = transactionRequest.dApp
                    return (
                        <Content.Header
                            title={transaction.method}
                            subtitle={
                                <Row spacing={4}>
                                    <Text2>
                                        <FormattedMessage
                                            id="simulatedTransaction.unknown.using"
                                            defaultMessage="Using {app}"
                                            values={{
                                                app:
                                                    dApp?.title ||
                                                    dApp?.hostname,
                                            }}
                                        />
                                    </Text2>
                                </Row>
                            }
                        />
                    )
                case 'ApprovalTransaction':
                case 'SingleNftApprovalTransaction':
                case 'NftCollectionApprovalTransaction':
                    return (
                        <Content.Header
                            title={
                                <Row spacing={4}>
                                    <Text2
                                        variant="title3"
                                        weight="semi_bold"
                                        color="textPrimary"
                                    >
                                        <FormattedMessage
                                            id="simulatedTransaction.approval.title"
                                            defaultMessage="Approve"
                                        />
                                    </Text2>
                                    <IconButton
                                        aria-label={formatMessage({
                                            id: 'approval.approval_info',
                                            defaultMessage:
                                                'What are Approvals?',
                                        })}
                                        onClick={() =>
                                            onMsg({
                                                type: 'on_approval_info_click',
                                            })
                                        }
                                    >
                                        <InfoCircle size={16} />
                                    </IconButton>
                                </Row>
                            }
                        />
                    )

                case 'P2PTransaction':
                case 'P2PNftTransaction':
                    return (
                        <Content.Header
                            title={
                                <FormattedMessage
                                    id="simulatedTransaction.P2PTransaction.info.title"
                                    defaultMessage="Send"
                                />
                            }
                        />
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(transaction)
            }
        }

        case 'failed':
        case 'not_supported':
            return null

        /* istanbul ignore next */
        default:
            return notReachable(simulationResult)
    }
}
