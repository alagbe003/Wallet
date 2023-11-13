import { Skeleton } from 'src/uikit/Skeleton'
import style from './ListItem2.module.scss'
import { Column2 } from 'src/uikit/Column2'
import {
    AVATAR_SIZE,
    AvatarRenderProps,
    ICON_SIZE,
    IconRenderProps,
} from 'src/uikit/ListItem2/InternalItem'
import { Row } from '@zeal/uikit/Row'

export type ListItemSkeletonProps = {
    avatar?: true | ((avatarRenderProps: AvatarRenderProps) => React.ReactNode)
    shortText?: boolean
    side?: {
        rightIcon?: (iconRenderProps: IconRenderProps) => React.ReactNode
    }
}

export const ListItemSkeleton = ({
    avatar,
    shortText,
    side,
}: ListItemSkeletonProps) => {
    return (
        <div className={style.container}>
            <Row spacing={8}>
                <Row grow shrink ignoreContentWidth spacing={12}>
                    {!avatar ? null : avatar === true ? (
                        <Skeleton
                            variant="default"
                            height={AVATAR_SIZE}
                            width={AVATAR_SIZE}
                        />
                    ) : (
                        avatar({ size: AVATAR_SIZE })
                    )}
                    <Column2 spacing={4}>
                        <Skeleton variant="default" height={18} width="75%" />
                        {shortText && (
                            <Skeleton
                                variant="default"
                                height={15}
                                width="25%"
                            />
                        )}
                    </Column2>
                </Row>

                {side && (
                    <Row spacing={8}>
                        {side.rightIcon ? (
                            <Row spacing={0} alignY="center">
                                {side.rightIcon({ size: ICON_SIZE })}
                            </Row>
                        ) : null}
                    </Row>
                )}
            </Row>
        </div>
    )
}
