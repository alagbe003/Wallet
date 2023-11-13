import React, { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { InternalItem, Props as InternalItemProps } from './InternalItem'
import { v4 as uuid } from 'uuid'
import { Extractor } from '@zeal/uikit/Extractor'
import { colors } from '@zeal/uikit/colors'

type Props = {
    variant?: Extractor<keyof typeof styles, 'variant'>
    onClick?: () => void
    'aria-selected': boolean
} & InternalItemProps

export const styles = StyleSheet.create({
    container: {
        // @ts-ignore
        cursor: 'auto',
        padding: 8,
        borderRadius: 5,
    },
    selected: {
        backgroundColor: colors.backgroundLight,
    },
    variant_default: {},
    variant_solid: {
        backgroundColor: colors.backgroundLight,
    },
    variant_warning: {
        backgroundColor: colors.backgroundAlertWarning,
    },
    variant_critical: {
        backgroundColor: colors.backgroundAlertCritical,
    },

    clickable: {
        // @ts-ignore
        cursor: 'pointer',
        transitionProperty: 'border-color',
        transitionTimingFunction: 'ease',
        transitionDuration: '0.3s',
    },
    clickable_hover: {
        backgroundColor: colors.actionSecondaryHovered,
    },
    clickable_active: {
        backgroundColor: colors.actionSecondaryPressed,
    },
})

export const ListItem = ({
    variant = 'default',
    onClick,
    primaryText,
    primaryTextIcon,
    shortText,
    side,
    avatar,
    size,
    'aria-selected': ariaSelected,
}: Props) => {
    const [labelId] = useState(`list-item-label-${uuid()}`)
    const [descriptionId] = useState(`list-item-desc-${uuid()}`)

    return (
        <Pressable
            onPress={onClick}
            role={onClick ? 'button' : 'listitem'}
            aria-selected={ariaSelected}
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
        >
            {({ hovered, pressed }) => (
                <View
                    style={[
                        styles.container,
                        styles[`variant_${variant}`],
                        onClick && styles.clickable,
                        onClick && hovered && styles.clickable_hover,
                        onClick && pressed && styles.clickable_active,
                    ]}
                >
                    <InternalItem
                        size={size}
                        primaryText={primaryText}
                        primaryTextId={labelId}
                        primaryTextIcon={primaryTextIcon}
                        shortText={shortText}
                        sortTextId={descriptionId}
                        side={side}
                        avatar={avatar}
                    />
                </View>
            )}
        </Pressable>
    )
}
