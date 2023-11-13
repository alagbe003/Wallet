import { notReachable } from '@zeal/toolkit'
import { ProgressThin } from 'src/uikit/ProgressThin'
import { Row } from '@zeal/uikit/Row'

type Props = {
    count: number
    activeStep: number
    stepAnimationTimeMs: number
}

type BarType = 'active' | 'passed' | 'future'

const getBarType = (activeIndex: number, index: number): BarType => {
    if (activeIndex === index) {
        return 'active'
    }

    if (activeIndex > index) {
        return 'passed'
    }

    if (activeIndex < index) {
        return 'future'
    }

    throw new Error('Impossible state in calculationg bar type')
}

export const ProgressStepper = ({
    count,
    activeStep,
    stepAnimationTimeMs,
}: Props) => {
    const bars = new Array(count).fill(true)

    return (
        <Row spacing={4}>
            {bars.map((_, index) => {
                const barType = getBarType(activeStep, index)

                switch (barType) {
                    case 'active':
                        return (
                            <ProgressThin
                                key={`${index}${barType}`}
                                background="neutral"
                                initialProgress={0}
                                progress={1}
                                animationTimeMs={stepAnimationTimeMs}
                            />
                        )
                    case 'passed':
                        return (
                            <ProgressThin
                                key={`${index}${barType}`}
                                background="neutral"
                                initialProgress={1}
                                progress={1}
                                animationTimeMs={stepAnimationTimeMs}
                            />
                        )
                    case 'future':
                        return (
                            <ProgressThin
                                key={`${index}${barType}`}
                                background="neutral"
                                initialProgress={0}
                                progress={0}
                                animationTimeMs={stepAnimationTimeMs}
                            />
                        )
                    /* istanbul ignore next */
                    default:
                        return notReachable(barType)
                }
            })}
        </Row>
    )
}
