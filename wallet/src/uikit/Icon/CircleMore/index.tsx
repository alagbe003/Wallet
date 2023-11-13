import React from 'react'
import { Icon } from 'src/uikit/Icon/Icon'
import { DefaultTheme } from 'styled-components'

type Props = {
    size: number
    color: keyof DefaultTheme['colors']
}

export const CircleMore = ({ size, color }: Props) => {
    return (
        <Icon viewBox="0 0 18 18" width={size} color={color} fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 2.0625C12.831 2.0625 15.9375 5.16825 15.9375 9C15.9375 12.831 12.831 15.9375 9 15.9375C5.16825 15.9375 2.0625 12.831 2.0625 9C2.0625 5.169 5.169 2.0625 9 2.0625Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M11.9537 9.00781H11.9604"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8.9478 9.00781H8.95455"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M5.94096 9.00781H5.94771"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Icon>
    )
}
