import React from 'react'
import {
    GestureResponderEvent,
    Pressable,
    StyleSheet,
    Text,
} from 'react-native'
import { colors } from '@zeal/uikit/colors'

const styles = StyleSheet.create({
    base: {
        backgroundColor: 'transparent',
        cursor: 'pointer',
        gap: 4,
        color: colors.iconDefault,
        display: 'flex',
        border: 'none',
    },

    pressed: {
        color: colors.textAccent2,
    },

    hover: {
        color: colors.iconHover,
    },

    active: {
        color: colors.iconPressed,
    },
})

type Props = {
    children: React.ReactNode
    'aria-label'?: string // TODO Should not be optional
    'aria-pressed'?: boolean
    onClick: (e: GestureResponderEvent) => void
}

export const IconButton = ({
    'aria-label': ariaLabel,
    'aria-pressed': ariaPressed,
    children,
    onClick,
}: Props) => {
    return (
        <Pressable
            aria-label={ariaLabel}
            aria-pressed={ariaPressed}
            onPress={onClick}
        >
            {({ pressed, hovered }) => (
                <Text
                    style={[
                        styles.base,
                        pressed && styles.active,
                        hovered && styles.hover,
                    ]}
                >
                    {children}
                </Text>
            )}
        </Pressable>
    )
}
