import { ReactNode } from 'react'
import styles from './index.module.scss'

type GroupProps = {
    variant: 'compressed' | 'default'
    children: ReactNode
    style?: {
        flex?: '0 0 auto' | '1 0 auto' | '1'
        padding?: '12px 16px'
        flexShrink?: '0'
        overflowY?: 'auto'
        overflow?: 'auto'
    }
    'aria-labelledby'?: string
    'aria-label'?: string
    id?: string
}

export const Group = ({
    variant,
    children,
    style,
    id,
    'aria-labelledby': ariaLabelledby,
    'aria-label': ariaLabel,
}: GroupProps) => {
    return (
        <div
            id={id}
            style={style}
            aria-labelledby={ariaLabelledby}
            aria-label={ariaLabel}
            className={`${styles.Group} ${styles[`Group_variant_${variant}`]}`}
        >
            {children}
        </div>
    )
}

type SectionProps = {
    children: ReactNode
    style?: {
        flex?: '0 0 auto'
        overflow?: 'auto'
    }
    'aria-labelledby'?: string
    role?: string
}

export const Section = ({
    children,
    style,
    'aria-labelledby': ariaLabeledBy,
    role,
}: SectionProps) => {
    return (
        <div
            role={role}
            aria-labelledby={ariaLabeledBy}
            style={style}
            className={styles.Section}
        >
            {children}
        </div>
    )
}
