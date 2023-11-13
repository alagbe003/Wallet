import { Icon } from 'src/uikit/Icon/Icon'

type Props = {
    size: number
}

export const CustomZeal = ({ size }: Props) => (
    <Icon viewBox="0 0 28 28" width={size}>
        <circle cx="14" cy="14" r="14" fill="#1A364B" />
        <path
            d="M21.5 6.5H6.5V12.6875C6.5 12.9982 6.75184 13.25 7.0625 13.25H19.625C20.6605 13.25 21.5 12.4105 21.5 11.375V6.5Z"
            fill="#40EEEE"
        />
        <path
            d="M8.75 14.75C7.50736 14.75 6.5 15.7573 6.5 17V21.5H21.5V15.3125C21.5 15.0018 21.2482 14.75 20.9375 14.75H8.75Z"
            fill="#40EEEE"
        />
    </Icon>
)
