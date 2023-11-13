import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from '@zeal/uikit/colors'
import { styles as textStyles } from '@zeal/uikit/Text'
import { Extractor } from '@zeal/uikit/Extractor'

const styles = StyleSheet.create({
    base: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: 2,
    },
    variant_bright: {
        backgroundColor: colors.surfaceDefault,
    },
    hover_variant_bright: {
        borderColor: colors.borderDefault,
        borderStyle: 'solid',
        borderWidth: 1,
    },
    icon_base: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon_left: {
        marginLeft: -4,
    },
    icon_right: {
        marginRight: -4,
    },
    icon_variant_bright: {
        color: colors.iconDefault,
    },
    hover_icon_variant_bright: {
        color: colors.iconHover,
    },
    active_icon_variant_bright: {
        color: colors.iconHover,
    },
    disabled_icon_variant_bright: {
        color: colors.iconDisabled,
    },
    text_variant_bright: {
        ...textStyles.variant_caption1,
        ...textStyles.weight_regular,
        ...textStyles.color_textPrimary,
    },
    disabled_variant_bright: {
        ...textStyles.color_textDisabled,
    },
})

type Variant = Extractor<keyof typeof styles, 'variant'>

type Props = {
    variant: Variant

    disabled?: boolean

    leftIcon?: ({ size }: { size: number }) => React.ReactNode
    rightIcon?: ({ size }: { size: number }) => React.ReactNode

    onClick: () => void

    children: React.ReactNode
}

const ICON_SIZE = 16

export const TagButton = ({
    children,
    variant,
    onClick,
    leftIcon,
    rightIcon,
    disabled,
}: Props) => {
    return (
        <Pressable role="button" disabled={disabled} onPress={onClick}>
            {({ pressed, hovered }) => (
                <View style={[styles.base, styles[`variant_${variant}`]]}>
                    {leftIcon && (
                        <Text
                            style={[
                                styles.icon_base,
                                styles.icon_left,
                                styles[`icon_variant_${variant}`],
                                hovered && styles.hover_icon_variant_bright,
                                pressed && styles.active_icon_variant_bright,
                                disabled &&
                                    styles[`disabled_icon_variant_${variant}`],
                            ]}
                        >
                            {leftIcon({ size: ICON_SIZE })}
                        </Text>
                    )}

                    <Text
                        style={[
                            styles[`text_variant_${variant}`],
                            disabled && styles[`disabled_variant_${variant}`],
                        ]}
                    >
                        {children}
                    </Text>

                    {rightIcon && (
                        <Text
                            style={[
                                styles.icon_base,
                                styles.icon_right,
                                styles[`icon_variant_${variant}`],
                                hovered && styles.hover_icon_variant_bright,
                                pressed && styles.active_icon_variant_bright,
                                disabled &&
                                    styles[`disabled_icon_variant_${variant}`],
                            ]}
                        >
                            {rightIcon({ size: ICON_SIZE })}
                        </Text>
                    )}
                </View>
            )}
        </Pressable>
    )
}
