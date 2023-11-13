import { Icon } from 'src/uikit/Icon/Icon'
import { DefaultTheme } from 'styled-components'

type Props = {
    color?: keyof DefaultTheme['colors']
    size: number
}

export const ForwardIcon = ({ color, size }: Props) => {
    return (
        <Icon
            transform="scale(-1 1)"
            viewBox="0 0 24 24"
            color={color}
            size={size}
        >
            <path
                fill="none"
                d="M16 4L8 12L16 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Icon>
    )
}
