import styles from './spacing.module.scss'

export type Spacing = 0 | 2 | 3 | 4 | 6 | 8 | 12 | 16 | 20 | 24 | 30

export const spacing = (s: Spacing): string => {
    return styles[`space${s}`]
}
