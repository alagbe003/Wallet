import { useEffect, useState } from 'react'
import styles from './index.module.scss'

type Extractor<S extends string, T extends string> = S extends `${T}_${infer R}`
    ? R
    : never

type Background = Extractor<keyof typeof styles, 'BarBackground'>

type Props = {
    progress: number
    initialProgress: number | null
    animationTimeMs: number
    background: Background
}

export const ProgressThin = ({
    progress,
    animationTimeMs,
    initialProgress,
    background,
}: Props) => {
    const [current, setCurrent] = useState<number>(initialProgress ?? progress)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setCurrent(progress)
        }, 0)

        return () => clearTimeout(timeout)
    }, [progress])

    return (
        <div className={styles.Wrapper}>
            <div className={styles.Progress}>
                <div
                    className={[
                        styles.Bar,
                        styles[`BarBackground_${background}`],
                    ].join(' ')}
                    style={{
                        width: `${current * 100}%`,
                        transitionDuration: `${animationTimeMs / 1000}s`,
                    }}
                ></div>
            </div>
        </div>
    )
}
