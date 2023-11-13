import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Color, colors } from '../colors'
import { BadgeSize } from './Badge'
import { notReachable } from '@zeal/toolkit/build'

type Border = 'none' | 'secondary'

export type AvatarSize = 14 | 18 | 20 | 24 | 28 | 32 | 48 | 64 | 72 | 80

const AVATAR_SIZE_TO_BADGE_SIZE: Record<AvatarSize, BadgeSize> = {
    14: 10,
    18: 10,
    20: 10,
    24: 10,
    28: 12,
    32: 16,
    48: 16,
    64: 16,
    72: 48,
    80: 48,
}

type Props = {
    size: AvatarSize
    backgroundColor?: Color
    leftBadge?: (renderProps: { size: BadgeSize }) => React.ReactNode
    rightBadge?: (renderProps: { size: BadgeSize }) => React.ReactNode
    variant?: 'round' | 'squared' | 'rounded'
    border?: Border

    children: React.ReactNode
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    borderContainer_none: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    borderContainer_secondary: {
        position: 'absolute',
        top: -1,
        left: -1,
        right: -1,
        bottom: -1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: colors.borderSecondary,
        borderStyle: 'solid',
        borderWidth: 1,
    },

    badge: {
        position: 'absolute',
    },
})

export const Avatar = ({
    size,
    backgroundColor,
    leftBadge,
    rightBadge,
    border = 'none',
    variant = 'round',
    children,
}: Props) => {
    return (
        <View
            style={[
                styles.container,
                { width: size, height: size },
                backgroundColor && { backgroundColor: colors[backgroundColor] },
            ]}
        >
            <View
                style={[
                    styles[`borderContainer_${border}`],
                    {
                        borderRadius: (() => {
                            switch (variant) {
                                case 'round':
                                    return size / 2 + 1
                                case 'squared':
                                    return 2
                                case 'rounded':
                                    return 10
                                default:
                                    return notReachable(variant)
                            }
                        })(),
                    },
                ]}
            >
                {leftBadge && (
                    <View
                        style={[
                            styles.badge,
                            {
                                top: -AVATAR_SIZE_TO_BADGE_SIZE[size] / 4,
                                left: -AVATAR_SIZE_TO_BADGE_SIZE[size] / 4,
                            },
                        ]}
                    >
                        {leftBadge({
                            size: AVATAR_SIZE_TO_BADGE_SIZE[size],
                        })}
                    </View>
                )}
                {rightBadge && (
                    <View
                        style={[
                            styles.badge,
                            {
                                bottom: -AVATAR_SIZE_TO_BADGE_SIZE[size] / 4,
                                right: -AVATAR_SIZE_TO_BADGE_SIZE[size] / 4,
                            },
                        ]}
                    >
                        {rightBadge({
                            size: AVATAR_SIZE_TO_BADGE_SIZE[size],
                        })}
                    </View>
                )}
                {children}
            </View>
        </View>
    )
}
