import styles from './index.module.scss'
import React from 'react'

type Extractor<S extends string, T extends string> = S extends `${T}_${infer R}`
    ? R
    : never

type Padding = Extractor<keyof typeof styles, 'Padding'>
type Background = Extractor<keyof typeof styles, 'Background'>

type Props = {
    'aria-label'?: string
    'aria-labelledby'?: string
    padding: Padding
    background: Background
    children: React.ReactNode
}

export const Layout2 = ({
    padding,
    background,
    children,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
}: Props) => {
    const classNames = [
        styles.base,
        styles[`Padding_${padding}`],
        styles[`Background_${background}`],
    ].join(' ')

    return (
        <div
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className={classNames}
        >
            {children}
        </div>
    )
}

export const ContentBox = ({
    children,
    style,
}: {
    children: React.ReactNode
    style?: { flexGrow: 0 }
}) => (
    <div className={styles.ContentBox} style={style}>
        {children}
    </div>
)

export const HeaderBox = ({ children }: { children: React.ReactNode }) => (
    <div className={styles.HeaderBox}>{children}</div>
)
