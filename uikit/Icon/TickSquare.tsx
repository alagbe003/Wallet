import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { Color, colors } from '../colors'

type Props = {
    color: Color
    size: number
}

export const TickSquare = ({ color, size }: Props) => {
    return (
        <Svg
            fill="none"
            viewBox="0 0 10 11"
            width={size}
            height={size}
            color={color && colors[color]}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.806 1.64453H3.19391C1.93516 1.64453 1.146 2.53578 1.146 3.79703V7.20036C1.146 8.46161 1.93141 9.35286 3.19391 9.35286H6.80558C8.0685 9.35286 8.85433 8.46161 8.85433 7.20036V3.79703C8.85433 2.53578 8.0685 1.64453 6.806 1.64453Z"
                stroke="currentColor"
                strokeWidth="0.875"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M3.5166 5.50047L4.50577 6.48922L6.48327 4.51172"
                stroke="currentColor"
                strokeWidth="0.875"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}
