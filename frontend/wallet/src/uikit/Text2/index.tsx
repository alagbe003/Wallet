import { ReactNode } from 'react'
import styles from './index.module.scss'

export type ClassName = keyof typeof styles

type Extractor<S extends string, T extends string> = S extends `${T}_${infer R}`
    ? R
    : never

type Color = Extractor<ClassName, 'Color'>
type Align = Extractor<ClassName, 'Align'>
type Typograhy = Extractor<ClassName, 'Typograhy'>
type Weight = Extractor<ClassName, 'Weight'>
type Whitespace = Extractor<ClassName, 'Whitespace'>

type Props = {
    id?: string
    whiteSpace?: Whitespace
    variant?: Typograhy
    weight?: Weight
    color?: Color
    align?: Align
    ellipsis?: boolean
    breakWord?: boolean
    children: ReactNode
}

const colorClassName = (color?: Color): string | null =>
    color ? styles[`Color_${color}`] : null

const alignClassName = (align?: Align): string | null =>
    align ? styles[`Align_${align}`] : null

const typograhyClassName = (typograhy?: Typograhy): string | null =>
    typograhy ? styles[`Typograhy_${typograhy}`] : null

const whiteSpaceClassName = (whiteSpace?: Whitespace): string | null =>
    whiteSpace ? styles[`Whitespace_${whiteSpace}`] : null

const weightClassName = (weight?: Weight): string | null =>
    weight ? styles[`Weight_${weight}`] : null

export const Text2 = ({
    id,

    color,
    variant,
    weight,
    whiteSpace,
    align = 'left',

    ellipsis,
    breakWord,

    children,
}: Props) => {
    const classNames = [
        styles.Text,
        ellipsis ? styles.Ellipsis : null,
        breakWord ? styles.BreakWord : null,

        colorClassName(color),
        alignClassName(align),
        typograhyClassName(variant),
        whiteSpaceClassName(whiteSpace),
        weightClassName(weight),
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <span id={id} className={classNames}>
            {children}
        </span>
    )
}
