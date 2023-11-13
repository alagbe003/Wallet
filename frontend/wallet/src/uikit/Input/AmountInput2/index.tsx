import React from 'react'
import styles from './index.module.scss'
import { Row } from '@zeal/uikit/Row'
import { FloatInput } from 'src/uikit/Input/FloatInput'
import { Skeleton } from 'src/uikit/Skeleton'

type Props = {
    top?: React.ReactNode
    content: {
        topLeft: React.ReactNode
        topRight: React.ReactNode
        bottomLeft?: React.ReactNode
        bottomRight?: React.ReactNode
    }
    bottom?: React.ReactNode
    state: State
}
type State = 'normal' | 'error'

export const AmountInput2 = ({ top, content, bottom, state }: Props) => {
    const mainContainerClassName = [styles.Container, styles[`State_${state}`]]
        .filter(Boolean)
        .join(' ')
    return (
        <div className={mainContainerClassName}>
            {top && <div className={styles.Top}>{top}</div>}
            <div className={styles.Content}>
                <Row spacing={8}>
                    <div className={styles.TopLeft}>{content.topLeft}</div>
                    <div className={styles.TopRight}>{content.topRight}</div>
                </Row>
                <Row spacing={8}>
                    {content.bottomLeft && (
                        <div className={styles.BottomLeft}>
                            {content.bottomLeft}
                        </div>
                    )}
                    {content.bottomRight && (
                        <div className={styles.BottomRight}>
                            {content.bottomRight}
                        </div>
                    )}
                </Row>
            </div>
            {bottom && <div className={styles.Bottom}>{bottom}</div>}
        </div>
    )
}

type InputProps = {
    amount: string | null
    readOnly?: boolean
    prefix: string
    autoFocus?: true
    fraction: number
    label: string
    onChange: (amount: string | null) => void
}

AmountInput2.Input = ({
    amount,
    onChange,
    prefix,
    readOnly,
    autoFocus,
    label,
    fraction,
}: InputProps) => {
    return (
        <FloatInput
            prefix={prefix}
            value={amount}
            fraction={fraction}
            onChange={onChange}
        >
            {({ value, onChange }) => (
                <input
                    aria-label={label}
                    readOnly={readOnly}
                    autoFocus={autoFocus}
                    placeholder="0"
                    className={styles.HTMLInput}
                    value={value}
                    onChange={onChange}
                />
            )}
        </FloatInput>
    )
}

AmountInput2.InputSkeleton = () => {
    return <Skeleton variant="default" width="100%" height={24} />
}
