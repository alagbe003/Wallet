import { Pressable, StyleSheet, View } from 'react-native'
import React from 'react'
import { Text } from '@zeal/uikit/Text'
import { Checkbox } from '@zeal/uikit/Icon/Checkbox'
import { NotSelected } from '@zeal/uikit/Icon/NotSelected'
import { noop } from '@zeal/toolkit'
import { colors } from '@zeal/uikit/colors'

declare module 'react-native' {
    interface PressableStateCallbackType {
        hovered?: boolean
        focused?: boolean
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        minHeight: 40,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: colors.actionSecondaryDefault,
    },
    disabled: {
        backgroundColor: colors.actionSecondaryDisabled,
        cursor: 'not-allowed',
    },
    pressed: {
        backgroundColor: colors.actionSecondaryPressed,
    },
    hovered: {
        backgroundColor: colors.actionSecondaryHovered,
    },
})

type Props = {
    title: React.ReactNode
    disabled?: boolean
    checked: boolean
    onClick: () => void
}

export const CheckBox = ({ checked, onClick, disabled, title }: Props) => (
    <Pressable
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onPress={disabled ? noop : onClick}
        style={({ pressed, hovered }) => [
            styles.container,
            pressed && styles.pressed,
            hovered && styles.hovered,
            disabled && styles.disabled,
        ]}
    >
        <Text
            variant="paragraph"
            weight="regular"
            color={disabled ? 'textDisabled' : 'textPrimary'}
        >
            {title}
        </Text>
        <View>
            {checked ? (
                <Checkbox size={20} color="iconAccent2" />
            ) : (
                <NotSelected size={20} color="iconDefault" />
            )}
        </View>
    </Pressable>
)
