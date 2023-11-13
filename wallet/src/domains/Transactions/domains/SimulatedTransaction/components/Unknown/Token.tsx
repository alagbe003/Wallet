import { KnownCurrencies } from '@zeal/domains/Currency'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { UnknownTransactionToken } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { notReachable } from '@zeal/toolkit'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { FormattedTokenInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenInDefaultCurrency'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { Avatar } from 'src/domains/Currency/components/Avatar'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { CurrencyBadge } from 'src/domains/SafetyCheck/components/CurrencyBadge'
import { ExplorerLink } from 'src/domains/Currency/components/ExplorerLink'
import { Text2 } from 'src/uikit/Text2'
import { Row } from '@zeal/uikit/Row'
import { NetworkMap } from '@zeal/domains/Network'

type Props = {
    token: UnknownTransactionToken
    safetyChecks: TransactionSafetyCheck[]
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
}

const sign = (token: UnknownTransactionToken): string => {
    switch (token.direction) {
        case 'Send':
            return '-'

        case 'Receive':
            return '+'

        /* istanbul ignore next */
        default:
            return notReachable(token.direction)
    }
}

export const Token = ({
    token,
    networkMap,
    knownCurrencies,
    safetyChecks,
}: Props) => {
    const currency = useCurrencyById(token.amount.currencyId, knownCurrencies)

    return (
        <ListItem2
            aria-selected={false}
            primaryText={
                currency ? (
                    <Row alignY="center" spacing={4}>
                        <Text2>{currency.symbol}</Text2>
                        <ExplorerLink
                            networkMap={networkMap}
                            currency={currency}
                        />
                    </Row>
                ) : null
            }
            avatar={({ size }) => (
                <Avatar
                    currency={currency}
                    size={size}
                    rightBadge={({ size }) => (
                        <CurrencyBadge
                            size={size}
                            currencyId={currency && currency.id}
                            safetyChecks={safetyChecks}
                        />
                    )}
                />
            )}
            size="large"
            side={{
                title: (
                    <>
                        {sign(token)}
                        <FormattedTokenBalances
                            money={token.amount}
                            knownCurrencies={knownCurrencies}
                        />
                    </>
                ),
                subtitle: token.priceInDefaultCurrency ? (
                    <Text2
                        variant="paragraph"
                        weight="regular"
                        color="textSecondary"
                    >
                        {sign(token)}
                        <FormattedTokenInDefaultCurrency
                            money={token.priceInDefaultCurrency}
                            knownCurrencies={knownCurrencies}
                        />
                    </Text2>
                ) : null,
            }}
            aria-labelledby={`token-list-item-label-${currency && currency.id}`}
        />
    )
}
