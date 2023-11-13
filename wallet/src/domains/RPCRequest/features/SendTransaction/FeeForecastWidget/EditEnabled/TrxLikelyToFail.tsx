import { FeeInputButton } from 'src/uikit/Button/FeeInputButton'
import { FormattedMessage } from 'react-intl'
import { notReachable } from '@zeal/toolkit'
import { LightArrowRight2 } from 'src/uikit/Icon/LightArrowRight2'
import {
    TrxLikelyToFail as TrxLikelyToFailType,
    TrxWillFailLessThenMinimumGas,
} from '../helpers/validation'
import { Skeleton } from './Skeleton'
import { NetworkFeeLabel } from '../components/Labels'
import { ForecastTime } from 'src/domains/Transactions/domains/ForecastDuration/components/ForecastTime'
import { getEstimatedFee } from 'src/domains/Transactions/domains/SimulatedTransaction/helpers/getEstimatedFee'
import { Text2 } from 'src/uikit/Text2'
import { FormattedFee } from 'src/domains/Transactions/domains/SimulatedTransaction/components/FormattedFee'
import { ProgressSpinner } from 'src/uikit/ProgressSpinner'
import { Row } from '@zeal/uikit/Row'
import { KeyStore } from '@zeal/domains/KeyStore'

type Props = {
    pollingInterval: number
    pollingStartedAt: number
    error: TrxLikelyToFailType<KeyStore> | TrxWillFailLessThenMinimumGas
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_forecast_fee_click' }

const Message = ({
    error,
}: {
    error: TrxLikelyToFailType<KeyStore> | TrxWillFailLessThenMinimumGas
}) => {
    switch (error.type) {
        case 'trx_will_fail_less_then_minimum_gas':
            return (
                <FormattedMessage
                    id="TrxLikelyToFail.less_them_minimum_gas.message"
                    defaultMessage="Transaction will fail"
                />
            )
        case 'trx_likely_to_fail':
            switch (error.reason) {
                case 'less_than_estimated_gas':
                    return (
                        <FormattedMessage
                            id="TrxLikelyToFail.less_them_estimated_gas.message"
                            defaultMessage="Transaction will fail"
                        />
                    )

                case 'less_than_suggested_gas':
                    return (
                        <FormattedMessage
                            id="TrxLikelyToFail.less_than_suggested_gas.message"
                            defaultMessage="Likely to fail"
                        />
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(error.reason)
            }

        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}

export const TrxLikelyToFail = ({
    error,
    pollingInterval,
    pollingStartedAt,
    onMsg,
}: Props) => {
    const preset = getEstimatedFee(error.pollable)

    return preset ? (
        <FeeInputButton
            onClick={() => onMsg({ type: 'on_forecast_fee_click' })}
            errored
            left={
                <>
                    <NetworkFeeLabel />
                    <ProgressSpinner
                        key={pollingStartedAt}
                        size={20}
                        durationMs={pollingInterval}
                    />
                </>
            }
            right={
                <>
                    <ForecastTime
                        errored
                        forecastDuration={preset.forecastDuration}
                        selectedPreset={error.pollable.params.selectedPreset}
                    />
                    <Row spacing={4}>
                        <Text2
                            variant="paragraph"
                            weight="regular"
                            color="textPrimary"
                        >
                            <FormattedFee
                                knownCurrencies={error.pollable.data.currencies}
                                fee={preset}
                            />
                        </Text2>
                        <LightArrowRight2 size={20} color="iconDefault" />
                    </Row>
                </>
            }
            message={<Message error={error} />}
        />
    ) : (
        <Skeleton onMsg={onMsg} />
    )
}
