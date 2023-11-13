import React from 'react'
import styles from './index.module.scss'

export type ClassName = keyof typeof styles

type Props = {
    children?: React.ReactNode
}

export const DragHandle = ({ children }: Props) => {
    return <div className={styles.DragHandle}>{children}</div>
}
