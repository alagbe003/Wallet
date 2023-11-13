import { FormattedMessage } from 'react-intl'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { Money } from '@zeal/domains/Money'
import { FormattedTokenBalances } from 'src/domains/Money/components/FormattedTokenBalances'

export type Props = {
    money: Money
    knownCurrencies: KnownCurrencies
}

export const FormattedFeeInNativeTokenCurrency = ({
    knownCurrencies,
    money,
}: Props) => {
    const currency = useCurrencyById(money.currencyId, knownCurrencies)

    if (!currency) {
        return null
    }

    return (
        <FormattedMessage
            id="money.FormattedFeeInNativeTokenCurrency"
            defaultMessage="{amount} {code}"
            values={{
                amount: (
                    <FormattedTokenBalances
                        knownCurrencies={knownCurrencies}
                        money={money}
                    />
                ),
                code: currency.code,
            }}
        />
    )
}
