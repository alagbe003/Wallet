import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { FormattedFeeInDefaultCurrency } from '@zeal/domains/Money/components/FormattedFeeInDefaultCurrency'
import { TruncatedFeeInNativeTokenCurrency } from '@zeal/domains/Money/components/TruncatedFeeInNativeTokenCurrency'
import { NetworkMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { CancelSubmited } from '@zeal/domains/TransactionRequest'
import { SubmitedTransactionFailed } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { fetchFinalFee } from '@zeal/domains/Transactions/api/fetchFinalFee'
import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { Button } from 'src/uikit'
import { Banner } from 'src/uikit/Banner'
import { Column2 } from 'src/uikit/Column2'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from 'src/uikit/Skeleton'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    failedTransaction: SubmitedTransactionFailed
    transactionRequest: CancelSubmited
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

export type Msg = {
    type: 'transaction_cancel_failure_accepted'
    failedTransaction: SubmitedTransactionFailed
    transactionRequest: CancelSubmited
}

export const Failed = ({
    failedTransaction,
    transactionRequest,
    networkMap,
    onMsg,
}: Props) => {
    const network = findNetworkByHexChainId(
        transactionRequest.networkHexId,
        networkMap
    )
    const [loadable] = useLoadableData(fetchFinalFee, {
        type: 'loading',
        params: {
            gasInfo: failedTransaction.gasInfo,
            network,
        },
    })

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
            case 'loaded':
                break

            case 'error':
                captureError(loadable.error)
                break

            default:
                notReachable(loadable)
        }
    }, [loadable])

    switch (loadable.type) {
        case 'error':
        case 'loading':
            return (
                <Column2 spacing={12}>
                    <Banner variant="outline" icon={null}>
                        <Row spacing={0} alignX="stretch" fullWidth>
                            <Text2
                                variant="paragraph"
                                color="textPrimary"
                                weight="regular"
                            >
                                <FormattedMessage
                                    id="confirmTransaction.finalNetworkFee"
                                    defaultMessage="Final network fee"
                                />
                            </Text2>

                            <Skeleton variant="default" width={80} />
                        </Row>
                    </Banner>

                    <Button
                        variant="primary"
                        size="regular"
                        onClick={() =>
                            onMsg({
                                type: 'transaction_cancel_failure_accepted',
                                failedTransaction,
                                transactionRequest,
                            })
                        }
                    >
                        <FormattedMessage
                            id="action.close"
                            defaultMessage="Close"
                        />
                    </Button>
                </Column2>
            )

        case 'loaded':
            return (
                <Column2 spacing={12}>
                    <Banner variant="outline" icon={null}>
                        <Row spacing={0} alignX="stretch" fullWidth>
                            <Text2
                                variant="paragraph"
                                color="textPrimary"
                                weight="regular"
                            >
                                <FormattedMessage
                                    id="confirmTransaction.finalNetworkFee"
                                    defaultMessage="Final network fee"
                                />
                            </Text2>

                            <Text2
                                variant="paragraph"
                                color="textPrimary"
                                weight="regular"
                            >
                                {loadable.data.priceInDefaultCurrency ? (
                                    <FormattedFeeInDefaultCurrency
                                        money={
                                            loadable.data.priceInDefaultCurrency
                                        }
                                        knownCurrencies={
                                            loadable.data.knownCurriencies
                                        }
                                    />
                                ) : (
                                    <TruncatedFeeInNativeTokenCurrency
                                        money={loadable.data.fee}
                                        knownCurrencies={
                                            loadable.data.knownCurriencies
                                        }
                                    />
                                )}
                            </Text2>
                        </Row>
                    </Banner>

                    <Button
                        variant="primary"
                        size="regular"
                        onClick={() =>
                            onMsg({
                                type: 'transaction_cancel_failure_accepted',
                                failedTransaction,
                                transactionRequest,
                            })
                        }
                    >
                        <FormattedMessage
                            id="action.close"
                            defaultMessage="Close"
                        />
                    </Button>
                </Column2>
            )

        default:
            return notReachable(loadable)
    }
}
