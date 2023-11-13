import { colors } from '@zeal/uikit/colors'
import React from 'react'
import { StyleSheet, View } from 'react-native'

type Variant = 'compressed' | 'uncompressed'

type Props = {
    variant: Variant
    children?: React.ReactNode
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'stretch',
        borderRadius: 20,
        backgroundColor: colors.backgroundWidget,
    },

    variant_compressed: {
        paddingHorizontal: 16,
        paddingVertical: 9,
    },

    variant_uncompressed: {
        padding: 16,
    },
})

export const CompressableContainer = ({ variant, children }: Props) => {
    return (
        <View style={[styles.container, styles[`variant_${variant}`]]}>
            {children}
        </View>
    )
}
