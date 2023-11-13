import React from 'react'
import { Icon } from 'src/uikit/Icon/Icon'
import { DefaultTheme } from 'styled-components'

type Props = {
    size: number
    color?: keyof DefaultTheme['colors']
}

export const LightArrowRight2 = ({ size, color }: Props) => {
    return (
        <Icon viewBox="0 0 24 24" fill="none" width={size} color={color}>
            <path
                d="M8.5 5L15.5 12L8.5 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Icon>
    )
}
