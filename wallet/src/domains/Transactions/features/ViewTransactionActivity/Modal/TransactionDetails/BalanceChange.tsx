import {
    ActivityTransaction,
    FailedActivityTransaction,
} from '@zeal/domains/Transactions'
import { Column2 } from 'src/uikit/Column2'
import { Text2 } from 'src/uikit/Text2'
import { FormattedMessage } from 'react-intl'
import { Divider } from 'src/uikit/Divider'
import { Group } from 'src/uikit/Group'
import { notReachable } from '@zeal/toolkit'
import { NetworkMap } from '@zeal/domains/Network'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { AssetList } from 'src/domains/Transactions/components/AssetList'

type Props = {
    transaction: ActivityTransaction
    networkMap: NetworkMap
    knownCurrencies: KnownCurrencies
}

export const BalanceChange = ({
    transaction,
    networkMap,
    knownCurrencies,
}: Props) => {
    switch (transaction.type) {
        case 'FailedActivityTransaction':
            return null
        case 'SelfP2PActivityTransaction':
        case 'InboundP2PActivityTransaction':
        case 'OutboundP2PActivityTransaction':
        case 'OutboundP2PNftActivityTransaction':
        case 'SingleNftApprovalActivityTransaction':
        case 'SingleNftApprovalRevokeActivityTransaction':
        case 'NftCollectionApprovalActivityTransaction':
        case 'NftCollectionApprovalRevokeActivityTransaction':
        case 'Erc20ApprovalActivityTransaction':
        case 'Erc20ApprovalRevokeActivityTransaction':
        case 'PartialTokenApprovalActivityTransaction':
        case 'UnknownActivityTransaction':
            return (
                <Group variant="default">
                    <Column2 spacing={12}>
                        <Text2
                            variant="paragraph"
                            weight="regular"
                            color="textSecondary"
                        >
                            <Title transaction={transaction} />
                        </Text2>
                        <Divider variant="secondary" />
                        <AssetList
                            displayLimit={false}
                            transaction={transaction}
                            networkMap={networkMap}
                            knownCurrencies={knownCurrencies}
                        />
                    </Column2>
                </Group>
            )
        /* istanbul ignore next */
        default:
            return notReachable(transaction)
    }
}

const Title = ({
    transaction,
}: {
    transaction: Exclude<ActivityTransaction, FailedActivityTransaction>
}) => {
    switch (transaction.type) {
        case 'SelfP2PActivityTransaction':
        case 'UnknownActivityTransaction':
            return (
                <FormattedMessage
                    id="activity.detail.balance-change.title.default"
                    defaultMessage="Balance change"
                />
            )
        case 'InboundP2PActivityTransaction':
            return (
                <FormattedMessage
                    id="activity.detail.balance-change.title.received"
                    defaultMessage="Received"
                />
            )
        case 'OutboundP2PActivityTransaction':
        case 'OutboundP2PNftActivityTransaction':
            return (
                <FormattedMessage
                    id="activity.detail.balance-change.title.sent"
                    defaultMessage="Sent"
                />
            )
        case 'Erc20ApprovalActivityTransaction':
        case 'SingleNftApprovalActivityTransaction':
        case 'NftCollectionApprovalActivityTransaction':
        case 'PartialTokenApprovalActivityTransaction':
            return (
                <FormattedMessage
                    id="activity.detail.balance-change.title.approved"
                    defaultMessage="Spend limits approved"
                />
            )
        case 'Erc20ApprovalRevokeActivityTransaction':
        case 'SingleNftApprovalRevokeActivityTransaction':
        case 'NftCollectionApprovalRevokeActivityTransaction':
            return (
                <FormattedMessage
                    id="activity.detail.balance-change.title.revoked"
                    defaultMessage="Spend limits revoked"
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(transaction)
    }
}
