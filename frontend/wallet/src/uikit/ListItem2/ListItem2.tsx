import React, { useState } from 'react'
import style from './ListItem2.module.scss'
import { InternalItem, Props as InternalItemProps } from './InternalItem'
import { v4 as uuid } from 'uuid'

type Props = {
    variant?: 'default' | 'solid' | 'warning' | 'critical'
    onClick?: () => void
    'aria-selected': boolean
} & InternalItemProps

export const ListItem2 = ({
    variant = 'default',
    onClick,
    primaryText,
    primaryTextIcon,
    shortText,
    side,
    avatar,
    size,
    'aria-selected': ariaSelected,
    fullHeight,
}: Props) => {
    const [labelId] = useState(`list-item-label-${uuid()}`)
    const [descriptionId] = useState(`list-item-desc-${uuid()}`)
    const className = [
        style.container,
        style[`container_${variant}`],
        onClick ? style.clickable : null,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <div
            onClick={onClick}
            role={onClick ? 'button' : 'listitem'}
            className={className}
            aria-selected={ariaSelected}
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
        >
            <InternalItem
                size={size}
                primaryText={primaryText}
                primaryTextId={labelId}
                primaryTextIcon={primaryTextIcon}
                shortText={shortText}
                sortTextId={descriptionId}
                side={side}
                avatar={avatar}
                fullHeight={fullHeight}
            />
        </div>
    )
}
