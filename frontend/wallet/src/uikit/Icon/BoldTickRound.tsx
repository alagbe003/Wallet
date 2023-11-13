import React from 'react'
import { Icon } from 'src/uikit/Icon/Icon'
import { DefaultTheme } from 'styled-components'

type Props = {
    size: number
    color?: keyof DefaultTheme['colors']
    'aria-label'?: string
}

export const BoldTickRound = ({
    size,
    color,
    'aria-label': ariaLabel,
}: Props) => {
    return (
        <Icon
            viewBox="0 0 20 20"
            width={size}
            fill="none"
            color={color}
            aria-label={ariaLabel}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.0003 18.3332C14.6027 18.3332 18.3337 14.6022 18.3337 9.99984C18.3337 5.39746 14.6027 1.6665 10.0003 1.6665C5.39795 1.6665 1.66699 5.39746 1.66699 9.99984C1.66699 14.6022 5.39795 18.3332 10.0003 18.3332ZM13.7145 8.50573C14.04 8.1803 14.04 7.65266 13.7145 7.32722C13.3891 7.00179 12.8615 7.00179 12.536 7.32722L8.9586 10.9046L7.46452 9.41056C7.13909 9.08512 6.61145 9.08512 6.28601 9.41056C5.96058 9.73599 5.96058 10.2636 6.28601 10.5891L8.36935 12.6724C8.69478 12.9978 9.22242 12.9978 9.54786 12.6724L13.7145 8.50573Z"
                fill="currentColor"
            />
        </Icon>
    )
}
