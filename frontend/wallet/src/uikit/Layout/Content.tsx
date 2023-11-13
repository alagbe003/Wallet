import { ReactNode } from 'react'
import styles from './index.module.scss'
import { Column2 } from 'src/uikit/Column2'
import { Text2 } from 'src/uikit/Text2'
import { Divider } from 'src/uikit/Divider'
import { Spacer2 } from 'src/uikit/Spacer2'
import { notReachable } from '@zeal/toolkit'
import { Spinner } from 'src/uikit/Spinner'
import { Animation } from 'src/uikit/Animation'
import { BoldDangerTriangle } from 'src/uikit/Icon/BoldDangerTriangle'
import { BoldCrossOctagon } from 'src/uikit/Icon/BoldCrossOctagon'
import { BoldSend } from 'src/uikit/Icon/BoldSend'

export type Props = {
    header?: ReactNode
    footer?: ReactNode
    children: ReactNode
}

export const Content = ({ header, children, footer }: Props) => {
    return (
        <div className={styles.LayoutContentContainer}>
            {header}
            <div className={styles.LayoutContent}>{children}</div>
            {footer && (
                <Column2 spacing={0} style={{ flex: '0 0 auto' }}>
                    <Divider variant="default" />
                    <div className={styles.LayoutFooter}>{footer}</div>
                </Column2>
            )}
        </div>
    )
}

Content.Header = ({
    title,
    titleId,
    subtitle,
}: {
    title: ReactNode
    titleId?: string
    subtitle?: ReactNode
}) => {
    return (
        <>
            <div className={styles.LayoutHeaderContainer}>
                <Column2 spacing={6}>
                    <Text2
                        id={titleId}
                        variant="title3"
                        weight="semi_bold"
                        color="textPrimary"
                    >
                        {title}
                    </Text2>
                    {subtitle && (
                        <Text2
                            variant="paragraph"
                            weight="regular"
                            color="textSecondary"
                        >
                            {subtitle}
                        </Text2>
                    )}
                </Column2>
            </div>
            <Divider variant="default" />
        </>
    )
}

Content.Splash = ({
    title,
    variant,
    onAnimationComplete,
}: {
    title: React.ReactNode
    variant:
        | 'spinner'
        | 'success'
        | 'error'
        | 'stop'
        | 'paper-plane'
        | 'warning'
    onAnimationComplete: (() => void) | null
}) => {
    // TODO This component break footer if too much content
    return (
        <Column2 spacing={16} style={{ height: '100%' }} alignX="center">
            <Spacer2 />

            {(() => {
                switch (variant) {
                    case 'spinner':
                        return <Spinner size={72} color="iconStatusNeutral" />

                    case 'success':
                        return (
                            <Animation
                                animation="success"
                                size={72}
                                loop={false}
                                onAnimationEvent={(event) => {
                                    switch (event) {
                                        case 'complete':
                                            onAnimationComplete?.()
                                            break
                                        /* istanbul ignore next */
                                        default:
                                            return notReachable(event)
                                    }
                                }}
                            />
                        )

                    case 'warning':
                        return (
                            <BoldDangerTriangle
                                color="iconStatusWarning"
                                size={72}
                            />
                        )
                    case 'error':
                        return (
                            <BoldDangerTriangle
                                color="iconStatusCritical"
                                size={72}
                            />
                        )

                    case 'stop':
                        return (
                            <BoldCrossOctagon
                                color="iconStatusNeutral"
                                size={72}
                            />
                        )

                    case 'paper-plane':
                        return <BoldSend color="iconStatusNeutral" size={72} />

                    /* istanbul ignore next */
                    default:
                        notReachable(variant)
                }
            })()}

            <Text2
                variant="title2"
                weight="bold"
                color="textPrimary"
                align="center"
            >
                {title}
            </Text2>

            <Spacer2 />
        </Column2>
    )
}
