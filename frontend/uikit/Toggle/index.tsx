import { notReachable } from '@zeal/toolkit'
import React, { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Text } from '../Text'
import { Switch } from './Switch'

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 8,
    },
    disabled: {
        // @ts-ignore
        cursor: 'not-allowed',
    },
})

type Size = 'regular' | 'small'

type Props = {
    title: React.ReactNode | null
    size: Size
    disabled?: boolean
    checked: boolean
    onClick: () => void
}

export const Toggle = ({ title, disabled, checked, onClick, size }: Props) => {
    const [titleId] = useState(crypto.randomUUID())

    const textVariant = (() => {
        switch (size) {
            case 'regular':
                return 'paragraph'
            case 'small':
                return 'caption1'
            default:
                notReachable(size)
        }
    })()

    return (
        <Pressable disabled={disabled} onPress={onClick}>
            <View style={[styles.container, disabled && styles.disabled]}>
                <Text
                    id={titleId}
                    weight="regular"
                    color="textSecondary"
                    variant={textVariant}
                >
                    {title}
                </Text>

                <Switch
                    aria-labelledby={titleId}
                    disabled={disabled}
                    value={checked}
                    size={size}
                />
            </View>
        </Pressable>
    )
}
