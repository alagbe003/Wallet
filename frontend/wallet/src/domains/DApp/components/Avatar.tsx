import { notReachable } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'
import { QuestionCircle } from 'src/uikit/Icon/QuestionCircle'
import { Avatar as UIAvatar, AvatarSize } from 'src/uikit/Avatar'
import { ComponentPropsWithoutRef, useEffect } from 'react'
import { DAppSiteInfo } from '@zeal/domains/DApp'

type Props = {
    dApp: DAppSiteInfo
    badge?: ComponentPropsWithoutRef<typeof UIAvatar>['rightBadge']
    size: AvatarSize
}

const fetchImage = ({ src }: { src: string }): Promise<string> =>
    new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(src)
        img.onerror = reject
        img.src = src
    })

export const Avatar = ({ dApp, size, badge }: Props) => {
    const [loadable, setLoadable] = useLazyLoadableData(fetchImage, {
        type: 'not_asked',
    })

    useEffect(() => {
        setLoadable(
            dApp.avatar
                ? { type: 'loading', params: { src: dApp.avatar } }
                : { type: 'not_asked' }
        )
    }, [dApp.avatar, setLoadable])

    switch (loadable.type) {
        case 'not_asked':
        case 'error':
        case 'loading':
            return (
                <UIAvatar
                    size={size}
                    icon={<QuestionCircle size={size} color="iconDefault" />}
                    rightBadge={badge}
                />
            )

        case 'loaded':
            return (
                <UIAvatar src={loadable.data} size={size} rightBadge={badge} />
            )

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
