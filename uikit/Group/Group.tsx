import { colors } from '@zeal/uikit/colors'
import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

type Variant = 'compressed' | 'default'

type GroupProps = {
    'aria-labelledby'?: string
    'aria-label'?: string
    id?: string
    fill?: boolean
    variant: Variant
    scroll?: true
    children: ReactNode
}

export const styles = StyleSheet.create({
    group: {
        backgroundColor: colors.surfaceDefault,
        flexShrink: 1,
        width: '100%',
        borderRadius: 8,
    },
    variant_compressed: {},
    variant_default: {
        padding: 8,
        rowGap: 8,
    },
    scroll: {
        // @ts-ignore
        overflow: 'auto',
    },
})

export const Group = ({
    'aria-labelledby': ariaLabelledby,
    'aria-label': ariaLabel,
    id,
    variant,
    scroll,
    fill,
    children,
}: GroupProps) => {
    return (
        <View
            id={id}
            style={[
                styles.group,
                styles[`variant_${variant}`],
                scroll && styles.scroll,
                !!fill && { flexGrow: 1 },
            ]}
            aria-labelledby={ariaLabelledby}
            aria-label={ariaLabel}
        >
            {children}
        </View>
    )
}
