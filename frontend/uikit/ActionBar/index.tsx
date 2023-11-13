import React from 'react'
import { StyleSheet, View } from 'react-native'
import { styles as rowStyles } from '../Row'
import { Spacer } from '../Spacer'

const styles = StyleSheet.create({
    container: {
        ...rowStyles.row,
        ...rowStyles.XAlign_stretch,
        paddingBottom: 12,
        width: '100%',
    },
})

type Props = {
    left?: React.ReactNode
    right?: React.ReactNode
    center?: React.ReactNode
}

export const ActionBar = ({ left, right, center }: Props) => {
    return (
        <View style={styles.container}>
            {left}
            {center || <Spacer />}
            {right}
        </View>
    )
}
