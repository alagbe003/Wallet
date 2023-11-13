import { FormattedMessage } from 'react-intl'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { ApprovalTransaction } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { Text2 } from 'src/uikit/Text2'

import { Avatar } from 'src/domains/Currency/components/Avatar'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { CurrencyBadge } from 'src/domains/SafetyCheck/components/CurrencyBadge'
import { IconButton } from 'src/uikit'
import { Column2 } from 'src/uikit/Column2'
import { InfoCircle } from 'src/uikit/Icon/InfoCircle'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Row } from '@zeal/uikit/Row'
import { Spacer2 } from 'src/uikit/Spacer2'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { BoldDangerTriangle } from 'src/uikit/Icon/BoldDangerTriangle'
import { notReachable } from '@zeal/toolkit'
import { ApprovalAmount } from '@zeal/domains/Transactions'

type Props = {
    transaction: ApprovalTransaction
    checks: TransactionSafetyCheck[]
    knownCurrencies: KnownCurrencies
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_spend_limit_info_click' }
    | { type: 'on_spend_limit_warning_click' }

export const Layout = ({
    transaction,
    knownCurrencies,
    checks,
    onMsg,
}: Props) => {
    const { amount } = transaction.amount
    const currency = useCurrencyById(amount.currencyId, knownCurrencies)

    return (
        <Column2 spacing={8}>
            {currency && (
                <ListItem2
                    avatar={({ size }) => (
                        <Avatar
                            size={size}
                            currency={currency}
                            rightBadge={({ size }) => (
                                <CurrencyBadge
                                    size={size}
                                    currencyId={currency.id}
                                    safetyChecks={checks}
                                />
                            )}
                        />
                    )}
                    aria-selected={false}
                    size="large"
                    primaryText={currency.symbol}
                />
            )}

            <Row spacing={0}>
                <Row spacing={4}>
                    <Text2
                        variant="paragraph"
                        weight="regular"
                        color="textSecondary"
                    >
                        <FormattedMessage
                            id="simulation.approval.spend-limit.label"
                            defaultMessage="Spend limit"
                        />
                    </Text2>
                    <IconButton
                        onClick={() =>
                            onMsg({ type: 'on_spend_limit_info_click' })
                        }
                    >
                        <InfoCircle size={14} />
                    </IconButton>
                </Row>
                <Spacer2 />
                <FormattedApprovalAmount
                    onMsg={onMsg}
                    approvalAmount={transaction.amount}
                    knownCurrencies={knownCurrencies}
                />
            </Row>
        </Column2>
    )
}

const FormattedApprovalAmount = ({
    approvalAmount,
    knownCurrencies,
    onMsg,
}: {
    approvalAmount: ApprovalAmount
    knownCurrencies: KnownCurrencies
    onMsg: (msg: Msg) => void
}) => {
    switch (approvalAmount.type) {
        case 'Limited':
            return (
                <Text2
                    variant="paragraph"
                    weight="regular"
                    color="textSecondary"
                >
                    <FormattedTokenBalances
                        money={approvalAmount.amount}
                        knownCurrencies={knownCurrencies}
                    />
                </Text2>
            )

        case 'Unlimited':
            return (
                <Row spacing={8}>
                    <IconButton
                        onClick={() =>
                            onMsg({ type: 'on_spend_limit_warning_click' })
                        }
                    >
                        <BoldDangerTriangle
                            size={14}
                            color="iconStatusWarning"
                        />
                    </IconButton>
                    <Text2
                        variant="paragraph"
                        weight="regular"
                        color="textSecondary"
                    >
                        <FormattedMessage
                            id="simulation.approve.unlimited"
                            defaultMessage="Unlimited"
                        />
                    </Text2>
                </Row>
            )

        /* istanbul ignore next */
        default:
            return notReachable(approvalAmount)
    }
}
