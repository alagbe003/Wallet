import styled, { css, DefaultTheme } from 'styled-components'
import { color, ColorProps } from 'styled-system'
import { ReactNode } from 'react'

export type Props = {
    size?: number
    children: ReactNode
} & ColorProps<DefaultTheme>

export const icon = (props: Props) => {
    const size = props.size
        ? `
            width:${props.size}px;
            min-width: ${props.size}px;
            height:${props.size}px;
            min-height:${props.size}px`
        : ''

    return css`
        ${size};
    `
}

export const Icon = styled.svg<Props>`
    ${icon};
    ${color};
`
