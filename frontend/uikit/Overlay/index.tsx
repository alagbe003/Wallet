import React from 'react'
import { GestureResponderEvent, Pressable, StyleSheet } from 'react-native'
import { colors } from '@zeal/uikit/colors'

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundColor: colors.backgroundOverlay,
        cursor: 'default',
    },
})

type Props = {
    onClick: (event: GestureResponderEvent) => void
    children?: React.ReactNode
}

export const Overlay = ({ onClick, children }: Props) => {
    return (
        <Pressable onPress={onClick} style={[styles.container]}>
            {children}
        </Pressable>
    )
}
