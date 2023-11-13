import { Icon } from 'src/uikit/Icon/Icon'
import { DefaultTheme } from 'styled-components'

type Props = {
    size: number
    color?: keyof DefaultTheme['colors']
}

export const CustomLedger = ({ size, color }: Props) => (
    <Icon viewBox="0 0 12 12" fill="none" width={size} color={color}>
        <circle cx="6" cy="6" r="6" fill="#132736" />
        <path
            d="M4.28613 2.57129V8.99986H8.48886V8.15508H5.21811V2.57129H4.28613Z"
            fill="white"
        />
    </Icon>
)
