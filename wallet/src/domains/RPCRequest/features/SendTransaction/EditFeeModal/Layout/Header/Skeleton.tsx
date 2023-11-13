import { Column2 } from 'src/uikit/Column2'
import { Row } from '@zeal/uikit/Row'
import { Skeleton as UISkeleton } from 'src/uikit/Skeleton'

export const Skeleton = () => (
    <Column2 spacing={4}>
        <UISkeleton variant="default" height={35} width={75} />

        <Row spacing={12}>
            <UISkeleton variant="default" height={18} width={120} />

            <UISkeleton variant="default" height={18} width={35} />
        </Row>
    </Column2>
)
