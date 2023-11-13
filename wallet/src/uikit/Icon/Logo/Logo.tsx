import React from 'react'
import { Icon } from 'src/uikit/Icon/Icon'
import { DefaultTheme } from 'styled-components'

type Props = {
    size: number
    color?: keyof DefaultTheme['colors']
}

export const Logo = ({ size, color }: Props) => {
    return (
        <Icon viewBox="0 0 12 12" width={size} color={color}>
            <path
                d="M0 12H12V6.6H2.4C1.07452 6.6 0 7.67452 0 9V12Z"
                fill="currentColor"
            />
            <path
                d="M12 0H0V5.4H9.6C10.9255 5.4 12 4.32548 12 3V0Z"
                fill="currentColor"
            />
        </Icon>
    )
}
