import { FormattedMessage } from 'react-intl'
import { CancelSubmited } from '@zeal/domains/TransactionRequest'
import { notReachable } from '@zeal/toolkit'
import { Button } from 'src/uikit'

import { NetworkMap } from '@zeal/domains/Network'
import { Row } from '@zeal/uikit/Row'
import { Completed, Msg as CompletedMsg } from './Completed'
import { Failed, Msg as FailedMsg } from './Failed'

type Props = {
    transactionRequest: CancelSubmited
    networkMap: NetworkMap

    onMsg: (msg: Msg) => void
}

export type Msg = CompletedMsg | FailedMsg

export const Actions = ({ transactionRequest, networkMap, onMsg }: Props) => {
    const { cancelSubmitedTransaction } = transactionRequest

    switch (cancelSubmitedTransaction.state) {
        case 'queued':
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
                    completedTransaction={cancelSubmitedTransaction}
                    transactionRequest={transactionRequest}
                    onMsg={onMsg}
                />
            )

        case 'failed':
            return (
                <Failed
                    networkMap={networkMap}
                    failedTransaction={cancelSubmitedTransaction}
                    transactionRequest={transactionRequest}
                    onMsg={onMsg}
                />
            )

        default:
            return notReachable(cancelSubmitedTransaction)
    }
}
