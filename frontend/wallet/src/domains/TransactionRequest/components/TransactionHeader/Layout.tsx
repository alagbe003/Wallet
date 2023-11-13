import { FormattedMessage } from 'react-intl'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'
import { notReachable } from '@zeal/toolkit'
import { Content } from 'src/uikit/Layout/Content'
import { format } from '@zeal/domains/Address/helpers/format'
import { Row } from '@zeal/uikit/Row'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { ExternalLink } from 'src/uikit/Icon/ExternalLink'
import { Text2 } from 'src/uikit/Text2'
import { getExplorerLink } from 'src/domains/SmartContract/helpers/getExplorerLink'
import { TransactionRequest } from '@zeal/domains/TransactionRequest'
import React from 'react'
import { NetworkMap } from '@zeal/domains/Network'
import { IconButton } from 'src/uikit'
import { InfoCircle } from 'src/uikit/Icon/InfoCircle'

type Props = {
    simulationResult: SimulationResult
    transactionRequest: TransactionRequest
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_approval_info_click' }

export const Layout = ({
    simulationResult,
    networkMap,
    onMsg,
    transactionRequest: { rpcRequest, networkHexId, dApp },
}: Props) => {
    switch (simulationResult.type) {
        case 'simulated': {
            const { transaction } = simulationResult.simulation
            const {
                params: [{ to }],
            } = rpcRequest

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
                                    {to && (
                                        <Tertiary
                                            color="on_light"
                                            size="regular"
                                            onClick={() => {
                                                window.open(
                                                    getExplorerLink(
                                                        {
                                                            address: to,
                                                            networkHexId,
                                                            name: null,
                                                            logo: null,
                                                            website: null,
                                                        },
                                                        networkMap
                                                    ),
                                                    '_blank'
                                                )
                                            }}
                                        >
                                            {format(to)}
                                            <ExternalLink size={14} />
                                        </Tertiary>
                                    )}
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
