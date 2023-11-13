import React from 'react'
import { Account } from '@zeal/domains/Account'
import { Portfolio } from '@zeal/domains/Portfolio'
import { sumPortfolio } from '@zeal/domains/Portfolio/helpers/sum'
import { KeyStore } from '@zeal/domains/KeyStore'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { Avatar } from 'src/domains/Account/components/Avatar'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Text2 } from 'src/uikit/Text2'
import { Row } from '@zeal/uikit/Row'
import { CopyAddress } from 'src/domains/Address/components/CopyAddress'
import { Checkbox } from 'src/uikit/Icon/Checkbox'
import { NotSelected } from 'src/uikit/Icon/NotSelected'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

type Props = {
    account: Account
    selected: boolean
    selectionVariant: 'default' | 'checkbox'
    keyStore: KeyStore
    portfolio: Portfolio | null // can be not loaded yet
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'account_item_clicked'; account: Account }

// TODO :: rename, this is confusing
export const UnlockedListItem = ({
    account,
    portfolio,
    selected,
    keyStore,
    selectionVariant,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const sum = portfolio && sumPortfolio(portfolio, currencyHiddenMap)

    return (
        <>
            <ListItem2
                size="large"
                onClick={() => {
                    onMsg({
                        type: 'account_item_clicked',
                        account,
                    })
                }}
                avatar={({ size }) => (
                    <Avatar account={account} keystore={keyStore} size={size} />
                )}
                primaryText={account.label}
                shortText={
                    <Row spacing={16}>
                        <CopyAddress
                            size="small"
                            color="on_light"
                            address={account.address}
                        />
                        <Text2>
                            {sum && (
                                <FormattedTokenBalanceInDefaultCurrency
                                    money={sum}
                                    knownCurrencies={portfolio.currencies}
                                />
                            )}
                        </Text2>
                    </Row>
                }
                aria-selected={
                    selectionVariant === 'default' ? selected : false
                }
                side={
                    selectionVariant === 'checkbox'
                        ? {
                              rightIcon: ({ size }) =>
                                  selected ? (
                                      <Checkbox
                                          size={size}
                                          color="iconAccent2"
                                      />
                                  ) : (
                                      <NotSelected
                                          size={size}
                                          color="iconDefault"
                                      />
                                  ),
                          }
                        : undefined
                }
            />
        </>
    )
}
