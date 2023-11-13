import { KnownCurrencies } from '@zeal/domains/Currency'
import { FormattedFeeInDefaultCurrency } from 'src/domains/Money/components/FormattedFeeInDefaultCurrency'
import { EstimatedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction/TransactionFee'
import { TruncatedFeeInNativeTokenCurrency } from 'src/domains/Money/components/TruncatedFeeInNativeTokenCurrency'

type Props = {
    fee: EstimatedFee
    knownCurrencies: KnownCurrencies
}

export const FormattedFee = ({ fee, knownCurrencies }: Props) => {
    return fee.priceInDefaultCurrency ? (
        <FormattedFeeInDefaultCurrency
            knownCurrencies={knownCurrencies}
            money={fee.priceInDefaultCurrency}
        />
    ) : (
        <TruncatedFeeInNativeTokenCurrency
            knownCurrencies={knownCurrencies}
            money={fee.priceInNativeCurrency}
        />
    )
}
