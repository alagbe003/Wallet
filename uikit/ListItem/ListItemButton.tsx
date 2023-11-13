import React from 'react'
import { StyleSheet, Pressable, View } from 'react-native'
import { InternalItem, Props as InternalItemProps } from './InternalItem'
import { colors } from '@zeal/uikit/colors'

type Props = {
    onClick: () => void
} & Omit<InternalItemProps, 'size'>

const styles = StyleSheet.create({
    container: {
        cursor: 'pointer',
        borderRadius: 8,
        borderColor: colors.borderDefault,
        borderStyle: 'solid',
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    hover: {
        borderColor: colors.iconHover,
    },
    active: {
        borderColor: colors.borderSecondary,
    },
})

export const ListItemButton = ({
    onClick,
    primaryTextIcon,
    shortText,
    primaryText,
    side,
    avatar,
}: Props) => {
    return (
        <Pressable onPress={onClick}>
            {({ pressed, hovered }) => (
                <View
                    style={[
                        styles.container,
                        hovered && styles.hover,
                        pressed && styles.active,
                    ]}
                >
                    <InternalItem
                        size="large"
                        primaryText={primaryText}
                        primaryTextIcon={primaryTextIcon}
                        side={side}
                        avatar={avatar}
                        shortText={shortText}
                    />
                </View>
            )}
        </Pressable>
    )
}
