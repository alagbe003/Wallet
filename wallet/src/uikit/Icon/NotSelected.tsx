import { Icon } from 'src/uikit/Icon/Icon'
import { DefaultTheme } from 'styled-components'

type Props = {
    size: number
    color?: keyof DefaultTheme['colors']
}

export const NotSelected = ({ size, color }: Props) => (
    <Icon viewBox="0 0 20 20" width={size} color={color} fill="none">
        <g clipPath="url(#clip0_5576_513896)">
            <path
                d="M0.5 10C0.5 4.76198 4.76198 0.5 10 0.5C15.238 0.5 19.5 4.76198 19.5 10C19.5 15.238 15.238 19.5 10 19.5C4.76198 19.5 0.5 15.238 0.5 10Z"
                stroke="currentColor"
            />
        </g>
        <defs>
            <clipPath id="clip0_5576_513896">
                <rect width="20" height="20" fill="white" />
            </clipPath>
        </defs>
    </Icon>
)
