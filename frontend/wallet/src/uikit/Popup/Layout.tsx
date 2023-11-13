import React from 'react'
import { Modal } from 'src/uikit/Modal'
import styles from './index.module.scss'
import { Column2 } from 'src/uikit/Column2'

export type ClassName = keyof typeof styles

type Extractor<S extends string, T extends string> = S extends `${T}_${infer R}`
    ? R
    : never

type Props = {
    background?: Extractor<ClassName, 'Background'>
    children: React.ReactNode
    'aria-labelledby'?: string
    'aria-describedby'?: string
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const Layout = ({
    background = 'backgroundLight',
    children,
    onMsg,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
}: Props) => {
    const dynamicClassNames = [
        styles.Dynamic,
        background && styles[`Background_${background}`],
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <Modal>
            <div
                className={styles.Container}
                role="button"
                aria-labelledby={ariaLabelledby}
                aria-describedby={ariaDescribedby}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        onMsg({ type: 'close' })
                    }
                }}
            >
                <div className={styles.Stopper}></div>
                <div
                    className={dynamicClassNames}
                    aria-modal="true"
                    role="dialog"
                    aria-labelledby={ariaLabelledby}
                    aria-describedby={ariaDescribedby}
                >
                    <Column2 spacing={24}>{children}</Column2>
                </div>
            </div>
        </Modal>
    )
}
