import React from 'react'
import { StyleSheet, View } from 'react-native'

const SPACING = 8

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        columnGap: SPACING,
    },
    column: {
        flexDirection: 'column',
        rowGap: SPACING,
    },
})

type Props = {
    variant?: 'row' | 'column'
    children: React.ReactNode
}

export const Actions = ({ children, variant = 'row' }: Props) => (
    <View style={styles[variant]}>{children}</View>
)
