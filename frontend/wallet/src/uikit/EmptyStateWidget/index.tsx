import { ReactNode, useState } from 'react'
import styles from './index.module.scss'
import { Group } from 'src/uikit/Group'
import { Text2 } from 'src/uikit/Text2'
import { v4 as uuid } from 'uuid'
import { Row } from '@zeal/uikit/Row'
import { Spacer2 } from '../Spacer2'

type Extractor<S extends string, T extends string> = S extends `${T}_${infer R}`
    ? R
    : never

type Size = Extractor<keyof typeof styles, 'Size'>

type Props = {
    icon: (renderProps: { size: number }) => ReactNode
    size: Size
    title: ReactNode
    onClick?: () => void
    action?: ReactNode
}

const ICON_SIZE = 24

export const EmptyStateWidget = ({
    icon,
    size,
    title,
    action,
    onClick,
}: Props) => {
    const [labelId] = useState(uuid())

    const wrapperClasses = [
        styles.container,
        styles[`Size_${size}`],
        onClick && styles.Clickable,
    ].join(' ')

    return (
        <Group variant="default">
            <div
                className={wrapperClasses}
                role={onClick && 'button'}
                aria-labelledby={labelId}
                onClick={onClick}
            >
                {icon({ size: ICON_SIZE })}
                <Text2
                    id={labelId}
                    align="center"
                    variant="paragraph"
                    weight="regular"
                    color="textSecondary"
                >
                    {title}
                </Text2>

                {!action ? null : (
                    <Row spacing={0}>
                        <Spacer2 />
                        {action}
                        <Spacer2 />
                    </Row>
                )}
            </div>
        </Group>
    )
}
