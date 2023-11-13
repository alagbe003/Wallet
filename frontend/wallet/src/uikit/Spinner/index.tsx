import { DefaultTheme } from 'styled-components'
import { Spinner as SpinnerIcon } from 'src/uikit/Icon/Spinner'
import styles from './index.module.scss'

type Props = {
    size: number
    color?: keyof DefaultTheme['colors']
    'aria-label'?: string
}

export const Spinner = ({ size, color, 'aria-label': ariaLabel }: Props) => {
    return (
        <div
            className={styles.Spinner}
            aria-label={ariaLabel}
            style={{
                height: `${size}px`,
                width: `${size}px`,
            }}
        >
            <SpinnerIcon size={size} color={color} />
        </div>
    )
}
