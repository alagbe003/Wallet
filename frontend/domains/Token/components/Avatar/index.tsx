import { KnownCurrencies } from '@zeal/domains/Currency'
import { Avatar as CurrencyAvatar } from '@zeal/domains/Currency/components/Avatar'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { Token } from '@zeal/domains/Token'
import { AvatarSize } from '@zeal/uikit/Avatar'
import React, { ComponentPropsWithoutRef } from 'react'

type Props = {
    token: Token
    knownCurrencies: KnownCurrencies
    size: AvatarSize
    children?: React.ReactNode
    rightBadge: ComponentPropsWithoutRef<typeof CurrencyAvatar>['rightBadge']
    leftBadge?: ComponentPropsWithoutRef<typeof CurrencyAvatar>['leftBadge']
}
export const Avatar = ({
    token,
    size,
    knownCurrencies,
    rightBadge,
    leftBadge,
}: Props) => {
    const currency = useCurrencyById(token.balance.currencyId, knownCurrencies)

    return (
        <CurrencyAvatar
            currency={currency}
            size={size}
            rightBadge={rightBadge}
            leftBadge={leftBadge}
        />
    )
}
