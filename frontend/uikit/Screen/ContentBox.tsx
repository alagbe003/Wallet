import { colors } from '@zeal/uikit/colors'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

type Props = {
    children: React.ReactNode
}

const styles = StyleSheet.create({
    scrollView: {
        width: '100%',
        padding: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: colors.backgroundLight,
    },
    content: {
        flexGrow: 1,
    },
})

export const ContentBox = ({ children }: Props) => (
    <ScrollView style={[styles.scrollView]}>
        <View style={styles.content}>{children}</View>
    </ScrollView>
)
