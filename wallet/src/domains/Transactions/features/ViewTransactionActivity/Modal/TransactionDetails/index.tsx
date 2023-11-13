import { ActivityTransaction } from '@zeal/domains/Transactions'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Column2 } from 'src/uikit/Column2'
import { Text2 } from 'src/uikit/Text2'
import { Title } from 'src/domains/Transactions/components/Title'
import { Row } from '@zeal/uikit/Row'
import { Subtitle } from 'src/domains/Transactions/components/Subtitle'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Label } from 'src/domains/Transactions/components/Label'
import { FormattedDate } from 'react-intl'
import React from 'react'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { notReachable } from '@zeal/toolkit'
import { GeneralDetails } from './GeneralDetails'
import { BalanceChange } from './BalanceChange'

type Props = {
    transaction: ActivityTransaction
    accountsMap: AccountsMap
    account: Account
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
}

const getTextColour = (
    transaction: ActivityTransaction
): 'textSecondary' | 'textStatusCriticalOnColor' => {
    switch (transaction.type) {
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
            return 'textSecondary'
        case 'FailedActivityTransaction':
            return 'textStatusCriticalOnColor'
        /* istanbul ignore next */
        default:
            return notReachable(transaction)
    }
}

export const TransactionDetails = ({
    transaction,
    networkMap,
    networkRPCMap,
    accountsMap,
    account,
    knownCurrencies,
}: Props) => (
    <Column2 spacing={12}>
        <Column2 spacing={4}>
            <Text2
                ellipsis
                variant="paragraph"
                weight="medium"
                color="textPrimary"
            >
                <Title transaction={transaction} />
            </Text2>
            <Row spacing={8}>
                <Text2
                    variant="footnote"
                    ellipsis
                    weight="regular"
                    color="textSecondary"
                >
                    <Subtitle
                        transaction={transaction}
                        accountsMap={accountsMap}
                        account={account}
                    />
                </Text2>

                <Spacer2 />

                <Label
                    transaction={transaction}
                    knownCurrencies={knownCurrencies}
                />

                <Text2
                    variant="footnote"
                    weight="regular"
                    color={getTextColour(transaction)}
                    whiteSpace="nowrap"
                >
                    <FormattedDate
                        value={transaction.timestamp}
                        month="short"
                        day="2-digit"
                        hour="2-digit"
                        minute="2-digit"
                        hour12={false}
                    />
                </Text2>
            </Row>
        </Column2>
        <GeneralDetails
            networkMap={networkMap}
            networkRPCMap={networkRPCMap}
            knownCurrencies={knownCurrencies}
            account={account}
            transaction={transaction}
            accountsMap={accountsMap}
        />
        <BalanceChange
            transaction={transaction}
            networkMap={networkMap}
            knownCurrencies={knownCurrencies}
        />
    </Column2>
)
