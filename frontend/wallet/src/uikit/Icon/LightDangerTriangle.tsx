import { Icon } from 'src/uikit/Icon/Icon'
import { DefaultTheme } from 'styled-components'

type Props = {
    size: number
    color?: keyof DefaultTheme['colors']
}

export const LightDangerTriangle = ({ size, color }: Props) => (
    <Icon viewBox="0 0 24 24" fill="none" width={size} color={color}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.814 20.4368H19.197C20.779 20.4368 21.772 18.7268 20.986 17.3528L13.8 4.78781C13.009 3.40481 11.015 3.40381 10.223 4.78681L3.025 17.3518C2.239 18.7258 3.231 20.4368 4.814 20.4368Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M12.0019 13.4165V10.3165"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M11.995 16.5H12.005"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Icon>
)
