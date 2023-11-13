import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { Money } from '@zeal/domains/Money'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { failure, Result, success } from '@zeal/toolkit/Result'
import { getEstimatedFee } from 'src/domains/Transactions/domains/SimulatedTransaction/helpers/getEstimatedFee'

type LoadedData = Extract<
    PollableData<FeeForecastResponse, FeeForecastRequest>,
    { type: 'loaded' | 'reloading' | 'subsequent_failed' }
>

export type NotEnoughBalance = {
    type: 'not_enough_balance'
    pollable: LoadedData
    requiredAmount: Money
}

export const validateNotEnoughBalance = ({
    pollable,
    transactionRequest,
}: {
    pollable: LoadedData
    transactionRequest: EthSendTransaction
}): Result<NotEnoughBalance, LoadedData> => {
    const preset = getEstimatedFee(pollable)
    if (!preset) {
        return success(pollable)
    }

    const value = BigInt(transactionRequest.params[0].value || 0)
    const requiredAmount = value + preset.priceInNativeCurrency.amount

    return requiredAmount > pollable.data.balanceInNativeCurrency.amount
        ? failure({
              type: 'not_enough_balance' as const,
              pollable,
              requiredAmount: {
                  amount: requiredAmount,
                  currencyId: pollable.data.balanceInNativeCurrency.currencyId,
              },
          })
        : success(pollable)
}
