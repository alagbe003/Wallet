import { styles as textStyles } from '@zeal/uikit/Text'
import React, { ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Props = {
    rightId?: string
    right: ReactNode
    leftId?: string
    left: ReactNode
    onClick?: () => void
}

const styles = StyleSheet.create({
    clickable: {
        //@ts-ignore
        cursor: 'pointer',
    },
    base: {
        width: '100%',
        flexDirection: 'row',
        rowGap: 4,
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
    },
    text: {
        ...textStyles.color_textSecondary,
        ...textStyles.variant_paragraph,
        ...textStyles.weight_regular,
        flexDirection: 'row',
        rowGap: 4,
    },
})

export const GroupHeader = ({
    onClick,
    right,
    rightId,
    left,
    leftId,
}: Props) => {
    return (
        <View
            // @ts-ignore
            onClick={onClick}
            style={[styles.base, onClick && styles.clickable]}
        >
            <Text id={leftId} style={[styles.text]}>
                {left}
            </Text>
            <Text id={rightId} style={[styles.text]}>
                {right}
            </Text>
        </View>
    )
}
