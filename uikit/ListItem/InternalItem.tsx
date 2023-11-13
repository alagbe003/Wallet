/**
 * trying to follow figma implementation
 * https://www.figma.com/file/AKHnmQ1MGgjwEMkaAgC7iA/Zeal---Design-System?node-id=5735%3A232953&t=CQPoBn0Wt4Rznya3-4
 *
 * so this one is layout of List Item without padding or background
 */

import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Row } from '@zeal/uikit/Row'
import { Column } from '@zeal/uikit/Column'
import { Text } from '@zeal/uikit/Text'
import { notReachable } from '@zeal/toolkit'
import { AvatarSize } from '@zeal/uikit/Avatar'

export type AvatarRenderProps = {
    size: AvatarSize
}

export const AVATAR_SIZE = 32

export type IconRenderProps = {
    size: typeof ICON_SIZE
}
export const ICON_SIZE = 20

type PrimaryTextIconRenderProps = {
    size: typeof PRIMARY_TEXT_ICON
}

const PRIMARY_TEXT_ICON = 14

type Size = 'regular' | 'large'

export type Props = {
    size: Size
    avatar?: (avatarRenderProps: AvatarRenderProps) => React.ReactNode
    primaryText: React.ReactNode
    primaryTextId?: string
    primaryTextIcon?: (
        primaryTextIconRenderProps: PrimaryTextIconRenderProps
    ) => React.ReactNode
    shortText?: React.ReactNode
    sortTextId?: string
    side?: {
        rightIcon?: (iconRenderProps: IconRenderProps) => React.ReactNode
        leftIcon?: (iconRenderProps: IconRenderProps) => React.ReactNode
    } & (
        | { title: React.ReactNode; subtitle?: React.ReactNode }
        | { title?: never }
    )
}

const styles = StyleSheet.create({
    left_row: {
        display: 'flex',
        flexDirection: 'row',
        columnGap: 12,
        flex: 1,
        minWidth: '50%',
        alignItems: 'center',
    },
})

export const InternalItem = ({
    avatar,
    primaryText,
    primaryTextId,
    primaryTextIcon,
    shortText,
    sortTextId,
    side,
    size,
}: Props) => {
    return (
        <Row spacing={8}>
            <View style={[styles.left_row]}>
                {avatar && avatar({ size: AVATAR_SIZE })}
                <Column spacing={3}>
                    <Row spacing={4}>
                        {(() => {
                            switch (size) {
                                case 'regular':
                                    return (
                                        <Text
                                            id={primaryTextId}
                                            ellipsis
                                            color="textPrimary"
                                            variant="paragraph"
                                            weight="medium"
                                        >
                                            {primaryText}
                                        </Text>
                                    )

                                case 'large':
                                    return (
                                        <Text
                                            id={primaryTextId}
                                            ellipsis
                                            color="textPrimary"
                                            variant="callout"
                                            weight="medium"
                                        >
                                            {primaryText}
                                        </Text>
                                    )
                                default:
                                    return notReachable(size)
                            }
                        })()}
                        {primaryTextIcon?.({ size: PRIMARY_TEXT_ICON })}
                    </Row>
                    {shortText && (
                        <Text
                            ellipsis
                            id={sortTextId}
                            color="textSecondary"
                            variant="footnote"
                            weight="regular"
                        >
                            {shortText}
                        </Text>
                    )}
                </Column>
            </View>
            {side && (
                <Row spacing={8}>
                    {side.leftIcon?.({ size: ICON_SIZE })}
                    {side.title && (
                        <Column alignX="end" spacing={3}>
                            <Text
                                ellipsis
                                color="textPrimary"
                                variant="callout"
                                weight="medium"
                            >
                                {side.title}
                            </Text>
                            {side.subtitle && (
                                <Text
                                    ellipsis
                                    color="textSecondary"
                                    variant="footnote"
                                    weight="regular"
                                >
                                    {side.subtitle}
                                </Text>
                            )}
                        </Column>
                    )}
                    {side.rightIcon ? (
                        <Row spacing={0} alignY="center">
                            {side.rightIcon({ size: ICON_SIZE })}
                        </Row>
                    ) : null}
                </Row>
            )}
        </Row>
    )
}
