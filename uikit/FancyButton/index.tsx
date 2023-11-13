import React from 'react'
import {
    StyleSheet,
    Text,
    Pressable,
    GestureResponderEvent,
} from 'react-native'
import { Spacer } from '@zeal/uikit/Spacer'
import { styles as textStyles } from '@zeal/uikit/Text'

import { noop } from '@zeal/toolkit'
import { colors } from '@zeal/uikit/colors'
import { Extractor } from '@zeal/uikit/Extractor'

const styles = StyleSheet.create({
    fill: {
        width: '100%',
    },
    base: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        ...textStyles.variant_caption1,
        ...textStyles.weight_medium,
        paddingVertical: 6,
        paddingHorizontal: 12,
        height: 24,
    },
    rounded: {
        borderRadius: 50,
    },

    color_secondary: {
        backgroundColor: colors.surfaceDefault,
        ...textStyles.color_textSecondary,
    },

    color_Polygon: {
        backgroundColor: '#f4e7ff',
        color: '#5d20c7',
    },
    color_PolygonZkevm: {
        backgroundColor: '#f4e7ff',
        color: '#5d20c7',
    },

    color_Ethereum: {
        backgroundColor: '#f5f9fe',
        color: '#343434',
    },

    color_Optimism: {
        backgroundColor: '#ffebeb',
        color: '#9f0202',
    },

    color_BSC: {
        backgroundColor: '#fff5d7',
        color: '#8a3500',
    },

    color_Gnosis: {
        backgroundColor: '#e2fbf4',
        color: '#025f48',
    },

    color_Fantom: {
        backgroundColor: '#e9efff',
        color: '#0038d3',
    },

    color_Arbitrum: {
        backgroundColor: '#e4f4ff',
        color: '#074772',
    },

    color_Avalanche: {
        backgroundColor: '#ffebeb',
        color: '#9f0202',
    },

    color_Aurora: {
        backgroundColor: '#e5fddd',
        color: '#1b5f00',
    },

    color_Base: {
        backgroundColor: '#e5fddd',
        color: '#3773f5',
    },

    color_zkSync: {
        backgroundColor: '#e5fddd',
        color: '#000000',
    },
})

type Props = {
    fill?: true
    color: Extractor<keyof typeof styles, 'color'>
    rounded: boolean
    left: React.ReactNode
    right: React.ReactNode
    onClick: null | ((e: GestureResponderEvent) => void)
}

export const FancyButton = ({
    color,
    left,
    onClick,
    right,
    rounded,
    fill,
}: Props) => {
    return (
        <Pressable
            style={[fill && styles.fill]}
            role="button"
            onPress={onClick || noop}
        >
            <Text
                style={[
                    styles.base,
                    rounded && styles.rounded,
                    styles[`color_${color}`],
                    fill && styles.fill,
                ]}
            >
                {left}
                <Spacer />
                {right}
            </Text>
        </Pressable>
    )
}
