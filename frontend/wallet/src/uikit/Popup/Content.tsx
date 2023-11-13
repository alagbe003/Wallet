import React from 'react'
import styles from './index.module.scss'

type Props = {
    children: React.ReactNode
}

export const Content = ({ children }: Props) => (
    <div className={styles.Content}>{children}</div>
)
