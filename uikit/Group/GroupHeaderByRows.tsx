import { Column } from '@zeal/uikit/Column'
import { Row } from '@zeal/uikit/Row'
import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

type GroupHeaderByRowsProps = {
    topLeft: ReactNode
    topRight?: ReactNode
    bottomLeft: ReactNode
    bottomRight?: ReactNode
    onClick?: () => void
}

const styles = StyleSheet.create({
    base: {
        alignSelf: 'stretch',
        paddingHorizontal: 4,
    },
    clickable: {
        // @ts-ignore
        cursor: 'pointer',
    },
})

export const GroupHeaderByRows = ({
    onClick,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
}: GroupHeaderByRowsProps) => {
    return (
        <View style={[styles.base, onClick && styles.clickable]}>
            <Column spacing={4}>
                <Row spacing={0} alignX="stretch">
                    <View>{topLeft}</View>
                    <View>{topRight}</View>
                </Row>

                <Row spacing={0} alignX="stretch">
                    <View>{bottomLeft}</View>
                    <View>{bottomRight}</View>
                </Row>
            </Column>
        </View>
    )
}
