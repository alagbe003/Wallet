import { LinearGradient } from 'expo-linear-gradient'
import React, { useRef } from 'react'
import { Animated, Easing, StyleSheet, View } from 'react-native'
import { Extractor } from '../Extractor'

const styles = StyleSheet.create({
    container: {
        borderRadius: 999,
        overflow: 'hidden',
    },

    variant_default: { backgroundColor: '#e4e7eb' },
    variant_transparent: {},

    splash: {
        width: '100%',
        height: '100%',
        borderRadius: 999,
    },
})

type Variant = Extractor<keyof typeof styles, 'variant'>

type Props = {
    variant: Variant
    height?: number
    width: number | `${number}%`
}

const DEFAULT_SKELETON_HEIGHT = 8

export const Skeleton = ({
    variant,
    height = DEFAULT_SKELETON_HEIGHT,
    width,
}: Props) => {
    const animatedValue = useRef(new Animated.Value(0)).current

    React.useEffect(() => {
        let timeout: ReturnType<typeof setTimeout> | null = null

        const startAnimation = () => {
            animatedValue.setValue(0)
            Animated.timing(animatedValue, {
                toValue: 1,
                easing: Easing.bezier(0.15, 0.5, 0.5, 1),
                duration: 750,
                useNativeDriver: true,
            }).start(() => {
                timeout = setTimeout(() => {
                    timeout = null
                    startAnimation()
                }, 750)
            })
        }

        startAnimation()

        return () => {
            animatedValue.stopAnimation()
            timeout && clearTimeout(timeout)
        }
    }, [animatedValue])

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['-100%', '100%'],
    })

    const animatedStyles = {
        ...styles.splash,
        transform: [{ translateX }],
    }

    const AnimatedLinearGradient =
        Animated.createAnimatedComponent(LinearGradient)

    return (
        <View
            style={[
                styles.container,
                styles[`variant_${variant}`],
                {
                    height: height,
                    minHeight: height,
                    width: width,
                    minWidth: width,
                },
            ]}
        >
            <AnimatedLinearGradient
                colors={['transparent', '#f9f9fa', 'transparent']}
                end={{ x: 1, y: 0 }}
                style={animatedStyles}
            />
        </View>
    )
}
