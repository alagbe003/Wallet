import React, { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, View } from 'react-native'
import { Extractor } from '../Extractor'
import { colors } from '../colors'

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        padding: 2,
    },

    progress: {
        backgroundColor: colors.borderSecondary,
        width: '100%',
        height: 4,
        borderRadius: 4,
        overflow: 'hidden',
    },

    bar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
    },

    background_neutral: { backgroundColor: colors.backgroundStatusNeutral },
    background_warning: { backgroundColor: colors.backgroundStatusWarning },
    background_critical: { backgroundColor: colors.backgroundStatusCritical },
    background_success: { backgroundColor: colors.backgroundStatusSuccess },
    background_primary: { backgroundColor: colors.iconAccent2 },
})

type Background = Extractor<keyof typeof styles, 'background'>

type Props = {
    initialProgress: number | null
    progress: number
    background: Background
    animationTimeMs: number
}

export const ProgressThin = ({
    initialProgress,
    progress,
    background,
    animationTimeMs,
}: Props) => {
    const current = useRef(
        new Animated.Value(initialProgress ?? progress)
    ).current

    useEffect(() => {
        Animated.timing(current, {
            toValue: progress,
            duration: animationTimeMs,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start()

        return () => current.stopAnimation()
    }, [progress, current, animationTimeMs])

    return (
        <View style={styles.wrapper}>
            <View style={styles.progress}>
                <Animated.View
                    style={[
                        styles.bar,
                        styles[`background_${background}`],
                        {
                            width: current.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%'],
                            }),
                        },
                    ]}
                />
            </View>
        </View>
    )
}
