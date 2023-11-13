import { Network } from '@zeal/domains/Network'
import { SubmitedTransaction } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { format } from '@zeal/domains/Transactions/domains/TransactionHash/helpers/format'
import { getExplorerLink } from '@zeal/domains/Transactions/domains/TransactionHash/helpers/getExplorerLink'
import { notReachable } from '@zeal/toolkit'
import { IconButton } from 'src/uikit'
import { ExternalLink } from 'src/uikit/Icon/ExternalLink'
import { Row } from '@zeal/uikit/Row'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    variant: 'with_address' | 'no_address'
    submitedTransaction: SubmitedTransaction
    network: Network
}

export const HashLink = ({ submitedTransaction, network, variant }: Props) => {
    switch (submitedTransaction.state) {
        case 'queued':
        case 'included_in_block':
        case 'completed':
        case 'failed':
            const link = getExplorerLink(
                { transactionHash: submitedTransaction.hash },
                network
            )

            switch (variant) {
                case 'with_address':
                    return (
                        <Row spacing={4} alignY="center">
                            <IconButton onClick={() => window.open(link)}>
                                <Row spacing={4} alignY="center">
                                    <Text2
                                        variant="paragraph"
                                        weight="regular"
                                        color="textPrimary"
                                    >
                                        {format({
                                            transactionHash:
                                                submitedTransaction.hash,
                                        })}
                                    </Text2>

                                    <ExternalLink
                                        size={14}
                                        color="textPrimary"
                                    />
                                </Row>
                            </IconButton>
                        </Row>
                    )

                case 'no_address':
                    return (
                        <IconButton onClick={() => window.open(link)}>
                            <ExternalLink size={14} color="textPrimary" />
                        </IconButton>
                    )

                default:
                    return notReachable(variant)
            }

        default:
            return notReachable(submitedTransaction)
    }
}
