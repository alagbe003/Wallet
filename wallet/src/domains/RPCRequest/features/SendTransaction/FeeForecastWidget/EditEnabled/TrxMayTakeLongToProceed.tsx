import {
    TrxMayTakeLongToProceedBaseFeeLow as TrxMayTakeLongToProceedBaseFeeLowType,
    TrxMayTakeLongToProceedGasPriceLow as TrxMayTakeLongToProceedGasPriceLowType,
    TrxMayTakeLongToProceedPriorityFeeLow as TrxMayTakeLongToProceedPriorityFeeLowType,
} from '../helpers/validation'

import { Skeleton } from './Skeleton'

import { FeeInputButton } from 'src/uikit/Button/FeeInputButton'
import { FormattedMessage } from 'react-intl'
import { LightArrowRight2 } from 'src/uikit/Icon/LightArrowRight2'
import { NetworkFeeLabel } from '../components/Labels'
import { ForecastTime } from 'src/domains/Transactions/domains/ForecastDuration/components/ForecastTime'
import { getEstimatedFee } from 'src/domains/Transactions/domains/SimulatedTransaction/helpers/getEstimatedFee'
import { FormattedFee } from 'src/domains/Transactions/domains/SimulatedTransaction/components/FormattedFee'
import { Text2 } from 'src/uikit/Text2'
import { ProgressSpinner } from 'src/uikit/ProgressSpinner'
import { Row } from '@zeal/uikit/Row'
import { KeyStore } from '@zeal/domains/KeyStore'

type Props = {
    pollingInterval: number
    pollingStartedAt: number
    error:
        | TrxMayTakeLongToProceedBaseFeeLowType<KeyStore>
        | TrxMayTakeLongToProceedGasPriceLowType<KeyStore>
        | TrxMayTakeLongToProceedPriorityFeeLowType<KeyStore>
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_forecast_fee_click' }

export const TrxMayTakeLongToProceed = ({
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

                        <LightArrowRight2 size={24} color="iconDefault" />
                    </Row>
                </>
            }
            message={
                <FormattedMessage
                    id="FeeForecastWiget.TrxMayTakeLongToProceed.errorMessage"
                    defaultMessage="Might take long to process"
                />
            }
        />
    ) : (
        <Skeleton onMsg={onMsg} />
    )
}
