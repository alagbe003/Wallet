import { Currency } from '@zeal/domains/Currency'
import { notReachable } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'
import { QuestionCircle } from 'src/uikit/Icon/QuestionCircle'
import { Avatar as UIAvatar, AvatarSize } from 'src/uikit/Avatar'
import { ComponentPropsWithoutRef } from 'react'
import { Text2 } from 'src/uikit/Text2'

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
                    <Text2
                        variant="caption1"
                        weight="medium"
                        color="textPrimary"
                        align="center"
                    >
                        {currency.symbol}
                    </Text2>
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
                    src={loadable.data}
                    size={size}
                    rightBadge={rightBadge}
                    leftBadge={leftBadge}
                />
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
        <UIAvatar
            size={size}
            icon={<QuestionCircle size={size} color="iconDefault" />}
            rightBadge={rightBadge}
            leftBadge={leftBadge}
        />
    )
}
