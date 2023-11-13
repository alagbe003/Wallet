import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { NetworkMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { CancelSubmited } from '@zeal/domains/TransactionRequest'
import { SubmitedTransactionCompleted } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { fetchFinalFee } from '@zeal/domains/Transactions/api/fetchFinalFee'
import { FinalFeeBanner } from 'src/domains/Transactions/components/FinalFeeBanner'
import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { Button } from 'src/uikit'
import { Banner } from 'src/uikit/Banner'
import { Column2 } from 'src/uikit/Column2'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from 'src/uikit/Skeleton'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    completedTransaction: SubmitedTransactionCompleted
    transactionRequest: CancelSubmited
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

export type Msg = {
    type: 'transaction_cancel_success'
    completedTransaction: SubmitedTransactionCompleted
    transactionRequest: CancelSubmited
}

export const Completed = ({
    completedTransaction,
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
            gasInfo: completedTransaction.gasInfo,
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
        case 'error': // TODO What to render if BE fails :thinking:
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
                                    id="confirmTransaction.networkFee"
                                    defaultMessage="Network fee"
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
                                type: 'transaction_cancel_success',
                                completedTransaction,
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
                    <FinalFeeBanner
                        fee={loadable.data.fee}
                        priceInDefaultCurrency={
                            loadable.data.priceInDefaultCurrency
                        }
                        knownCurrencies={loadable.data.knownCurriencies}
                    />

                    <Button
                        variant="primary"
                        size="regular"
                        onClick={() =>
                            onMsg({
                                type: 'transaction_cancel_success',
                                completedTransaction,
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
