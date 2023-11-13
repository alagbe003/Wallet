import React, { ReactNode, useEffect, useRef, useState } from 'react'
import {
    Animated,
    Easing,
    Text as NativeText,
    Pressable,
    StyleSheet,
    View,
} from 'react-native'
import { Column } from '../Column'
import { Row } from '../Row'
import { Text, styles as textStyles } from '../Text'
import { colors } from '../colors'

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surfaceDefault,
        overflow: 'hidden',
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    roundedContainer: {
        borderRadius: 8,
    },

    bar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
    },

    bar_default_neutral: {
        backgroundColor: colors.backgroundAlertNeutral,
    },
    bar_hovered_neutral: {
        backgroundColor: colors.backgroundAlertNeutralHover,
    },
    bar_pressed_neutral: {
        backgroundColor: colors.backgroundAlertNeutralClicked,
    },
    bar_default_success: {
        backgroundColor: colors.backgroundAlertSuccess,
    },
    bar_hovered_success: {
        backgroundColor: colors.backgroundAlertSuccessHover,
    },
    bar_pressed_success: {
        backgroundColor: colors.backgroundAlertSuccessClicked,
    },
    bar_default_critical: {
        backgroundColor: colors.backgroundAlertCritical,
    },
    bar_hovered_critical: {
        backgroundColor: colors.backgroundAlertCriticalHover,
    },
    bar_pressed_critical: {
        backgroundColor: colors.backgroundAlertCriticalClicked,
    },
    bar_default_warning: {
        backgroundColor: colors.backgroundAlertWarning,
    },
    bar_hovered_warning: {
        backgroundColor: colors.backgroundAlertWarningHover,
    },
    bar_pressed_warning: {
        backgroundColor: colors.backgroundAlertWarningClicked,
    },

    title_neutral: {
        ...textStyles.variant_paragraph,
        ...textStyles.weight_regular,
        ...textStyles.color_textStatusNeutralOnColor,
    },
    title_success: {
        ...textStyles.variant_paragraph,
        ...textStyles.weight_regular,
        ...textStyles.color_textStatusSuccessOnColor,
    },
    title_critical: {
        ...textStyles.variant_paragraph,
        ...textStyles.weight_regular,
        ...textStyles.color_textStatusCriticalOnColor,
    },
    title_warning: {
        ...textStyles.variant_paragraph,
        ...textStyles.weight_regular,
        ...textStyles.color_textStatusWarningOnColor,
    },
})

type Variant = 'neutral' | 'success' | 'critical' | 'warning'

type Props = {
    variant: Variant
    progress: number
    initialProgress: number | null
    title: ReactNode
    subtitle?: ReactNode
    rounded?: true
    right?: ReactNode
    onClick?: () => void
}

export const Progress = ({
    title,
    right,
    progress,
    initialProgress,
    subtitle,
    variant,
    rounded,
    onClick,
}: Props) => {
    const [labelId] = useState(crypto.randomUUID())
    const [descriptionId] = useState(crypto.randomUUID())

    const current = useRef(
        new Animated.Value(initialProgress ?? progress)
    ).current

    useEffect(() => {
        Animated.timing(current, {
            toValue: progress,
            duration: 700,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start()

        return () => current.stopAnimation()
    }, [progress, current])

    return (
        <Pressable
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
            role={onClick ? 'button' : 'progressbar'}
            disabled={!onClick}
            onPress={onClick}
            style={[styles.container, rounded && styles.roundedContainer]}
        >
            {({ pressed, hovered }) => (
                <>
                    <Animated.View
                        style={[
                            styles.bar,
                            styles[
                                `bar_${
                                    pressed
                                        ? 'pressed'
                                        : hovered
                                        ? 'hovered'
                                        : 'default'
                                }_${variant}`
                            ],
                            {
                                width: current.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0%', '100%'],
                                }),
                            },
                        ]}
                    />

                    <View>
                        <Column spacing={8}>
                            <Row spacing={4} alignX="stretch">
                                <NativeText
                                    id={labelId}
                                    style={styles[`title_${variant}`]}
                                >
                                    {title}
                                </NativeText>

                                {/* TODO: this used to be a Row with 4px gap; implemented as text because of text style inheritance constraints, might need to be revisited */}
                                <NativeText style={styles[`title_${variant}`]}>
                                    {right}
                                </NativeText>
                            </Row>

                            {subtitle && (
                                <Text
                                    id={descriptionId}
                                    variant="paragraph"
                                    weight="regular"
                                    color="textPrimary"
                                >
                                    {subtitle}
                                </Text>
                            )}
                        </Column>
                    </View>
                </>
            )}
        </Pressable>
    )
}
