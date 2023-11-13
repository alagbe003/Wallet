import React from 'react'
import { Icon } from 'src/uikit/Icon/Icon'
import { DefaultTheme } from 'styled-components'

type Props = {
    size: number
    color?: keyof DefaultTheme['colors']
}

export const Swap = ({ size, color }: Props) => {
    return (
        <Icon viewBox="0 0 14 14" fill="none" width={size} color={color}>
            <path
                d="M10.2278 12.443V3.3645"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12.9448 9.71094L10.2263 12.442L7.50781 9.71094"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M3.60768 1.55469V10.6332"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M0.889648 4.2858L3.60817 1.55469L6.32669 4.2858"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Icon>
    )
}
