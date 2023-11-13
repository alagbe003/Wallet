import { Icon } from 'src/uikit/Icon/Icon'
import { DefaultTheme } from 'styled-components'

type Props = {
    size: number
    color?: keyof DefaultTheme['colors']
}

export const CustomGoogleDrive = ({ size, color }: Props) => (
    <Icon viewBox="0 0 24 24" fill="none" width={size} color={color}>
        <g clipPath="url(#clip0_3282_53759)">
            <path
                d="M4.00024 22.793L7.99994 15.8633H24L19.9999 22.793H4.00024Z"
                fill="#3777E3"
            />
            <path
                d="M16.0003 15.8633H24.0001L16.0003 2.00391H8L16.0003 15.8633Z"
                fill="#FFCF63"
            />
            <path
                d="M0 15.8633L4.00025 22.7929L12 8.93359L7.99994 2.00391L0 15.8633Z"
                fill="#11A861"
            />
        </g>
        <defs>
            <clipPath id="clip0_3282_53759">
                <rect
                    width="24"
                    height="20.7936"
                    fill="white"
                    transform="translate(0 2)"
                />
            </clipPath>
        </defs>
    </Icon>
)
