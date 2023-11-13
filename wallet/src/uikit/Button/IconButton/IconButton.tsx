import React, { SyntheticEvent } from 'react'
import style from './index.module.scss'

type Props = {
    children: React.ReactNode
    'aria-label'?: string // TODO Should not be optional
    'aria-pressed'?: boolean
    onClick: (e: SyntheticEvent) => void
}

export const IconButton = ({
    'aria-label': ariaLabel,
    'aria-pressed': ariaPressed,
    children,
    onClick,
}: Props) => {
    return (
        <button
            type="button"
            className={style.Base}
            aria-label={ariaLabel}
            aria-pressed={ariaPressed}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
