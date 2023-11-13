import React, { SyntheticEvent } from 'react'
import styles from './index.module.scss'

type Props = {
    children?: React.ReactNode
    onClick: (event: SyntheticEvent) => void
}

export const Clickable = ({ onClick, children }: Props) => {
    return (
        <button className={styles.Clickable} onClick={onClick}>
            {children}
        </button>
    )
}
