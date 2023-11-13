import React from 'react'
import { Path, Svg } from 'react-native-svg'
import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const BackIcon = ({ color, size }: Props) => {
    return (
        <Svg viewBox="0 0 24 24" color={color && colors[color]} width={size}>
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
