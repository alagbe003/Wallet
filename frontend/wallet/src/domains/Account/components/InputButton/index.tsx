import React from 'react'
import { Account } from '@zeal/domains/Account'
import { AvatarWithoutBadge } from 'src/domains/Account/components/Avatar'
import { Portfolio } from '@zeal/domains/Portfolio'
import { ListItemButton } from 'src/uikit/ListItem2/ListItemButton'
import { LightArrowDown2 } from 'src/uikit/Icon/LightArrowDown2'
import { sumPortfolio } from '@zeal/domains/Portfolio/helpers/sum'
import { Chain } from 'src/uikit/Chain'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { format } from '@zeal/domains/Address/helpers/format'
import { Text } from '@zeal/uikit/Text'
import { Column2 } from 'src/uikit/Column2'
import { FormattedMessage } from 'react-intl'
import { KeyStore } from '@zeal/domains/KeyStore'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

type Props = {
    account: Account
    portfolio: Portfolio | null
    keystore: KeyStore
    currencyHiddenMap: CurrencyHiddenMap
    onClick: () => void
}

export const InputButton = ({
    account,
    portfolio,
    keystore,
    currencyHiddenMap,
    onClick,
}: Props) => {
    const sum = portfolio && sumPortfolio(portfolio, currencyHiddenMap)

    return (
        <Column2 spacing={8}>
            <Text variant="paragraph" weight="regular" color="textSecondary">
                <FormattedMessage
                    id="account.components.input_button_title"
                    defaultMessage="Account"
                />
            </Text>
            <ListItemButton
                onClick={onClick}
                avatar={({ size }) => (
                    <AvatarWithoutBadge
                        keystore={keystore}
                        size={size}
                        account={account}
                    />
                )}
                primaryText={account.label}
                shortText={
                    <Chain>
                        <Text>{format(account.address)}</Text>
                        {sum && (
                            <Text>
                                <FormattedTokenBalanceInDefaultCurrency
                                    money={sum}
                                    knownCurrencies={portfolio.currencies}
                                />
                            </Text>
                        )}
                    </Chain>
                }
                side={{
                    rightIcon: ({ size }) => (
                        <LightArrowDown2 size={size} color="iconDefault" />
                    ),
                }}
            />
        </Column2>
    )
}
