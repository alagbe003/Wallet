import { ReactNode, useEffect, useState } from 'react'
import { Column2 } from 'src/uikit/Column2'
import { Row } from '@zeal/uikit/Row'
import { Spacer2 } from 'src/uikit/Spacer2'
import styles from './index.module.scss'

type Variant = 'neutral' | 'success' | 'critical' | 'warning'

type Props = {
    variant: Variant
    progress: number
    initialProgress: number | null
    title: ReactNode
    subtitle?: ReactNode

    rounded?: true
    right?: ReactNode
    onClick?: () => void
}

export const Progress2 = ({
    title,
    right,
    progress,
    initialProgress,
    subtitle,
    variant,
    rounded,
    onClick,
}: Props) => {
    const [labelId] = useState(crypto.randomUUID())
    const [descriptionId] = useState(crypto.randomUUID())
    const classNames = [
        styles.Progress,
        variant && styles[variant],
        onClick && styles.clickable,
        rounded && styles.rounded,
    ]
        .filter(Boolean)
        .join(' ')

    const [current, setCurrent] = useState<number>(initialProgress ?? progress)

    useEffect(() => {
        setCurrent(progress)
    }, [progress])

    return (
        <div
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
            role={onClick ? 'button' : 'progressbar'}
            onClick={onClick}
            className={classNames}
        >
            <div
                style={{ width: `${Math.round(current * 100)}%` }}
                className={styles.ProgressBar}
            />
            <div style={{ position: 'relative' }}>
                <Column2 spacing={8}>
                    <Row spacing={4}>
                        <span className={styles.Title} id={labelId}>
                            {title}
                        </span>
                        <Spacer2 />
                        <div className={styles.Right}>
                            <Row spacing={4}>{right}</Row>
                        </div>
                    </Row>
                    {subtitle && (
                        <span className={styles.Subtitle} id={descriptionId}>
                            {subtitle}
                        </span>
                    )}
                </Column2>
            </div>
        </div>
    )
}
