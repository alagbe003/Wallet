/**
 * trying to follow figma implementation
 * https://www.figma.com/file/AKHnmQ1MGgjwEMkaAgC7iA/Zeal---Design-System?node-id=5735%3A232953&t=CQPoBn0Wt4Rznya3-4
 *
 * so this one is layout of List Item without padding or background
 */

import React from 'react'
import { Row } from '@zeal/uikit/Row'
import { Column2 } from 'src/uikit/Column2'
import { Text } from '@zeal/uikit/Text'
import { notReachable } from '@zeal/toolkit'
import { AvatarSize } from 'src/uikit/Avatar'
import styles from './InternalItem.module.scss'

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
    fullHeight?: boolean
}

export const InternalItem = ({
    avatar,
    primaryText,
    primaryTextId,
    primaryTextIcon,
    shortText,
    sortTextId,
    side,
    size,
    fullHeight,
}: Props) => {
    return (
        <Row spacing={8}>
            <div className={styles.LeftRow}>
                {avatar && avatar({ size: AVATAR_SIZE })}
                <Row spacing={0}>
                    {fullHeight && !shortText && (
                        <Column2 spacing={3} style={{ flex: '1 0 0%' }}>
                            {(() => {
                                switch (size) {
                                    case 'regular':
                                        return (
                                            <Text
                                                color="textPrimary"
                                                variant="paragraph"
                                                weight="medium"
                                            >
                                                {'\u200b'}
                                            </Text>
                                        )

                                    case 'large':
                                        return (
                                            <Text
                                                color="textPrimary"
                                                variant="callout"
                                                weight="medium"
                                            >
                                                {'\u200b'}
                                            </Text>
                                        )
                                    default:
                                        return notReachable(size)
                                }
                            })()}

                            <Text
                                color="textSecondary"
                                variant="footnote"
                                weight="regular"
                            >
                                {'\u200b'}
                            </Text>
                        </Column2>
                    )}

                    <Column2 spacing={3}>
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
                    </Column2>
                </Row>
            </div>
            {side && (
                <Row spacing={8}>
                    {side.leftIcon?.({ size: ICON_SIZE })}
                    {side.title && (
                        <Column2 alignX="end" spacing={3}>
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
                        </Column2>
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
