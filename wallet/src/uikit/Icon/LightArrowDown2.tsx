import React from 'react'
import { Icon } from 'src/uikit/Icon/Icon'
import { DefaultTheme } from 'styled-components'

type Props = {
    size: number
    color?: keyof DefaultTheme['colors']
}

export const LightArrowDown2 = ({ size, color }: Props) => (
    <Icon viewBox="0 0 24 24" fill="none" width={size} color={color}>
        <path
            d="M19 8.5L12 15.5L5 8.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Icon>
)
