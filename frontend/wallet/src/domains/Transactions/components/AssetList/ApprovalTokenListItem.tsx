import { ApprovalAmount } from '@zeal/domains/Transactions'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { Network } from '@zeal/domains/Network'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { Avatar } from 'src/domains/Currency/components/Avatar'
import { Badge } from 'src/domains/Network/components/Badge'
import { FormattedTokenBalances } from 'src/domains/Money/components/FormattedTokenBalances'
import React from 'react'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { FormattedMessage } from 'react-intl'
import { notReachable } from '@zeal/toolkit'

export const ApprovalTokenListItem = ({
    approvalAmount,
    knownCurrencies,
    network,
}: {
    approvalAmount: ApprovalAmount
    knownCurrencies: KnownCurrencies
    network: Network
}) => {
    const currency = useCurrencyById(
        approvalAmount.amount.currencyId,
        knownCurrencies
    )

    return (
        <ListItem2
            aria-selected={false}
            size="regular"
            avatar={({ size }) => (
                <Avatar
                    currency={currency}
                    size={size}
                    rightBadge={({ size }) => (
                        <Badge size={size} network={network} />
                    )}
                />
            )}
            primaryText={currency?.symbol}
            side={{
                title: (
                    <Allowance
                        approvalAmount={approvalAmount}
                        knownCurrencies={knownCurrencies}
                    />
                ),
            }}
        />
    )
}

const Allowance = ({
    approvalAmount,
    knownCurrencies,
}: {
    approvalAmount: ApprovalAmount
    knownCurrencies: KnownCurrencies
}) => {
    switch (approvalAmount.type) {
        case 'Limited':
            return (
                <FormattedTokenBalances
                    money={approvalAmount.amount}
                    knownCurrencies={knownCurrencies}
                />
            )
        case 'Unlimited':
            return (
                <FormattedMessage
                    id="activity.approval-amount.unlimited"
                    defaultMessage="Unlimited"
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(approvalAmount)
    }
}
