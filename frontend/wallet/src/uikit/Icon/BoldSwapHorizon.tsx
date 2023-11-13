import React from 'react'
import { Icon } from 'src/uikit/Icon/Icon'
import { DefaultTheme } from 'styled-components'

type Props = {
    size: number
    color?: keyof DefaultTheme['colors']
}

export const BoldSwapHorizon = ({ size, color }: Props) => {
    return (
        <Icon viewBox="0 0 24 24" width={size} color={color} fill="none">
            <path
                d="M5.98669 10.5L0.666687 15.8333L5.98669 21.1667V17.1667H15.3334V14.5H5.98669V10.5ZM24.6667 7.83333L19.3467 2.5V6.5H10V9.16667H19.3467V13.1667L24.6667 7.83333Z"
                fill="currentColor"
            />
        </Icon>
    )
}
