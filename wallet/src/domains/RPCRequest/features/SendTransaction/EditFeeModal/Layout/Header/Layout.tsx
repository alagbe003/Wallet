import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { Column2 } from 'src/uikit/Column2'
import { Row } from '@zeal/uikit/Row'
import { ProgressSpinner } from 'src/uikit/ProgressSpinner'
import { FormattedFee } from 'src/domains/Transactions/domains/SimulatedTransaction/components/FormattedFee'
import { Spacer2 } from 'src/uikit/Spacer2'

import { Time } from './Time'
import { Skeleton } from './Skeleton'
import { FormattedMessage, useIntl } from 'react-intl'
import { Text2 } from 'src/uikit/Text2'
import { getEstimatedFee } from 'src/domains/Transactions/domains/SimulatedTransaction/helpers/getEstimatedFee'
import { TruncatedFeeInNativeTokenCurrency } from '@zeal/domains/Money/components/TruncatedFeeInNativeTokenCurrency'
import { notReachable } from '@zeal/toolkit'
import { FormattedFeeInDefaultCurrency } from '@zeal/domains/Money/components/FormattedFeeInDefaultCurrency'
import { IconButton } from 'src/uikit'
import { InfoCircle } from 'src/uikit/Icon/InfoCircle'

type Props = {
    pollableData: Extract<
        PollableData<FeeForecastResponse, FeeForecastRequest>,
        { type: 'loaded' | 'reloading' | 'subsequent_failed' }
    >
    message: React.ReactNode
    errored: boolean
    pollingInterval: number
    pollingStartedAt: number
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_max_fee_info_icon_click' }

export const Layout = ({
    pollingInterval,
    pollingStartedAt,
    pollableData,
    errored,
    message,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    const fee = getEstimatedFee(pollableData)

    return fee ? (
        <Column2
            aria-label={formatMessage({
                id: 'EditFeeModal.Layout.Header.ariaLabel',
                defaultMessage: 'Current fee',
            })}
            spacing={4}
        >
            <Text2
                variant="title1"
                weight="bold"
                color={errored ? 'textError' : 'textPrimary'}
            >
                <FormattedFee
                    fee={fee}
                    knownCurrencies={pollableData.data.currencies}
                />
            </Text2>

            <Row spacing={12}>
                {fee.priceInDefaultCurrency && (
                    <Row spacing={0}>
                        <Text2
                            variant="paragraph"
                            weight="regular"
                            color={errored ? 'textError' : 'textSecondary'}
                        >
                            <TruncatedFeeInNativeTokenCurrency
                                money={fee.priceInNativeCurrency}
                                knownCurrencies={pollableData.data.currencies}
                            />
                        </Text2>
                    </Row>
                )}

                {(() => {
                    switch (fee.type) {
                        case 'Eip1559Fee':
                            return (
                                fee.maxPriceInDefaultCurrency && (
                                    <Row spacing={4}>
                                        <Text2
                                            variant="paragraph"
                                            weight="regular"
                                            color={
                                                errored
                                                    ? 'textError'
                                                    : 'textSecondary'
                                            }
                                        >
                                            <FormattedMessage
                                                id="EditFeeModal.Header.fee.maxInDefaultCurrency"
                                                defaultMessage="Max {fee}"
                                                values={{
                                                    fee: (
                                                        <FormattedFeeInDefaultCurrency
                                                            money={
                                                                fee.maxPriceInDefaultCurrency
                                                            }
                                                            knownCurrencies={
                                                                pollableData
                                                                    .data
                                                                    .currencies
                                                            }
                                                        />
                                                    ),
                                                }}
                                            />
                                        </Text2>

                                        <IconButton
                                            onClick={() =>
                                                onMsg({
                                                    type: 'on_max_fee_info_icon_click',
                                                })
                                            }
                                        >
                                            <InfoCircle size={16} />
                                        </IconButton>
                                    </Row>
                                )
                            )
                        case 'LegacyFee':
                            return null

                        default:
                            return notReachable(fee)
                    }
                })()}

                <Time duration={fee.forecastDuration} />

                <Spacer2 />

                <ProgressSpinner
                    key={pollingStartedAt}
                    durationMs={pollingInterval}
                    size={16}
                />
            </Row>

            {message && (
                <Text2
                    variant="paragraph"
                    weight="regular"
                    color={errored ? 'textError' : 'textSecondary'}
                >
                    {message}
                </Text2>
            )}
        </Column2>
    ) : (
        <Skeleton />
    )
}
