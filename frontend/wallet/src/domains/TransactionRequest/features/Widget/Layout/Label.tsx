import { FormattedMessage } from 'react-intl'
import { SubmitedTransaction } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { notReachable } from '@zeal/toolkit'
import { Text2 } from 'src/uikit/Text2'
import { CompletedLabel } from './CompletedLabel'
import { Network } from '@zeal/domains/Network'

type Props = { submitedTransaction: SubmitedTransaction; network: Network }

export const Label = ({ submitedTransaction, network }: Props) => {
    switch (submitedTransaction.state) {
        case 'queued':
            return (
                <Text2
                    variant="footnote"
                    weight="regular"
                    color="textStatusNeutralOnColor"
                    whiteSpace="nowrap"
                >
                    <FormattedMessage
                        id="submitTransaction.state.addedToQueue"
                        defaultMessage="Queued"
                    />
                </Text2>
            )

        case 'included_in_block':
            return (
                <Text2
                    variant="footnote"
                    weight="regular"
                    color="textStatusNeutralOnColor"
                    whiteSpace="nowrap"
                >
                    <FormattedMessage
                        id="submitTransaction.state.includedInBlock"
                        defaultMessage="In block"
                    />
                </Text2>
            )

        case 'completed':
            return (
                <CompletedLabel
                    completedTransaction={submitedTransaction}
                    network={network}
                />
            )

        case 'failed':
            return (
                <Text2
                    variant="footnote"
                    weight="regular"
                    color="textStatusCriticalOnColor"
                    whiteSpace="nowrap"
                >
                    <FormattedMessage
                        id="submitTransaction.state.failed"
                        defaultMessage="Failed"
                    />
                </Text2>
            )

        default:
            return notReachable(submitedTransaction)
    }
}
