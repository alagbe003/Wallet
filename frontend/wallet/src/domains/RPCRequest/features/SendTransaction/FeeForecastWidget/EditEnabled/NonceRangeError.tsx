import { FeeInputButton } from 'src/uikit/Button/FeeInputButton'
import { FormattedMessage } from 'react-intl'
import { notReachable } from '@zeal/toolkit'
import { LightArrowRight2 } from 'src/uikit/Icon/LightArrowRight2'

import {
    NonceRangeErrorBiggerThanCurrent,
    NonceRangeErrorLessThanCurrent,
} from '../helpers/validation'

import { Skeleton } from './Skeleton'
import { NetworkFeeLabel } from '../components/Labels'
import { ForecastTime } from 'src/domains/Transactions/domains/ForecastDuration/components/ForecastTime'
import { getEstimatedFee } from 'src/domains/Transactions/domains/SimulatedTransaction/helpers/getEstimatedFee'
import { FormattedFee } from 'src/domains/Transactions/domains/SimulatedTransaction/components/FormattedFee'
import { Text2 } from 'src/uikit/Text2'
import { LightDangerTriangle } from 'src/uikit/Icon/LightDangerTriangle'
import { Row } from '@zeal/uikit/Row'
import { KeyStore } from '@zeal/domains/KeyStore'

type Props = {
    error:
        | NonceRangeErrorBiggerThanCurrent<KeyStore>
        | NonceRangeErrorLessThanCurrent
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_forecast_fee_click' }

const Message = ({
    reason,
}: {
    reason:
        | NonceRangeErrorBiggerThanCurrent<KeyStore>
        | NonceRangeErrorLessThanCurrent
}) => {
    switch (reason.type) {
        case 'nonce_range_error_less_than_current':
            return (
                <FormattedMessage
                    id="NonceRangeError.less_than_current.message"
                    defaultMessage="Transaction will fail"
                />
            )

        case 'nonce_range_error_bigger_than_current':
            return (
                <FormattedMessage
                    id="NonceRangeError.bigger_than_current.message"
                    defaultMessage="Transaction will get stuck"
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(reason)
    }
}

export const NonceRangeError = ({ error, onMsg }: Props) => {
    const preset = getEstimatedFee(error.pollable)

    return preset ? (
        <FeeInputButton
            onClick={() => onMsg({ type: 'on_forecast_fee_click' })}
            errored
            left={
                <>
                    <NetworkFeeLabel />
                    <LightDangerTriangle size={20} color="iconStatusCritical" />
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
            message={<Message reason={error} />}
        />
    ) : (
        <Skeleton onMsg={onMsg} />
    )
}
