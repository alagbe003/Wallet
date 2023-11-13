import React from 'react'
import { StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        columnGap: 8,
    },
})

type Props = {
    children: React.ReactNode
}

export const Actions = ({ children }: Props) => (
    <View style={styles.container}>{children}</View>
)
