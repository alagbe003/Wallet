import { Column2 } from 'src/uikit/Column2'
import { Row } from '@zeal/uikit/Row'
import { Skeleton as UISkeleton } from 'src/uikit/Skeleton'
import { SkeletonContainer } from 'src/uikit/SkeletonContainer'

export const Skeleton = () => {
    return (
        <SkeletonContainer>
            <Column2 spacing={8}>
                <Row spacing={0} alignX="stretch">
                    <UISkeleton variant="default" height={19} width={60} />
                    <UISkeleton variant="default" height={19} width={30} />
                </Row>

                <Row spacing={0} alignX="stretch">
                    <UISkeleton variant="default" height={19} width={60} />
                    <UISkeleton variant="default" height={19} width={70} />
                </Row>

                <UISkeleton variant="default" width={30} height={4} />
            </Column2>
        </SkeletonContainer>
    )
}
