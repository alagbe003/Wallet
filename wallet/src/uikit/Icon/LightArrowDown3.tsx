import React from 'react'
import { Icon } from 'src/uikit/Icon/Icon'
import { DefaultTheme } from 'styled-components'

type Props = {
    size: number
    color?: keyof DefaultTheme['colors']
}

export const LightArrowDown3 = ({ size, color }: Props) => (
    <Icon viewBox="0 0 16 16" fill="none" width={size} color={color}>
        <path
            d="M8.18294 13.1665V3.1665"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M12.1992 9.1333L8.18317 13.1666L4.1665 9.1333"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Icon>
)
