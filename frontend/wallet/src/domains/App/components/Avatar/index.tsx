import React, { ComponentPropsWithoutRef } from 'react'
import { App } from '@zeal/domains/App'
import { Avatar as UIAvatar, AvatarSize } from 'src/uikit/Avatar'

type Props = {
    app: App
    size: AvatarSize
    children?: React.ReactNode
    badge?: ComponentPropsWithoutRef<typeof UIAvatar>['rightBadge']
}

export const Avatar = ({ app, size, badge, children }: Props) => {
    return (
        <UIAvatar src={app.icon} size={size} rightBadge={badge}>
            {children}
        </UIAvatar>
    )
}
