import React from 'react'
import { Icon } from 'src/uikit/Icon/Icon'

type Props = {
    size: number
}

export const Zksync = ({ size }: Props) => {
    return (
        <Icon viewBox="0 0 120 120" size={size} fill="none">
            <circle cx="60" cy="60" r="60" fill="#F3F6FB" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M102 59.8667L78.1131 36.0635V53.4958L54.3953 70.9497L78.1131 70.9661V83.67L102 59.8667Z"
                fill="black"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.7905 59.8598L41.6774 83.6631V66.3709L65.3953 48.7765L41.6774 48.7601V36.0564L17.7905 59.8598Z"
                fill="black"
            />
        </Icon>
    )
}
