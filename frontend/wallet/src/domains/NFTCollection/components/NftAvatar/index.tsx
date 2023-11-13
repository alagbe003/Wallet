import { Avatar, AvatarSize } from 'src/uikit/Avatar'
import { Nft } from '@zeal/domains/NFTCollection'
import React, { ComponentPropsWithoutRef } from 'react'
import { getArtworkSource } from 'src/domains/NFTCollection/helpers/getArtworkSource'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'
import { BoldImage } from 'src/uikit/Icon/BoldImage'
import { notReachable } from '@zeal/toolkit'

const fetchImage = ({ src }: { src: string }): Promise<string> =>
    new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(src)
        img.onerror = reject
        img.src = src
    })

export const NftAvatar = ({
    nft,
    badge,
    size,
}: {
    size: AvatarSize
    nft: Nft
    badge?: ComponentPropsWithoutRef<typeof Avatar>['rightBadge']
}) => {
    const source = getArtworkSource(nft)

    const [loadable] = useLazyLoadableData(
        fetchImage,
        source
            ? { type: 'loading', params: { src: source } }
            : { type: 'not_asked' }
    )

    switch (loadable.type) {
        case 'not_asked':
        case 'error':
        case 'loading':
            return (
                <Avatar
                    size={size}
                    variant="squared"
                    icon={<BoldImage size={size} color="iconDefault" />}
                    rightBadge={badge}
                />
            )

        case 'loaded':
            return (
                <Avatar
                    size={size}
                    variant="squared"
                    src={loadable.data}
                    rightBadge={badge}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
