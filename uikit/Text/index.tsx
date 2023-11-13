import React from 'react'
import { StyleSheet, Text as NativeText } from 'react-native'

import { colors } from '../colors'
import { Extractor } from '../Extractor'

export const styles = StyleSheet.create({
    base: {
        fontFamily: 'Lexend, sans-serif',
        minWidth: 0,
    },

    variant_inherit: {},
    variant_caption1: {
        fontSize: 12,
        lineHeight: 15,
    },
    variant_title1: {
        fontSize: 28,
        lineHeight: 35,
        letterSpacing: -(28 * 0.0038),
    },
    variant_title2: {
        fontSize: 22,
        lineHeight: 28,
        letterSpacing: -(22 * 0.0026),
    },

    variant_title3: {
        fontSize: 20,
        lineHeight: 25,
        letterSpacing: -0.09,
    },

    variant_callout: {
        fontSize: 16,
        lineHeight: 20,
        letterSpacing: -(16 * 0.0031),
    },

    variant_footnote: {
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: -0.0104,
    },

    variant_paragraph: {
        fontSize: 14,
        lineHeight: 18,
        letterSpacing: -0.0602,
    },

    weight_inherit: {},
    weight_regular: {
        fontWeight: '400',
    },
    weight_medium: {
        fontWeight: '500',
    },
    weight_semi_bold: {
        fontWeight: '600',
    },
    weight_bold: {
        fontWeight: '700',
    },

    color_inherit: {},
    color_textOnDark: {
        color: colors.textOnDark,
    },

    color_textPrimary: {
        color: colors.textPrimary,
    },

    color_textDisabled: {
        color: colors.textDisabled,
    },

    color_textSecondary: {
        color: colors.textSecondary,
    },

    color_textError: {
        color: colors.textError,
    },

    color_textStatusCriticalOnColor: {
        color: colors.textStatusCriticalOnColor,
    },

    color_textOnDarkPrimary: {
        color: colors.textOnDarkPrimary,
    },

    color_textStatusWarning: {
        color: colors.textStatusWarning,
    },

    color_textStatusWarningOnColor: {
        color: colors.textStatusWarningOnColor,
    },

    color_textStatusNeutralOnColor: {
        color: colors.textStatusNeutralOnColor,
    },

    color_textStatusSuccess: {
        color: colors.textStatusSuccess,
    },

    color_textStatusSuccessOnColor: {
        color: colors.textStatusSuccessOnColor,
    },

    align_center: {
        textAlign: 'center',
    },
    align_left: {
        textAlign: 'left',
    },
})

type Variant = Extractor<keyof typeof styles, 'variant'>
type Weight = Extractor<keyof typeof styles, 'weight'>
type Color = Extractor<keyof typeof styles, 'color'>
type Align = Extractor<keyof typeof styles, 'align'>

type Props = {
    id?: string
    children: React.ReactNode
    variant?: Variant
    weight?: Weight
    color?: Color
    align?: Align
    ellipsis?: boolean
}

export const Text = ({
    id,
    children,
    color = 'inherit',
    align = 'left',
    variant = 'inherit',
    weight = 'inherit',
    ellipsis,
}: Props) => {
    return (
        <NativeText
            id={id}
            numberOfLines={ellipsis ? 1 : undefined}
            style={[
                styles.base,
                styles[`variant_${variant}`],
                styles[`weight_${weight}`],
                styles[`color_${color}`],
                styles[`align_${align}`],
            ]}
        >
            {children}
        </NativeText>
    )
}
