import { FormattedMessage } from 'react-intl'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Submited } from '@zeal/domains/TransactionRequest'
import { notReachable } from '@zeal/toolkit'
import { Button } from 'src/uikit'
import { Row } from '@zeal/uikit/Row'
import { Completed, Msg as CompletedMsg } from './Completed'
import { Failed, Msg as FailedMsg } from './Failed'
import { AddedToQueue, Msg as AddedToQueueMsg } from './Queued'

type Props = {
    transactionRequest: Submited
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    onMsg: (msg: Msg) => void
}

export type Msg = AddedToQueueMsg | CompletedMsg | FailedMsg

export const Actions = ({
    transactionRequest,
    networkMap,
    networkRPCMap,
    onMsg,
}: Props) => {
    const { submitedTransaction } = transactionRequest

    switch (submitedTransaction.state) {
        case 'queued':
            return (
                <AddedToQueue
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    transactionRequest={{
                        ...transactionRequest,
                        submitedTransaction,
                    }}
                    onMsg={onMsg}
                />
            )

        case 'included_in_block':
            return (
                <Row spacing={8}>
                    <Button size="regular" variant="secondary" disabled>
                        <FormattedMessage
                            id="submitTransaction.stop"
                            defaultMessage="Stop"
                        />
                    </Button>

                    <Button size="regular" variant="secondary" disabled>
                        <FormattedMessage
                            id="submitTransaction.speedUp"
                            defaultMessage="Speed up"
                        />
                    </Button>
                </Row>
            )

        case 'completed':
            return (
                <Completed
                    networkMap={networkMap}
                    completedTransaction={submitedTransaction}
                    transactionRequest={transactionRequest}
                    onMsg={onMsg}
                />
            )

        case 'failed':
            return (
                <Failed
                    networkMap={networkMap}
                    failedTransaction={submitedTransaction}
                    transactionRequest={transactionRequest}
                    onMsg={onMsg}
                />
            )

        default:
            return notReachable(submitedTransaction)
    }
}
