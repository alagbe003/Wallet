import React from 'react'
import styles from './index.module.scss'
import { Checkbox } from 'src/uikit/Icon/Checkbox'
import { NotSelected } from 'src/uikit/Icon/NotSelected'
import { noop } from '@zeal/toolkit'

type Props = {
    title: React.ReactNode
    disabled?: boolean
    checked: boolean
    onClick: () => void
}

export type Msg = { type: 'close' }

export const CheckBox = ({
    checked,
    onClick,
    disabled = false,
    title,
}: Props) => {
    const classNames = [styles.container, disabled && styles.disabled]
        .filter(Boolean)
        .join(' ')

    return (
        <div
            role="checkbox"
            aria-checked={!!checked}
            aria-disabled={disabled || undefined}
            onClick={disabled ? noop : onClick}
            className={classNames}
        >
            <div className={styles.title}>{title}</div>
            <div>
                {checked ? (
                    <Checkbox size={20} color="iconAccent2" />
                ) : (
                    <NotSelected size={20} color="iconDefault" />
                )}
            </div>
        </div>
    )
}
