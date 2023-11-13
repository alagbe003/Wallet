import { FormattedMessage, useIntl } from 'react-intl'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { ApprovalTransaction } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { Text2 } from 'src/uikit/Text2'

import { Avatar } from 'src/domains/Currency/components/Avatar'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { CurrencyBadge } from 'src/domains/SafetyCheck/components/CurrencyBadge'
import { ApprovalAmount } from '@zeal/domains/Transactions'
import { notReachable } from '@zeal/toolkit'
import { IconButton } from 'src/uikit'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { Column2 } from 'src/uikit/Column2'
import { BoldDangerTriangle } from 'src/uikit/Icon/BoldDangerTriangle'
import { BoldEdit } from 'src/uikit/Icon/BoldEdit'
import { InfoCircle } from 'src/uikit/Icon/InfoCircle'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Row } from '@zeal/uikit/Row'
import { Spacer2 } from 'src/uikit/Spacer2'

type Props = {
    transaction: ApprovalTransaction
    checks: TransactionSafetyCheck[]
    knownCurrencies: KnownCurrencies
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_spend_limit_info_click' }
    | { type: 'on_edit_spend_limit_click' }
    | { type: 'on_spend_limit_warning_click' }

export const Layout = ({
    transaction,
    knownCurrencies,
    checks,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()

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
                        aria-label={formatMessage({
                            id: 'approval.spend_limit_info',
                            defaultMessage: 'What is spend limit?',
                        })}
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
    const { formatMessage } = useIntl()
    switch (approvalAmount.type) {
        case 'Limited':
            return (
                <Tertiary
                    aria-label={formatMessage({
                        id: 'approval.edit-limit.label',
                        defaultMessage: 'Edit spend limit',
                    })}
                    color="on_light"
                    size="regular"
                    onClick={() => onMsg({ type: 'on_edit_spend_limit_click' })}
                >
                    <FormattedTokenBalances
                        money={approvalAmount.amount}
                        knownCurrencies={knownCurrencies}
                    />
                    <BoldEdit size={14} />
                </Tertiary>
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
                    <Tertiary
                        aria-label="Edit spend limit"
                        color="on_light"
                        size="regular"
                        onClick={() =>
                            onMsg({ type: 'on_edit_spend_limit_click' })
                        }
                    >
                        <FormattedMessage
                            id="simulation.approve.unlimited"
                            defaultMessage="Unlimited"
                        />
                        <BoldEdit size={14} />
                    </Tertiary>
                </Row>
            )

        /* istanbul ignore next */
        default:
            return notReachable(approvalAmount)
    }
}
