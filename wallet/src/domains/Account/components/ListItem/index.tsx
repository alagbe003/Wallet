import React from 'react'
import { Account } from '@zeal/domains/Account'
import { Portfolio } from '@zeal/domains/Portfolio'
import { sumPortfolio } from '@zeal/domains/Portfolio/helpers/sum'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { KeyStore } from '@zeal/domains/KeyStore'
import { Avatar } from '../Avatar'
import { Text } from '@zeal/uikit/Text'
import { ListItem as UIListItem } from '@zeal/uikit/ListItem'
import { IconButton } from '@zeal/uikit/IconButton'
import { ThreeDotVertical } from 'src/uikit/Icon/ThreeDotVertical'
import { useIntl } from 'react-intl'
import { CopyAddress } from 'src/domains/Address/components/CopyAddress'
import { Row } from '@zeal/uikit/Row'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

type Props = {
    account: Account
    selected: boolean
    keystore: KeyStore
    portfolio: Portfolio | null // can be not loaded yet
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'account_item_clicked'; account: Account }
    | { type: 'account_details_clicked'; account: Account }

export const ListItem = ({
    account,
    keystore,
    portfolio,
    selected,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    const sum = portfolio && sumPortfolio(portfolio, currencyHiddenMap)

    return (
        <UIListItem
            size="regular"
            onClick={() => {
                onMsg({
                    type: 'account_item_clicked',
                    account,
                })
            }}
            avatar={({ size }) => (
                <Avatar account={account} keystore={keystore} size={size} />
            )}
            primaryText={account.label}
            shortText={
                <Row spacing={16}>
                    <CopyAddress
                        size="small"
                        color="on_light"
                        address={account.address}
                    />
                    {sum && (
                        <Text>
                            <FormattedTokenBalanceInDefaultCurrency
                                money={sum}
                                knownCurrencies={portfolio.currencies}
                            />
                        </Text>
                    )}
                </Row>
            }
            aria-selected={selected}
            side={{
                rightIcon: ({ size }) => (
                    <IconButton
                        aria-label={formatMessage({
                            id: 'Account.ListItem.details.label',
                            defaultMessage: 'Details',
                        })}
                        onClick={(e) => {
                            e.stopPropagation()
                            onMsg({
                                type: 'account_details_clicked',
                                account,
                            })
                        }}
                    >
                        <ThreeDotVertical size={size} />
                    </IconButton>
                ),
            }}
        />
    )
}
