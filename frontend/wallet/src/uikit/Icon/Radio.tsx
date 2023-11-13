import { Icon } from 'src/uikit/Icon/Icon'
import { DefaultTheme } from 'styled-components'

type Props = {
    size: number
    color?: keyof DefaultTheme['colors']
}

export const Radio = ({ size, color }: Props) => (
    <Icon viewBox="0 0 16 16" width={size} color={color} fill="none">
        <g clipPath="url(#clip0_1164_7412)">
            <path
                d="M0.5 8.5C0.5 4.36481 3.86481 1 8 1C12.1352 1 15.5 4.36481 15.5 8.5C15.5 12.6352 12.1352 16 8 16C3.86481 16 0.5 12.6352 0.5 8.5Z"
                stroke="currentColor"
            />
            <circle cx="7.99995" cy="8.49922" r="4.8" fill="currentColor" />
        </g>
        <defs>
            <clipPath id="clip0_1164_7412">
                <rect
                    width="16"
                    height="16"
                    fill="white"
                    transform="translate(0 0.5)"
                />
            </clipPath>
        </defs>
    </Icon>
)
