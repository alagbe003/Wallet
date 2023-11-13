import React from 'react'
import styles from './index.module.scss'

type Props = {
    children?: React.ReactNode
}

export const SkeletonContainer = ({ children }: Props) => {
    return <div className={styles.SkeletonContainer}>{children}</div>
}
