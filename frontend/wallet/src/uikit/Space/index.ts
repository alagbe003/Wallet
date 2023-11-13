import styled from 'styled-components'
import { notReachable } from '@zeal/toolkit'
import {
    color,
    padding,
    flexbox,
    size,
    width,
    height,
    maxWidth,
    maxHeight,
    margin,
    minWidth,
    minHeight,
    borderRadius,
    border,
    BorderProps,
    BorderRadiusProps,
    MinWidthProps,
    MinHeightProps,
    MarginProps,
    MaxWidthProps,
    MaxHeightProps,
    SizeProps,
    FlexboxProps,
    ColorProps,
    PaddingProps,
    WidthProps,
    HeightProps,
} from 'styled-system'
import { Base } from 'src/uikit/Base'

export type Space = number
// 0 | 2 | 4 | 6 | 8 | 12 | 14 | 16 | 18 | 20 | 24 | 96 | 142

type Props = {
    space?: Space
    wrap?: 'wrap' | 'no_wrap'
    flexType?: 'flex' | 'inline-flex'
} & ColorProps &
    PaddingProps &
    FlexboxProps &
    SizeProps &
    WidthProps &
    HeightProps &
    MaxWidthProps &
    MaxHeightProps &
    MarginProps &
    MinWidthProps &
    MinHeightProps &
    BorderRadiusProps &
    BorderProps

const spaceToPixels = ({ space = 0 }: Props) => {
    return `${space}px`
}
const wrapToString = ({ wrap = 'no_wrap' }: Props) => {
    switch (wrap) {
        case 'wrap':
            return 'wrap'
        case 'no_wrap':
            return 'nowrap'
        /* istanbul ignore next */
        default:
            return notReachable(wrap)
    }
}

const flexType = ({ flexType = 'inline-flex' }: Props) => flexType

/**
 * @deprecated Please use Row2
 */
export const Row = styled(Base)<Props>`
    display: ${flexType};
    min-width: 0;
    flex-direction: row;
    column-gap: ${spaceToPixels};
    flex-wrap: ${wrapToString};
    ${color};
    ${padding};
    ${flexbox};
    ${size};
    ${height};
    ${width};
    ${maxWidth};
    ${maxHeight};
    ${margin};
    ${minWidth};
    ${minHeight};
    ${borderRadius};
    ${border};
`

type SpacerProps = {
    size?: Space
} & FlexboxProps

/**
 * @deprecated Please use Spacer2
 */
export const Spacer = styled(Base)<SpacerProps>((props) => {
    const size = props.size ? `${props.size}px` : 'auto'
    return {
        pointerEvents: 'none',
        flex: props.size != null ? '0 1 auto' : '1 1 0%',
        width: size,
        height: size,
        ...flexbox(props),
    }
})
