import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { Color, colors } from '../../colors'

type Props = {
    color?: Color
    size: number
}

export const BackIcon = ({ color, size }: Props) => {
    return (
        <Svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            color={color && colors[color]}
        >
            <Path
                fill="none"
                d="M16 4L8 12L16 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}
