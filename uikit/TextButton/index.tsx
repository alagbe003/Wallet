import React from 'react'
import { StyleSheet, Text } from 'react-native'

type Props = {
    children: React.ReactNode
    onClick: () => void
}

const styles = StyleSheet.create({
    base: {
        // @ts-ignore
        pointer: 'cursor',
        textDecorationLine: 'underline',
    },
})

export const TextButton = ({ children, onClick }: Props) => {
    return (
        <Text onPress={onClick} style={[styles.base]}>
            {children}
        </Text>
    )
}
