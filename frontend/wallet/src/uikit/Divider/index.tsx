import styles from './index.module.scss'

type Props = {
    variant: 'default' | 'secondary'
}

export const Divider = ({ variant }: Props) => {
    const classNames = [styles.base, styles[variant]].join(' ')

    return (
        <div className={classNames}>
            {/* TODO This div is needed since Column won't work with empty element */}
            <div></div>
        </div>
    )
}
