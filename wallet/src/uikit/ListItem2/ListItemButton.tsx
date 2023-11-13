import React from 'react'
import { InternalItem, Props as InternalItemProps } from './InternalItem'
import style from './ListItemButton.module.scss'

type Props = {
    onClick: () => void
} & Omit<InternalItemProps, 'size'>

export const ListItemButton = ({
    onClick,
    primaryTextIcon,
    shortText,
    primaryText,
    side,
    avatar,
}: Props) => {
    return (
        <div onClick={onClick} className={style.container}>
            <InternalItem
                size="large"
                primaryText={primaryText}
                primaryTextIcon={primaryTextIcon}
                side={side}
                avatar={avatar}
                shortText={shortText}
            />
        </div>
    )
}
