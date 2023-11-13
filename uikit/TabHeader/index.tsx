import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { Text } from '../Text'

const styles = StyleSheet.create({
    nonSelectable: {
        // @ts-ignore
        cursor: 'auto',
    },
})

type Props = {
    selected: boolean
    children: React.ReactNode
    onClick?: () => void
}

export const TabHeader = ({ selected, children, onClick }: Props) => (
    <Pressable onPress={onClick} style={!onClick && styles.nonSelectable}>
        <Text
            variant="title3"
            weight="bold"
            color={selected ? 'textPrimary' : 'textSecondary'}
        >
            {children}
        </Text>
    </Pressable>
)
