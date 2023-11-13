import styled, { css, DefaultTheme } from 'styled-components'
import { Base } from 'src/uikit/Base'
import { notReachable } from '@zeal/toolkit'
import { AvatarSize, BadgeSize } from '@zeal/uikit/Avatar'

type Border = 'none' | 'secondary'

export { type AvatarSize, type BadgeSize } from '@zeal/uikit/Avatar'

const AVATAR_SIZE_TO_BADGE_SIZE: Record<AvatarSize, BadgeSize> = {
    12: 10,
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
    variant?: 'round' | 'squared' | 'rounded'
    src?: string
    icon?: React.ReactNode
    rightBadge?: (renderProps: { size: BadgeSize }) => React.ReactNode
    leftBadge?: (renderProps: { size: BadgeSize }) => React.ReactNode
    size: AvatarSize
    border?: Border
    children?: React.ReactNode
    backgroundColor?: keyof DefaultTheme['colors']
}

const border = ({ border = 'none' }: Props) => {
    switch (border) {
        case 'none':
            return css``
        case 'secondary':
            return css`
                outline: 1px solid
                    ${({ theme }) => theme.colors.borderSecondary};
            `
        /* istanbul ignore next */
        default:
            return notReachable(border)
    }
}

const variantCSS = ({ variant = 'round' }: Pick<Props, 'variant'>) => {
    switch (variant) {
        case 'round':
            return css`
                border-radius: 50%;
            `

        case 'squared':
            return css`
                border-radius: 2px;
            `

        case 'rounded': {
            return css`
                border-radius: 10px;
            `
        }

        default:
            return notReachable(variant)
    }
}

const backgroundColor = ({
    backgroundColor,
}: Pick<Props, 'backgroundColor'>) => {
    return css`
        background-color: ${({ theme }) =>
            backgroundColor ? theme.colors[backgroundColor] : 'transparent'};
    `
}

export const AvatarBase = styled(Base)<
    Pick<Props, 'backgroundColor' | 'size' | 'src' | 'border' | 'variant'>
>`
    flex: 0 0 auto;
    justify-content: center;
    align-items: center;
    width: ${({ size }) => size}px;
    height: ${({ size }) => size}px;
    ${backgroundColor};
    background-image: url('${({ src }) => src}');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    ${border};
    ${variantCSS};
`

const AvatarIcon = styled.div<{ size: number }>`
    width: ${({ size }) => size}px;
    height: ${({ size }) => size}px;
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
`

type BadgePosition = 'bottom-right' | 'top-left'

const badgePositionCSS = ({
    badgePosition = 'bottom-right',
    size,
}: {
    badgePosition?: BadgePosition
    size: AvatarSize
}) => {
    const baseSize = AVATAR_SIZE_TO_BADGE_SIZE[size]
    switch (badgePosition) {
        case 'top-left':
            return css`
                position: absolute;
                left: -${baseSize / 4}px;
                top: -${baseSize / 4}px;
            `

        case 'bottom-right':
            return css`
                position: absolute;
                right: -${baseSize / 4}px;
                bottom: -${baseSize / 4}px;
            `

        default:
            return notReachable(badgePosition)
    }
}

const AvatarBadgeBase = styled.div<Pick<Props, 'size'>>`
    width: ${({ size }) => size}px;
    height: ${({ size }) => size}px;
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
`

const AvatarBadge = styled.div<
    Pick<Props, 'size'> & { badgePosition: BadgePosition }
>`
    ${badgePositionCSS}
`

export const Avatar = ({
    children,
    icon,
    size,
    backgroundColor,
    border,
    src,
    rightBadge,
    leftBadge,
    variant,
}: Props) => {
    return (
        <AvatarBase
            size={size}
            src={src}
            border={border}
            backgroundColor={backgroundColor}
            variant={variant}
        >
            {icon && <AvatarIcon size={size}>{icon}</AvatarIcon>}
            {(rightBadge || leftBadge) && (
                <AvatarBadgeBase size={size}>
                    {rightBadge && (
                        <AvatarBadge badgePosition="bottom-right" size={size}>
                            {rightBadge({
                                size: AVATAR_SIZE_TO_BADGE_SIZE[size],
                            })}
                        </AvatarBadge>
                    )}
                    {leftBadge && (
                        <AvatarBadge badgePosition="top-left" size={size}>
                            {leftBadge({
                                size: AVATAR_SIZE_TO_BADGE_SIZE[size],
                            })}
                        </AvatarBadge>
                    )}
                </AvatarBadgeBase>
            )}
            {children}
        </AvatarBase>
    )
}

type BadgeProps = {
    backgroundColor?: keyof DefaultTheme['colors']
    outlineColor?: keyof DefaultTheme['colors'] | 'transparent'
    size: BadgeSize
}

const badgeBackgroundColor = ({ backgroundColor }: BadgeProps) =>
    css`
        background-color: ${({ theme }) =>
            backgroundColor ? theme.colors[backgroundColor] : 'transparent'};
    `

const size = ({ size }: BadgeProps) =>
    css`
        height: ${size}px;
        width: ${size}px;
    `

export const Badge = styled.div<BadgeProps>`
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: 1px solid
        ${({ theme, outlineColor }) =>
            theme.colors[outlineColor || 'borderSecondary']};
    ${size};
    ${badgeBackgroundColor};
`
