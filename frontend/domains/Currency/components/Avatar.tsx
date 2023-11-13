import { Currency } from '@zeal/domains/Currency'
import { notReachable } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'
import { AvatarSize, Avatar as UIAvatar } from '@zeal/uikit/Avatar'
import { QuestionCircle } from '@zeal/uikit/Icon/QuestionCircle'
import { SvgImage } from '@zeal/uikit/SvgImage'
import { Text } from '@zeal/uikit/Text'
import React, { ComponentPropsWithoutRef } from 'react'

type Props = {
    currency: Currency | null
    rightBadge?: ComponentPropsWithoutRef<typeof UIAvatar>['rightBadge']
    leftBadge?: ComponentPropsWithoutRef<typeof UIAvatar>['leftBadge']
    size: AvatarSize
}

export const Avatar = ({ currency, size, rightBadge, leftBadge }: Props) => {
    if (!currency) {
        return <NoCurrencyAvatar size={size} rightBadge={rightBadge} />
    }

    switch (currency.type) {
        case 'FiatCurrency':
            return (
                <UIAvatar
                    size={size}
                    border="secondary"
                    rightBadge={rightBadge}
                    leftBadge={leftBadge}
                >
                    <Text
                        variant="caption1"
                        weight="medium"
                        color="textPrimary"
                        align="center"
                    >
                        {currency.symbol}
                    </Text>
                </UIAvatar>
            )

        case 'CryptoCurrency':
            return (
                <CryptoCurrencyAvatar
                    currency={currency}
                    size={size}
                    rightBadge={rightBadge}
                    leftBadge={leftBadge}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}

const fetchImage = ({ src }: { src: string }): Promise<string> =>
    new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(src)
        img.onerror = reject
        img.src = src
    })

const CryptoCurrencyAvatar = ({
    currency,
    size,
    rightBadge,
    leftBadge,
}: Props) => {
    const [loadable] = useLazyLoadableData(
        fetchImage,
        currency
            ? { type: 'loading', params: { src: currency.icon } }
            : { type: 'not_asked' }
    )

    switch (loadable.type) {
        case 'not_asked':
        case 'error':
        case 'loading':
            return (
                <NoCurrencyAvatar
                    size={size}
                    leftBadge={leftBadge}
                    rightBadge={rightBadge}
                />
            )

        case 'loaded':
            return (
                <UIAvatar
                    size={size}
                    rightBadge={rightBadge}
                    leftBadge={leftBadge}
                >
                    <SvgImage size={size} src={loadable.params.src} />
                </UIAvatar>
            )

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}

const NoCurrencyAvatar = ({
    size,
    rightBadge,
    leftBadge,
}: Omit<Props, 'currency'>) => {
    return (
        <UIAvatar size={size} rightBadge={rightBadge} leftBadge={leftBadge}>
            <QuestionCircle size={size} color="iconDefault" />
        </UIAvatar>
    )
}
