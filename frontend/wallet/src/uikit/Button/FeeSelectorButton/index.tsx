import { ReactNode, useState } from 'react'
import { noop } from '@zeal/toolkit'
import { Column2 } from 'src/uikit/Column2'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from 'src/uikit/Skeleton'
import { Spacer2 } from 'src/uikit/Spacer2'
import { v4 as uuid } from 'uuid'

import styles from './index.module.scss'

type Props = {
    title: ReactNode
    amount: ReactNode
    time: ReactNode
    icon: ReactNode
    tabindex: number
} & (
    | {
          disabled?: false
          selected?: boolean
          errored?: boolean
          onClick: () => void
      }
    | { disabled: true }
)

export const FeeSelectorButton = (props: Props) => {
    const [labelId] = useState(`FeeSelectorButton_label_${uuid()}`)

    const className = [
        styles.FeeSelectorButton,
        'errored' in props && props.errored
            ? styles.FeeSelectorButtonError
            : null,
        'selected' in props && props.selected
            ? styles.FeeSelectorButtonSelected
            : null,
        props.disabled ? styles.FeeSelectorButtonDisabled : null,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <div
            role="radio"
            className={className}
            aria-disabled={props.disabled || false}
            aria-checked={!props.disabled && props.selected}
            aria-labelledby={labelId}
            tabIndex={props.tabindex}
            onClick={props.disabled ? noop : props.onClick}
        >
            <Column2 spacing={4}>
                <Row spacing={4}>
                    <span className={styles.Title} id={labelId}>
                        {props.title}
                    </span>
                    <Spacer2 />
                    <div className={styles.Icon}>{props.icon}</div>
                </Row>

                <div className={styles.Spacer} />

                <Column2 spacing={4}>
                    <span className={styles.Amount} id={labelId}>
                        {props.amount}
                    </span>
                    <span className={styles.Time} id={labelId}>
                        {props.time}
                    </span>
                </Column2>
            </Column2>
        </div>
    )
}

export const FeeSelectorButtonSkeleton = () => {
    return (
        <div role="button" className={styles.Skeleton} aria-disabled>
            <Column2 spacing={4}>
                <Row spacing={4}>
                    <Skeleton variant="default" height={18} width="100%" />
                </Row>

                <div className={styles.Spacer} />

                <Column2 spacing={4}>
                    <Skeleton variant="default" height={18} width={55} />

                    <Spacer2 />

                    <Skeleton variant="default" height={18} width={35} />
                </Column2>
            </Column2>
        </div>
    )
}
