import { Icon } from 'src/uikit/Icon/Icon'
import { DefaultTheme } from 'styled-components'

type Props = {
    size: number
    color?: keyof DefaultTheme['colors']
}

export const BoldCrossSmall = ({ size, color }: Props) => {
    return (
        <Icon viewBox="0 0 24 24" width={size} color={color} fill="none">
            <path
                d="M9.70711 8.29289C9.31658 7.90237 8.68342 7.90237 8.29289 8.29289C7.90237 8.68342 7.90237 9.31658 8.29289 9.70711L10.5858 12.0001L8.29302 14.2929C7.90249 14.6834 7.90249 15.3166 8.29302 15.7071C8.68354 16.0976 9.3167 16.0976 9.70723 15.7071L12.0001 13.4143L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L13.4143 12.0001L15.7072 9.70711C16.0978 9.31658 16.0978 8.68342 15.7072 8.29289C15.3167 7.90237 14.6835 7.90237 14.293 8.29289L12.0001 10.5858L9.70711 8.29289Z"
                fill="currentColor"
            />
        </Icon>
    )
}
