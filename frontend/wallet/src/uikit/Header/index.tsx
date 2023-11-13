import React from 'react'
import styles from './index.module.scss'
import { Text2 } from 'src/uikit/Text2'
import { Avatar } from 'src/uikit/Avatar'
import { Row } from '@zeal/uikit/Row'
import { IconButton } from 'src/uikit/Button'
import { InfoCircle } from 'src/uikit/Icon/InfoCircle'

type Props = {
    icon?: (_: { size: number; color: 'iconAccent2' }) => React.ReactNode
    title: React.ReactNode
    titleId?: string
    onInfoIconClick?: () => void
    subtitle?: React.ReactNode
    subtitleId?: string
}

export type Msg = { type: 'close' }

export const Header = ({
    title,
    titleId,
    subtitle,
    subtitleId,
    onInfoIconClick,
    icon,
}: Props) => {
    return (
        <div className={`${styles.layout}`}>
            {icon && (
                <Avatar
                    size={72}
                    backgroundColor="backgroundLight"
                    icon={icon({ size: 48, color: 'iconAccent2' })}
                />
            )}

            <div className={`${styles.text}`}>
                <Row spacing={4} alignY="start">
                    <Text2
                        id={titleId}
                        variant="title2"
                        weight="bold"
                        color="textPrimary"
                        align="center"
                    >
                        {title}
                    </Text2>

                    {onInfoIconClick && (
                        <IconButton onClick={onInfoIconClick}>
                            <InfoCircle size={18} />
                        </IconButton>
                    )}
                </Row>

                {subtitle && (
                    <Text2
                        id={subtitleId}
                        variant="paragraph"
                        weight="regular"
                        color="textSecondary"
                        align="center"
                    >
                        {subtitle}
                    </Text2>
                )}
            </div>
        </div>
    )
}
