import { notReachable } from '@zeal/toolkit'
import { Extractor } from '@zeal/uikit/Extractor'
import { OnboardingBackground } from '@zeal/uikit/Screen/OnboardingBackground'
import { colors } from '@zeal/uikit/colors'
import React from 'react'
import { ImageBackground, StyleSheet, View } from 'react-native'
// TODO: convert images/teal-bg.svg to an SVG subset that is compatible with rn-svg, so we don't need to use PNG images
import tealBackground from './images/teal-bg.png'

const styles = StyleSheet.create({
    container: {
        flexShrink: 1,
        height: '100%',
        width: '100%',
        overflowY: 'auto',
    },

    svgBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: -1,
    },

    pngBackground: {
        height: '100%',
        width: '100%',
    },

    padding_form: { padding: 16 },
    padding_main: { padding: 0 },
    padding_centered: { padding: 16, paddingTop: 52 },

    background_default: { backgroundColor: colors.surfaceDefault },
    background_magenta: { backgroundColor: colors.unknownColor },
    background_light: { backgroundColor: colors.surfaceLight },
    background_dark: { backgroundColor: colors.backgroundDark },
    background_surfaceDark: { backgroundColor: colors.surfaceDark },
    background_onboarding: {},
    background_teal: {},
})

type Padding = Extractor<keyof typeof styles, 'padding'>

type Background = Extractor<keyof typeof styles, 'background'>

type Props = {
    'aria-label'?: string
    'aria-labelledby'?: string
    padding: Padding
    background: Background
    children: React.ReactNode
}

export const Screen = ({
    padding,
    background,
    children,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
}: Props) => {
    switch (background) {
        case 'default':
        case 'magenta':
        case 'light':
        case 'dark':
        case 'surfaceDark':
            return (
                <View
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledBy}
                    style={[
                        styles.container,
                        styles[`padding_${padding}`],
                        styles[`background_${background}`],
                    ]}
                >
                    {children}
                </View>
            )

        case 'onboarding':
            return (
                <View
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledBy}
                    style={[styles.container, styles[`padding_${padding}`]]}
                >
                    <View style={styles.svgBackground}>
                        <OnboardingBackground />
                    </View>
                    {children}
                </View>
            )

        case 'teal':
            return (
                <ImageBackground
                    source={tealBackground}
                    resizeMode="cover"
                    style={styles.pngBackground}
                >
                    <View
                        aria-label={ariaLabel}
                        aria-labelledby={ariaLabelledBy}
                        style={[styles.container, styles[`padding_${padding}`]]}
                    >
                        {children}
                    </View>
                </ImageBackground>
            )
        default:
            return notReachable(background)
    }
}
