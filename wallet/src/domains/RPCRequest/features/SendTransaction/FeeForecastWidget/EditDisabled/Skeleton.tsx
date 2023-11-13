import { FeeInputButton } from 'src/uikit/Button/FeeInputButton'
import { SkeletonSideBar } from '../components/SkeletonSideBar'
import { NetworkFeeLabel } from '../components/Labels'

export const Skeleton = () => (
    <FeeInputButton
        disabled
        left={<NetworkFeeLabel />}
        right={<SkeletonSideBar />}
    />
)
