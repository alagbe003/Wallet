import { FeeInputButton } from 'src/uikit/Button/FeeInputButton'
import { LightArrowRight2 } from 'src/uikit/Icon/LightArrowRight2'

import { PollableErrored } from '../helpers/validation'

import {
    CannotCalculateNetworkFeeLabel,
    NetworkFeeLabel,
    UnknownLabel,
} from '../components/Labels'
import { RetryButton } from '../components/RetryButton'
import { Row } from '@zeal/uikit/Row'

type Props = {
    error: PollableErrored
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_forecast_fee_click' }
    | { type: 'on_forecast_fee_error_reload_click' }

export const PollableErroredAndUserDidNotSelectedCustomPreset = ({
    onMsg,
}: Props) => {
    return (
        <FeeInputButton
            onClick={() => onMsg({ type: 'on_forecast_fee_click' })}
            errored
            left={
                <>
                    <NetworkFeeLabel />
                </>
            }
            right={
                <Row spacing={4}>
                    <UnknownLabel />
                    <LightArrowRight2 size={20} color="iconDefault" />
                </Row>
            }
            ctaButton={
                <RetryButton
                    onClick={() => {
                        onMsg({
                            type: 'on_forecast_fee_error_reload_click',
                        })
                    }}
                />
            }
            message={<CannotCalculateNetworkFeeLabel />}
        />
    )
}
