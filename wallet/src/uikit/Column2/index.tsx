import React from 'react'
import { Spacing } from 'src/uikit/Spacing/spacing'
import styles from './index.module.scss'

type Props = {
    spacing: Spacing
    alignX?: AlignX
    children: React.ReactNode
    'aria-labelledby'?: string
    'aria-label'?: string
    'data-testid'?: string
    style?: {
        flex?:
            | '1' // grow or shrink as needed; no default height
            | '0 0 auto' // fixed height from the children
            | '1 0 auto' // at least height of children, can grow to fill empty space
            | '1 1 auto' // grow and shrink as needed; default height of children
            | '1 0 0%' // fill available space
            | '1 0 100%' // take as much available space as possible
        height?: '100%'
        overflow?: 'hidden'
        overflowY?: 'auto'
        padding?: '16px' | '12px' | '16px 16px 20px 16px'
    }
}

export type Msg = { type: 'close' }

type AlignX = 'start' | 'center' | 'end'
const xAlign = (align?: AlignX): string => {
    if (!align) {
        return ''
    }

    return styles[`XAlign_${align}`]
}

const space = (spacing: Spacing): string => {
    return styles[`space${spacing}`]
}

/**
 * @todo Column does not work well if child item is empty.
 */
export const Column2 = ({
    spacing,
    children,
    alignX,
    'aria-labelledby': ariaLabelledby,
    'aria-label': ariaLabel,
    'data-testid': dataTestid,
    style,
}: Props) => {
    return (
        <div
            style={style}
            className={`${space(spacing)} ${xAlign(alignX)}`}
            aria-labelledby={ariaLabelledby}
            aria-label={ariaLabel}
            data-testid={dataTestid}
        >
            {children}
        </div>
    )
}
