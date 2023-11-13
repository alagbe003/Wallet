import React from 'react'
import {
    GestureResponderEvent,
    Pressable,
    StyleSheet,
    Text,
} from 'react-native'
import { styles as textStyles } from '@zeal/uikit/Text'
import { Extractor } from '@zeal/uikit/Extractor'
import { colors } from '@zeal/uikit/colors'

declare module 'react-native' {
    interface PressableStateCallbackType {
        hovered?: boolean
        focused?: boolean
    }
}

const styles = StyleSheet.create({
    pressable: {
        display: 'flex',
        flexDirection: 'row',
        maxWidth: '100%',
        flexShrink: 1,

        // @ts-ignore
        cursor: 'pointer',
    },
    container: {
        display: 'flex',
        maxWidth: '100%',
        columnGap: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabled: {
        // @ts-ignore
        cursor: 'not-allowed',
    },
    color_on_light: {
        ...textStyles.color_textSecondary,
    },
    hover_on_light: {
        ...textStyles.color_textPrimary,
    },
    active_on_light: {
        color: colors.actionPrimaryPressed,
    },
    disabled_on_light: {
        color: colors.textDisabled,
    },
    color_on_dark: {
        color: colors.darkActionSecondaryDefault,
    },
    hover_on_dark: {
        color: colors.darkActionSecondaryHover,
        textDecorationLine: 'underline',
    },
    active_on_dark: {
        color: colors.darkActionSecondaryPressed,
        textDecorationLine: 'underline',
    },
    disabled_on_dark: {
        color: colors.darkActionSecondaryDisabled,
    },
    color_critical: {
        color: colors.textStatusCriticalOnColor,
    },
    hover_critical: {
        color: colors.textStatusCriticalOnColorHover,
    },

    active_critical: {
        color: colors.textStatusCriticalOnColorPressed,
    },
    disabled_critical: {
        color: colors.textStatusCriticalOnColorDisabled,
    },
    color_success: {
        color: colors.textStatusSuccessOnColor,
    },
    hover_success: {
        color: colors.textStatusSuccessOnColorHover,
    },
    active_success: {
        color: colors.textStatusSuccessOnColorPressed,
    },
    disabled_success: {
        color: colors.textStatusSuccessOnColorDisabled,
    },
    color_neutral: {
        color: colors.textStatusNeutralOnColor,
    },
    hover_neutral: {
        color: colors.textStatusNeutralOnColorHover,
    },
    active_neutral: {
        color: colors.textStatusNeutralOnColorPressed,
    },
    disabled_neutral: {
        color: colors.textStatusNeutralOnColorDisabled,
    },
    color_warning: {
        color: colors.textStatusWarningOnColor,
    },
    hover_warning: {
        color: colors.textStatusWarningOnColorHover,
    },
    active_warning: {
        color: colors.textStatusWarningOnColorPressed,
    },
    disabled_warning: {
        color: colors.textStatusWarningOnColorDisabled,
    },

    size_xl: {
        ...textStyles.variant_title3,
        ...textStyles.weight_medium,
    },
    size_large: {
        ...textStyles.variant_callout,
        ...textStyles.weight_medium,
    },
    size_regular: {
        ...textStyles.variant_paragraph,
        ...textStyles.weight_regular,
    },
    size_small: {
        ...textStyles.variant_caption1,
        ...textStyles.weight_regular,
    },
})

type Props = {
    'aria-label'?: string
    size: Extractor<keyof typeof styles, 'size'>
    color: Extractor<keyof typeof styles, 'color'>
    disabled?: boolean
    // inline?: boolean
    children: React.ReactNode
    onClick?: (e: GestureResponderEvent) => void
}

export type Msg = { type: 'close' }

export const Tertiary = ({
    'aria-label': ariaLabel,
    disabled,
    color,
    onClick,
    size,
    children,
}: Props) => {
    return (
        <Pressable
            aria-label={ariaLabel}
            onPress={onClick}
            disabled={disabled}
            style={[styles.pressable, disabled && styles.disabled]}
        >
            {({ hovered, pressed }) => (
                <Text
                    style={[
                        styles.container,
                        styles[`color_${color}`],
                        styles[`size_${size}`],
                        hovered && styles[`hover_${color}`],
                        pressed && styles[`active_${color}`],
                    ]}
                >
                    {children}
                </Text>
            )}
        </Pressable>
    )
}
