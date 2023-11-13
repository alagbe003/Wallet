import styles from './index.module.scss'

type Extractor<S extends string, T extends string> = S extends `${T}_${infer R}`
    ? R
    : never

type Variant = Extractor<keyof typeof styles, 'Variant'>

type Props = {
    variant: Variant
    height?: number
    width: number | `${number}%`
}

const DEFAULT_SKELETON_HEIGHT = 8

/**
 * @figma https://www.figma.com/file/AKHnmQ1MGgjwEMkaAgC7iA/Design-System-%5BZeal---Aurora%5D?version-id=3006789049&node-id=5935%3A274450&viewport=594%2C-2633%2C3.94&t=ORfCREBqSUIguYcK-0
 */
export const Skeleton = ({
    variant,
    height = DEFAULT_SKELETON_HEIGHT,
    width,
}: Props) => {
    const classNames = [styles.Skeleton, styles[`Variant_${variant}`]].join(' ')

    return (
        <div
            className={classNames}
            style={{
                height: height,
                minHeight: height,
                width: width,
                minWidth: width,
            }}
        >
            <div className={styles.Splash}></div>
        </div>
    )
}
