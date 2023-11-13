import { TransactionToken } from '@zeal/domains/Transactions'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { Network } from '@zeal/domains/Network'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { Avatar } from 'src/domains/Currency/components/Avatar'
import { Badge } from '@zeal/domains/Network/components/Badge'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import React from 'react'
import { getSign } from '@zeal/domains/Transactions/helpers/getSign'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'

export const TokenListItem = ({
    token,
    knownCurrencies,
    network,
}: {
    token: TransactionToken
    knownCurrencies: KnownCurrencies
    network: Network
}) => {
    const currency = useCurrencyById(token.amount.currencyId, knownCurrencies)

    return (
        <ListItem2
            aria-selected={false}
            size="regular"
            avatar={({ size }) => (
                <Avatar
                    currency={currency}
                    size={size}
                    rightBadge={({ size }) => (
                        <Badge size={size} network={network} />
                    )}
                />
            )}
            primaryText={currency?.symbol}
            side={{
                title: (
                    <>
                        {getSign(token.direction)}
                        <FormattedTokenBalances
                            money={token.amount}
                            knownCurrencies={knownCurrencies}
                        />
                    </>
                ),
            }}
        />
    )
}
