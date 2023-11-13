import { FormattedMessage, useIntl } from 'react-intl'
import { PermitExpiration } from 'src/domains/RPCRequest/domains/SignMessageSimulation'
import { notReachable } from '@zeal/toolkit'
import { BoldDangerTriangle } from 'src/uikit/Icon/BoldDangerTriangle'
import { Row } from '@zeal/uikit/Row'
import { add } from 'date-fns'
import { Lock } from 'src/uikit/Icon/Bold/Lock'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import React from 'react'
import { IconButton } from 'src/uikit'
import { useReadableDuration } from '@zeal/toolkit/Date/useReadableDuration'
import { Currency } from '@zeal/domains/Currency'

type Props = {
    nowTimestampMs: number
    permitExpiration: PermitExpiration
    currency: Currency
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_editing_locked_click' }
    | { type: 'on_expiration_time_warning_click' }

const TOO_LONG_EXPIRATION_THRESHOLD_HOURS = 24 // TODO: Extract this? Reused in form

export const ExpirationTime = ({
    permitExpiration,
    nowTimestampMs,
    currency,
    onMsg,
}: Props) => {
    const formatHumanReadableDuration = useReadableDuration()
    const { formatMessage } = useIntl()

    switch (permitExpiration.type) {
        case 'FiniteExpiration':
            return add(nowTimestampMs, {
                hours: TOO_LONG_EXPIRATION_THRESHOLD_HOURS,
            }).valueOf() > permitExpiration.timestamp ? (
                <Tertiary
                    aria-label={formatMessage(
                        {
                            id: 'permit.edit-expiration',
                            defaultMessage: 'Edit {currency} expiration',
                        },
                        { currency: currency.symbol }
                    )}
                    color="on_light"
                    size="regular"
                    onClick={() => onMsg({ type: 'on_editing_locked_click' })}
                >
                    {formatHumanReadableDuration(
                        permitExpiration.timestamp - nowTimestampMs,
                        'ceil',
                        'long'
                    )}
                    <Lock size={14} />
                </Tertiary>
            ) : (
                <Row spacing={8}>
                    <IconButton
                        aria-label={formatMessage(
                            {
                                id: 'permit.expiration-warning',
                                defaultMessage: '{currency} expiration warning',
                            },
                            { currency: currency.symbol }
                        )}
                        onClick={() =>
                            onMsg({ type: 'on_expiration_time_warning_click' })
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
                                id: 'permit.edit-expiration',
                                defaultMessage: 'Edit {currency} expiration',
                            },
                            { currency: currency.symbol }
                        )}
                        color="on_light"
                        size="regular"
                        onClick={() =>
                            onMsg({ type: 'on_editing_locked_click' })
                        }
                    >
                        {formatHumanReadableDuration(
                            permitExpiration.timestamp - nowTimestampMs,
                            'ceil',
                            'long'
                        )}
                        <Lock size={14} />
                    </Tertiary>
                </Row>
            )
        case 'InfiniteExpiration':
            return (
                <Row spacing={8}>
                    <IconButton
                        aria-label={formatMessage(
                            {
                                id: 'permit.expiration-warning',
                                defaultMessage: '{currency} expiration warning',
                            },
                            { currency: currency.symbol }
                        )}
                        onClick={() =>
                            onMsg({ type: 'on_expiration_time_warning_click' })
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
                                id: 'permit.edit-expiration',
                                defaultMessage: 'Edit {currency} expiration',
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
                            id="permit.expiration.never"
                            defaultMessage="Never"
                        />
                        <Lock size={14} />
                    </Tertiary>
                </Row>
            )
        default:
            return notReachable(permitExpiration)
    }
}
