import React from 'react'
import {
    GestureResponderEvent,
    Pressable,
    StyleSheet,
    Text,
} from 'react-native'
import { colors } from '@zeal/uikit/colors'
import { styles as textStyles } from '@zeal/uikit/Text'
import { Extractor } from '@zeal/uikit/Extractor'

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    base: {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        columnGap: 6,
        borderRadius: 5,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'transparent',
        cursor: 'pointer',
    },
    variant_tertiary: {
        color: colors.textSecondary,
    },
    hover_variant_tertiary: {
        color: colors.textPrimary,
    },
    active_variant_tertiary: {
        color: colors.actionPrimaryPressed,
    },
    disabled_variant_tertiary: {
        color: colors.textDisabled,
        cursor: 'not-allowed',
    },

    variant_secondary: {
        borderColor: colors.borderDefault,
        color: colors.textPrimary,
        backgroundColor: colors.actionSecondaryDefault,
    },
    hover_variant_secondary: {
        borderColor: colors.actionSecondaryHovered,
        color: colors.textPrimary,
        backgroundColor: colors.actionSecondaryHovered,
    },
    active_variant_secondary: {
        borderColor: colors.actionSecondaryPressed,
        color: colors.textPrimary,
        backgroundColor: colors.actionSecondaryPressed,
    },
    disabled_variant_secondary: {
        borderColor: colors.actionSecondaryDisabled,
        color: colors.textDisabled,
        backgroundColor: colors.actionSecondaryDisabled,
        cursor: 'not-allowed',
    },

    variant_primary: {
        color: colors.textOnPrimary,
        backgroundColor: colors.actionPrimaryDefault,
    },
    hover_variant_primary: {
        color: colors.textOnPrimary,
        backgroundColor: colors.actionPrimaryHovered,
    },
    active_variant_primary: {
        color: colors.textOnPrimary,
        backgroundColor: colors.actionPrimaryPressed,
    },
    disabled_variant_primary: {
        cursor: 'not-allowed',
        color: colors.textDisabled,
        backgroundColor: colors.actionPrimaryDisabled,
    },
    size_compressed: {
        height: 40,
        padding: 12,
        ...textStyles.variant_paragraph,
        ...textStyles.weight_medium,
    },

    size_regular: {
        height: 42,
        paddingVertical: 12,
        paddingHorizontal: 18,
        ...textStyles.variant_paragraph,
        ...textStyles.weight_medium,
    },

    size_small: {
        height: 31,
        paddingVertical: 8,
        paddingHorizontal: 12,
        ...textStyles.variant_caption1,
        ...textStyles.weight_medium,
    },
})

type Props = {
    'aria-label'?: string
    variant: Extractor<keyof typeof styles, 'variant'>
    size: Extractor<keyof typeof styles, 'size'>
    disabled?: boolean
    onClick?: (e: GestureResponderEvent) => void
    children: React.ReactNode
}

export const Button = ({
    size,
    variant,
    disabled,
    onClick,
    children,
    'aria-label': ariaLabel,
}: Props) => {
    return (
        <Pressable
            style={[styles.container]}
            aria-label={ariaLabel}
            role="button"
            disabled={disabled}
            onPress={onClick}
        >
            {({ pressed, hovered }) => (
                <Text
                    numberOfLines={1}
                    style={[
                        styles.base,
                        styles[`variant_${variant}`],
                        styles[`size_${size}`],
                        hovered && styles[`hover_variant_${variant}`],
                        pressed && styles[`active_variant_${variant}`],
                        disabled && styles[`disabled_variant_${variant}`],
                    ]}
                >
                    {children}
                </Text>
            )}
        </Pressable>
    )
}
