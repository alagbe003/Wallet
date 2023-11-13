import lottie from 'lottie-web'

import success from './success.json'
import radialProgress from './radial-progress.json'
import { useLayoutEffect, useRef } from 'react'
import { Base } from 'src/uikit/Base'
import { keys } from '@zeal/toolkit/Object'
import styled from 'styled-components'
import { size, SizeProps } from 'styled-system'
import { useLiveRef } from '@zeal/toolkit'

type AnimationName = 'success' | 'radial-progress'

type AnimationEvent = 'complete'

const ANIMATION_EVENTS: Record<AnimationEvent, unknown> = {
    complete: true,
}

type Props = {
    animation: AnimationName
    durationMs?: number
    onAnimationEvent?: (event: AnimationEvent) => void
    size: number
    loop: boolean
}

const ANIMATION_NAME_TO_DATA: Record<AnimationName, any> = {
    success,
    'radial-progress': radialProgress,
}

const AnimationStyled = styled(Base)<SizeProps>`
    ${size}
`

export const Animation = ({
    size,
    animation,
    durationMs,
    onAnimationEvent,
}: Props) => {
    const ref = useRef<HTMLDivElement>(null)
    const onAnimationEventRef = useLiveRef(onAnimationEvent)

    useLayoutEffect(() => {
        if (ref.current) {
            const animationData = ANIMATION_NAME_TO_DATA[animation]
            const item = lottie.loadAnimation({
                animationData,
                container: ref.current,
                loop: false,
            })

            if (durationMs) {
                item.setSpeed((item.getDuration() * 1000) / durationMs)
            }

            const events = keys(ANIMATION_EVENTS)

            events.forEach((eventName) => {
                item.addEventListener(eventName, () => {
                    if (onAnimationEventRef.current) {
                        onAnimationEventRef.current(eventName)
                    }
                })
            })

            return () => {
                events.forEach((eventName) => {
                    item.removeEventListener(eventName)
                })
                item.destroy()
            }
        }
    }, [animation, onAnimationEventRef, durationMs])

    return <AnimationStyled size={size} ref={ref} />
}
