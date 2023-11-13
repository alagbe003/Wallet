import { StyleSheet, View } from 'react-native'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const styles = StyleSheet.create({
    headerBox: {
        padding: 12,
    },
})

export const HeaderBox = ({ children }: Props) => (
    <View style={styles.headerBox}>{children}</View>
)
