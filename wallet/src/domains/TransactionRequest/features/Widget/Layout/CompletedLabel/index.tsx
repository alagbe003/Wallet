import { SubmitedTransactionCompleted } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { fetchFinalFee } from '@zeal/domains/Transactions/api/fetchFinalFee'
import { Network } from '@zeal/domains/Network'
import { notReachable } from '@zeal/toolkit'
import { Skeleton } from 'src/uikit/Skeleton'
import { Text2 } from 'src/uikit/Text2'
import { FormattedFeeInDefaultCurrency } from '@zeal/domains/Money/components/FormattedFeeInDefaultCurrency'

type Props = {
    completedTransaction: SubmitedTransactionCompleted
    network: Network
}

export const CompletedLabel = ({ completedTransaction, network }: Props) => {
    const [loadable] = useLoadableData(fetchFinalFee, {
        type: 'loading',
        params: {
            gasInfo: completedTransaction.gasInfo,
            network,
        },
    })

    switch (loadable.type) {
        case 'loading':
            return <Skeleton variant="default" width={40} height={16} />
        case 'loaded':
            const { priceInDefaultCurrency, knownCurriencies } = loadable.data
            return priceInDefaultCurrency ? (
                <Text2
                    variant="footnote"
                    weight="regular"
                    color="textStatusSuccessOnColor"
                    whiteSpace="nowrap"
                >
                    <FormattedFeeInDefaultCurrency
                        money={priceInDefaultCurrency}
                        knownCurrencies={knownCurriencies}
                    />
                </Text2>
            ) : null
        case 'error':
            return null
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
