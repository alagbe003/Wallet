import React from 'react'

import styles from './index.module.scss'

export type ClassName = keyof typeof styles

type Extractor<S extends string, T extends string> = S extends `${T}_${infer R}`
    ? R
    : never

type Props = {
    type?: 'submit' | 'button'
    'aria-label'?: string
    variant: Extractor<ClassName, 'Variant'>
    size: Extractor<ClassName, 'Size'>
    form?: string
    disabled?: boolean
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
    children: React.ReactNode
}

export const Button = ({
    size,
    variant,
    disabled,
    form,
    onClick,
    type,
    children,
    'aria-label': ariaLabel,
}: Props) => {
    const classNames = [
        styles.Button,
        styles[`Size_${size}`],
        styles[`Variant_${variant}`],
    ].join(' ')

    return (
        <button
            aria-label={ariaLabel}
            className={classNames}
            type={type}
            form={form}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
