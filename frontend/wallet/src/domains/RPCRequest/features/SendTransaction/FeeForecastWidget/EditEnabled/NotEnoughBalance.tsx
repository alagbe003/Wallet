import { Skeleton } from './Skeleton'
import { FeeInputButton } from 'src/uikit/Button/FeeInputButton'
import { NetworkFeeLabel, NotEnoughBalanceLabel } from '../components/Labels'
import { ForecastTime } from 'src/domains/Transactions/domains/ForecastDuration/components/ForecastTime'
import { getEstimatedFee } from 'src/domains/Transactions/domains/SimulatedTransaction/helpers/getEstimatedFee'
import { NotEnoughBalance as NotEnoughBalanceType } from 'src/domains/TransactionRequest/helpers/validateNotEnoughBalance'
import { LightDangerTriangle } from 'src/uikit/Icon/LightDangerTriangle'
import { FormattedFee } from 'src/domains/Transactions/domains/SimulatedTransaction/components/FormattedFee'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    pollingInterval: number
    pollingStartedAt: number
    error: NotEnoughBalanceType
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_forecast_fee_click' }

export const NotEnoughBalance = ({ error, onMsg }: Props) => {
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
                </>
            }
            message={<NotEnoughBalanceLabel error={error} />}
        />
    ) : (
        <Skeleton onMsg={onMsg} />
    )
}
