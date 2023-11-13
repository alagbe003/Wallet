import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Currency, KnownCurrencies } from '@zeal/domains/Currency'
import { Avatar } from 'src/domains/Currency/components/Avatar'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { SignMessageRequest } from '@zeal/domains/RPCRequest'
import {
    PermitAllowance,
    SimulatedSignMessage,
} from 'src/domains/RPCRequest/domains/SignMessageSimulation'
import { ExpirationTime } from 'src/domains/RPCRequest/domains/SignMessageSimulation/components/ExpirationTime'
import { SignMessageSafetyCheck } from '@zeal/domains/SafetyCheck'
import { CurrencyBadge } from 'src/domains/SafetyCheck/components/CurrencyBadge'
import { notReachable } from '@zeal/toolkit'
import { IconButton } from 'src/uikit'
import { Column2 } from 'src/uikit/Column2'
import { Divider } from 'src/uikit/Divider'
import { InfoCircle } from 'src/uikit/Icon/InfoCircle'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Row } from '@zeal/uikit/Row'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Text2 } from 'src/uikit/Text2'

import { Message } from '../../../Message'
import { ApprovalAmount } from '@zeal/domains/Transactions'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { FormattedTokenBalances } from 'src/domains/Money/components/FormattedTokenBalances'
import { BoldDangerTriangle } from 'src/uikit/Icon/BoldDangerTriangle'
import { Lock } from 'src/uikit/Icon/Bold/Lock'
import { MsgOf } from '@zeal/toolkit/MsgOf'

type Props = {
    request: SignMessageRequest
    simulatedSignMessage: SimulatedSignMessage
    knownCurrencies: KnownCurrencies
    safetyChecks: SignMessageSafetyCheck[]
    nowTimestampMs: number
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_spend_limit_info_icon_clicked' }
    | { type: 'on_expiration_info_icon_clicked' }
    | { type: 'on_spend_limit_warning_click' }
    | MsgOf<typeof ExpirationTime>

export const Content = ({
    simulatedSignMessage,
    knownCurrencies,
    safetyChecks,
    request,
    nowTimestampMs,
    onMsg,
}: Props) => {
    switch (simulatedSignMessage.type) {
        case 'Permit2SignMessage':
            return (
                <Column2 spacing={8}>
                    {simulatedSignMessage.allowances.map(
                        (permitAllowance, index) => (
                            <React.Fragment
                                key={`${permitAllowance.amount.amount.currencyId}${index}`}
                            >
                                <PermitAllowanceItem
                                    permitAllowance={permitAllowance}
                                    knownCurrencies={knownCurrencies}
                                    safetyChecks={safetyChecks}
                                    nowTimestampMs={nowTimestampMs}
                                    onMsg={onMsg}
                                />

                                {index !==
                                    simulatedSignMessage.allowances.length -
                                        1 && <Divider variant="secondary" />}
                            </React.Fragment>
                        )
                    )}
                </Column2>
            )

        case 'PermitSignMessage':
        case 'DaiPermitSignMessage':
            return (
                <PermitAllowanceItem
                    permitAllowance={simulatedSignMessage.allowance}
                    knownCurrencies={knownCurrencies}
                    safetyChecks={safetyChecks}
                    nowTimestampMs={nowTimestampMs}
                    onMsg={onMsg}
                />
            )

        case 'UnknownSignMessage':
            return <Message request={request} />

        default:
            return notReachable(simulatedSignMessage)
    }
}

const PermitAllowanceItem = ({
    permitAllowance,
    knownCurrencies,
    safetyChecks,
    nowTimestampMs,
    onMsg,
}: {
    permitAllowance: PermitAllowance
    knownCurrencies: KnownCurrencies
    safetyChecks: SignMessageSafetyCheck[]
    nowTimestampMs: number
    onMsg: (msg: Msg) => void
}) => {
    const { formatMessage } = useIntl()

    const currency = useCurrencyById(
        permitAllowance.amount.amount.currencyId,
        knownCurrencies
    )
    return (
        currency && (
            <Column2 spacing={8}>
                <ListItem2
                    avatar={({ size }) => (
                        <Avatar
                            size={size}
                            currency={currency}
                            rightBadge={({ size }) => (
                                <CurrencyBadge
                                    size={size}
                                    currencyId={currency.id}
                                    safetyChecks={safetyChecks}
                                />
                            )}
                        />
                    )}
                    aria-selected={false}
                    size="large"
                    primaryText={currency.symbol}
                />

                <Row spacing={4}>
                    <Row spacing={4}>
                        <Text2
                            variant="paragraph"
                            weight="regular"
                            color="textSecondary"
                        >
                            <FormattedMessage
                                id="sign.PermitAllowanceItem.spendLimit"
                                defaultMessage="Spend limit"
                            />
                        </Text2>
                        <IconButton
                            aria-label={formatMessage(
                                {
                                    id: 'permit.spend-limit.info',
                                    defaultMessage:
                                        '{currency} spend limit info',
                                },
                                { currency: currency.symbol }
                            )}
                            onClick={() =>
                                onMsg({
                                    type: 'on_spend_limit_info_icon_clicked',
                                })
                            }
                        >
                            <InfoCircle size={14} />
                        </IconButton>
                    </Row>
                    <Spacer2 />
                    <FormattedApprovalAmount
                        currency={currency}
                        onMsg={onMsg}
                        approvalAmount={permitAllowance.amount}
                        knownCurrencies={knownCurrencies}
                    />
                </Row>

                <Row spacing={4}>
                    <Row spacing={4}>
                        <Text2
                            variant="paragraph"
                            weight="regular"
                            color="textSecondary"
                        >
                            <FormattedMessage
                                id="permit.edit-modal.expiresIn"
                                defaultMessage="Expires in…"
                            />
                        </Text2>
                        <IconButton
                            aria-label={formatMessage(
                                {
                                    id: 'permit.expiration.info',
                                    defaultMessage:
                                        '{currency} expiration info',
                                },
                                { currency: currency.symbol }
                            )}
                            onClick={() =>
                                onMsg({
                                    type: 'on_expiration_info_icon_clicked',
                                })
                            }
                        >
                            <InfoCircle size={14} />
                        </IconButton>
                    </Row>
                    <Spacer2 />
                    <ExpirationTime
                        currency={currency}
                        nowTimestampMs={nowTimestampMs}
                        permitExpiration={permitAllowance.expiration}
                        onMsg={onMsg}
                    />
                </Row>
            </Column2>
        )
    )
}

const FormattedApprovalAmount = ({
    approvalAmount,
    knownCurrencies,
    onMsg,
    currency,
}: {
    currency: Currency
    approvalAmount: ApprovalAmount
    knownCurrencies: KnownCurrencies
    onMsg: (msg: Msg) => void
}) => {
    const { formatMessage } = useIntl()

    switch (approvalAmount.type) {
        case 'Limited':
            return (
                <Tertiary
                    aria-label={formatMessage(
                        {
                            id: 'permit.edit-limit',
                            defaultMessage: 'Edit {currency} spend limit',
                        },
                        { currency: currency.symbol }
                    )}
                    color="on_light"
                    size="regular"
                    onClick={() => onMsg({ type: 'on_editing_locked_click' })}
                >
                    <FormattedTokenBalances
                        money={approvalAmount.amount}
                        knownCurrencies={knownCurrencies}
                    />
                    <Lock size={14} />
                </Tertiary>
            )

        case 'Unlimited':
            return (
                <Row spacing={8}>
                    <IconButton
                        aria-label={formatMessage(
                            {
                                id: 'permit.spend-limit.warning',
                                defaultMessage:
                                    '{currency} spend limit warning',
                            },
                            { currency: currency.symbol }
                        )}
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
                        aria-label={formatMessage(
                            {
                                id: 'permit.edit-limit',
                                defaultMessage: 'Edit {currency} spend limit',
                            },
                            { currency: currency.symbol }
                        )}
                        color="on_light"
                        size="regular"
                        onClick={() =>
                            onMsg({ type: 'on_editing_locked_click' })
                        }
                    >
                        <FormattedMessage
                            id="simulation.approve.unlimited"
                            defaultMessage="Unlimited"
                        />
                        <Lock size={14} />
                    </Tertiary>
                </Row>
            )

        /* istanbul ignore next */
        default:
            return notReachable(approvalAmount)
    }
}
