import { notReachable } from '@zeal/toolkit'
import AnimatedLottieView from 'lottie-react-native'
import React from 'react'
import { View } from 'react-native'
import radialProgress from './radial-progress.json'
import success from './success.json'

type AnimationName = 'success' | 'radial-progress'

type AnimationEvent = 'complete'

type Props = {
    animation: AnimationName
    durationMs?: number
    loop: boolean
    onAnimationEvent?: (event: AnimationEvent) => void
    size: number
}

export const Animation = ({
    size,
    animation,
    durationMs,
    loop,
    onAnimationEvent,
}: Props) => {
    const animationJSON = (() => {
        switch (animation) {
            case 'radial-progress':
                return radialProgress
            case 'success':
                return success
            default:
                return notReachable(animation)
        }
    })()

    return (
        <View style={{ width: size, height: size }}>
            <AnimatedLottieView
                autoPlay
                loop={loop}
                source={animationJSON}
                duration={durationMs}
                onAnimationFinish={() =>
                    onAnimationEvent && onAnimationEvent('complete')
                }
            />
        </View>
    )
}
