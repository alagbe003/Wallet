import { FeeInputButton } from 'src/uikit/Button/FeeInputButton'
import { LightArrowRight2 } from 'src/uikit/Icon/LightArrowRight2'
import { SkeletonSideBar } from '../components/SkeletonSideBar'
import { NetworkFeeLabel } from '../components/Labels'
import { Row } from '@zeal/uikit/Row'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_forecast_fee_click' }

export const Skeleton = ({ onMsg }: Props) => (
    <FeeInputButton
        onClick={() => onMsg({ type: 'on_forecast_fee_click' })}
        left={
            <>
                <NetworkFeeLabel />
            </>
        }
        right={
            <Row spacing={4}>
                <SkeletonSideBar />
                <LightArrowRight2 size={20} color="iconDefault" />
            </Row>
        }
    />
)
