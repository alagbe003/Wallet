import { notReachable } from '@zeal/toolkit'

import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { SubmitedTransaction } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { Progress2 } from 'src/uikit/Progress/Progress2'
import { HashLink } from 'src/domains/TransactionRequest/domains/SubmitedTransaction/components/HashLink'
import { FormattedMessage } from 'react-intl'
import { Spinner } from 'src/uikit/Spinner'
import { BoldCrossOctagon } from 'src/uikit/Icon/BoldCrossOctagon'
import { FailedTransctionProgressBar } from 'src/domains/TransactionRequest/domains/SubmitedTransaction/features/FailedTransctionProgressBar'

type Props = {
    submitedTransaction: SubmitedTransaction
    network: Network
    networkRPCMap: NetworkRPCMap
}

export const ProgressStatusBar = ({
    network,
    networkRPCMap,
    submitedTransaction,
}: Props) => {
    switch (submitedTransaction.state) {
        case 'queued':
        case 'included_in_block':
            return (
                <Progress2
                    variant="neutral"
                    title={
                        <FormattedMessage
                            id="submitTransaction.cancel.attemptingToStop"
                            defaultMessage="Attempting to stop"
                        />
                    }
                    right={
                        <>
                            <Spinner size={16} />
                            <HashLink
                                variant="with_address"
                                submitedTransaction={submitedTransaction}
                                network={network}
                            />
                        </>
                    }
                    initialProgress={0.1}
                    progress={0.6}
                />
            )

        case 'failed':
            return (
                <FailedTransctionProgressBar
                    failedTransaction={submitedTransaction}
                    network={network}
                    networkRPCMap={networkRPCMap}
                />
            )

        case 'completed':
            return (
                <Progress2
                    variant="neutral"
                    title={
                        <FormattedMessage
                            id="submitTransaction.state.cancelled"
                            defaultMessage="Stopped"
                        />
                    }
                    right={
                        <>
                            <BoldCrossOctagon
                                size={16}
                                color="iconStatusNeutralOnColor"
                            />
                            <HashLink
                                variant="with_address"
                                submitedTransaction={submitedTransaction}
                                network={network}
                            />
                        </>
                    }
                    initialProgress={null}
                    progress={1}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(submitedTransaction)
    }
}
