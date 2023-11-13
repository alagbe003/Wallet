import styles from './index.module.scss'

export type ClassName = keyof typeof styles

type Extractor<S extends string, T extends string> = S extends `${T}_${infer R}`
    ? R
    : never

type Props = {
    'aria-label'?: string
    size: Extractor<ClassName, 'Size'>
    color: Extractor<ClassName, 'Color'>
    disabled?: boolean
    inline?: boolean
    children: React.ReactNode
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export const Tertiary = ({
    color,
    size,
    disabled,
    inline,
    children,
    'aria-label': ariaLabel,
    onClick,
}: Props) => {
    const classNames = [
        styles.Tertiary,
        styles[`Size_${size}`],
        styles[`Color_${color}`],
        inline && styles.Inline,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <button
            type="button"
            aria-label={ariaLabel}
            disabled={disabled}
            className={classNames}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
