import { ActivityTransaction } from '@zeal/domains/Transactions'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { Group } from 'src/uikit/Group'
import { FormattedDate } from 'react-intl'
import { Text2 } from 'src/uikit/Text2'
import { Column2 } from 'src/uikit/Column2'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Row } from '@zeal/uikit/Row'
import { Title } from '../Title'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { Subtitle } from '../Subtitle'
import { Label } from '../Label'
import { notReachable } from '@zeal/toolkit'
import { NetworkMap } from '@zeal/domains/Network'
import React from 'react'
import { Divider } from 'src/uikit/Divider'
import { AssetList } from '../AssetList'

type Props = {
    transaction: ActivityTransaction
    accountsMap: AccountsMap
    account: Account
    networkMap: NetworkMap
    knownCurrencies: KnownCurrencies
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'on_activity_transaction_click'
    transaction: ActivityTransaction
    knownCurrencies: KnownCurrencies
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

export const ListItem = ({
    transaction,
    account,
    accountsMap,
    networkMap,
    onMsg,
    knownCurrencies,
}: Props) => {
    return (
        <div
            role="button"
            style={{ cursor: 'pointer' }}
            onClick={() =>
                onMsg({
                    type: 'on_activity_transaction_click',
                    transaction,
                    knownCurrencies,
                })
            }
        >
            <Group
                variant="default"
                aria-labelledby={`title-${transaction.hash}`}
            >
                <Column2 spacing={12}>
                    <Column2 spacing={4}>
                        <Text2
                            id={`title-${transaction.hash}`}
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
                    <Divider variant="secondary" />
                    <AssetList
                        displayLimit
                        transaction={transaction}
                        networkMap={networkMap}
                        knownCurrencies={knownCurrencies}
                    />
                </Column2>
            </Group>
        </div>
    )
}
