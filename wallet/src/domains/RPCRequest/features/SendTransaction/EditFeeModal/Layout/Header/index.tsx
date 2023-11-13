import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { notReachable } from '@zeal/toolkit'
import { Column2 } from 'src/uikit/Column2'
import { Row } from '@zeal/uikit/Row'
import { ProgressSpinner } from 'src/uikit/ProgressSpinner'
import { Spacer2 } from 'src/uikit/Spacer2'
import { FormattedMessage, useIntl } from 'react-intl'
import { NotSigned } from '@zeal/domains/TransactionRequest'

import { validateEditFormHeaderValidationError } from '../../../FeeForecastWidget/helpers/validation'
import { Time } from './Time'
import { Skeleton } from './Skeleton'
import { Layout } from './Layout'
import { Text2 } from 'src/uikit/Text2'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { MsgOf } from '@zeal/toolkit/MsgOf'

type Props = {
    pollableData: PollableData<FeeForecastResponse, FeeForecastRequest>
    pollingInterval: number
    transactionRequest: NotSigned
    pollingStartedAt: number
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof Layout>

export const Header = ({
    pollableData,
    transactionRequest,
    pollingInterval,
    pollingStartedAt,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    const validationData = validateEditFormHeaderValidationError({
        pollableData,
        transactionRequest,
    })

    switch (validationData.type) {
        case 'Failure':
            switch (validationData.reason.type) {
                case 'pollable_failed_to_fetch':
                    return (
                        <Column2
                            spacing={4}
                            aria-label={formatMessage({
                                id: 'EditFeeModal.Layout.Header.ariaLabel',
                                defaultMessage: 'Current fee',
                            })}
                        >
                            <Text2
                                variant="title1"
                                weight="bold"
                                color="textError"
                            >
                                <FormattedMessage
                                    id="EditFeeModal.Header.fee.unknown"
                                    defaultMessage="Fee unknown"
                                />
                            </Text2>

                            <Row spacing={12}>
                                <Time
                                    duration={{ type: 'OutsideOfForecast' }}
                                />

                                <Spacer2 />

                                <ProgressSpinner
                                    key={pollingStartedAt}
                                    durationMs={pollingInterval}
                                    size={16}
                                />
                            </Row>
                        </Column2>
                    )

                case 'not_enough_balance':
                    const { currencies } = validationData.reason.pollable.data
                    const nativeCurrency =
                        currencies[
                            validationData.reason.requiredAmount.currencyId
                        ]
                    return (
                        <Layout
                            errored={true}
                            message={
                                <FormattedMessage
                                    id="EditFeeModal.Header.NotEnoughBalance.errorMessage"
                                    defaultMessage="Need {amount} {symbol} to submit"
                                    values={{
                                        amount: (
                                            <FormattedTokenBalances
                                                knownCurrencies={currencies}
                                                money={
                                                    validationData.reason
                                                        .requiredAmount
                                                }
                                            />
                                        ),
                                        symbol: nativeCurrency.symbol,
                                    }}
                                />
                            }
                            pollableData={validationData.reason.pollable}
                            pollingInterval={pollingInterval}
                            pollingStartedAt={pollingStartedAt}
                            onMsg={onMsg}
                        />
                    )

                case 'pollable_data_loading':
                    return <Skeleton />

                /* istanbul ignore next */
                default:
                    return notReachable(validationData.reason)
            }

        case 'Success': {
            switch (validationData.data.pollable.type) {
                case 'loaded':
                case 'reloading':
                    return (
                        <Layout
                            pollingStartedAt={pollingStartedAt}
                            errored={false}
                            message={null}
                            pollableData={validationData.data.pollable}
                            pollingInterval={pollingInterval}
                            onMsg={onMsg}
                        />
                    )
                case 'subsequent_failed':
                    return (
                        <Layout
                            pollingStartedAt={pollingStartedAt}
                            errored={false}
                            message={
                                <FormattedMessage
                                    id="EditFeeModal.Header.subsequent_failed"
                                    defaultMessage="Estimates might be old, last refresh failed"
                                />
                            }
                            pollableData={validationData.data.pollable}
                            pollingInterval={pollingInterval}
                            onMsg={onMsg}
                        />
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(validationData.data.pollable)
            }
        }
        /* istanbul ignore next */
        default:
            return notReachable(validationData)
    }
}
