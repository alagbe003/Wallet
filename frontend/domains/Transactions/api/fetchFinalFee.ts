import { CurrencyId, KnownCurrencies } from '@zeal/domains/Currency'
import { ImperativeError } from '@zeal/domains/Error'
import { fetchRate } from '@zeal/domains/FXRate/api/fetchRate'
import { applyRate } from '@zeal/domains/FXRate/helpers/applyRate'
import { Money } from '@zeal/domains/Money'
import { Network } from '@zeal/domains/Network'
import { GasInfo } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { notReachable } from '@zeal/toolkit'
import { getNativeTokenAddress } from '@zeal/domains/Network/helpers/getNativeTokenAddress'

const getFee = ({
    currencyId,
    gasInfo,
}: {
    gasInfo: GasInfo
    currencyId: CurrencyId
}): Money => {
    switch (gasInfo.type) {
        case 'generic':
            return {
                amount: gasInfo.gasUsed * gasInfo.effectiveGasPrice,
                currencyId,
            }

        case 'l2_rollup':
            const l1Fee =
                gasInfo.l1GasUsed * gasInfo.l1GasPrice * gasInfo.l1FeeScalar
            const l2Fee = gasInfo.gasUsed * gasInfo.l2GasPrice

            return {
                amount: l1Fee + l2Fee,
                currencyId,
            }

        /* istanbul ignore next */
        default:
            return notReachable(gasInfo)
    }
}

export const fetchFinalFee = async ({
    network,
    gasInfo,
}: {
    gasInfo: GasInfo
    network: Network
}): Promise<{
    fee: Money
    priceInDefaultCurrency: Money | null
    knownCurriencies: KnownCurrencies
}> => {
    switch (network.type) {
        case 'predefined': {
            const { currencies, rate } = await fetchRate({
                network,
                tokenAddress: getNativeTokenAddress(network),
            })
            const quote = currencies[rate.quote] || null

            if (!quote) {
                throw new ImperativeError(
                    'Quote currency is missing in dictionary'
                )
            }

            const fee = getFee({ currencyId: quote.id, gasInfo })

            const priceInDefaultCurrency = applyRate(fee, rate, currencies)

            return {
                priceInDefaultCurrency,
                fee,
                knownCurriencies: currencies,
            }
        }
        case 'custom':
        case 'testnet': {
            const currency = network.nativeCurrency

            return {
                fee: getFee({
                    gasInfo,
                    currencyId: currency.id,
                }),
                priceInDefaultCurrency: null,
                knownCurriencies: { [currency.id]: currency },
            }
        }

        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}
