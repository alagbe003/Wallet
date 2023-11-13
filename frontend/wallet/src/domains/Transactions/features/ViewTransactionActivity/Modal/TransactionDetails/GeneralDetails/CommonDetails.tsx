import {
    ActivityTransaction,
    InboundP2PActivityTransaction,
    RpcTransaction,
} from '@zeal/domains/Transactions'
import { NetworkMap } from '@zeal/domains/Network'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { FormattedMessage } from 'react-intl'
import { FormattedFeeInNativeTokenCurrency } from 'src/domains/Money/components/FormattedFeeInNativeTokenCurrency'
import { FormattedFeeInDefaultCurrency } from 'src/domains/Money/components/FormattedFeeInDefaultCurrency'
import { DetailItem } from './DetailItem'
import { Nonce } from './Nonce'
import { BlockNumber } from './BlockNumber'
import { format } from '@zeal/domains/Transactions/domains/TransactionHash/helpers/format'
import { getExplorerLink } from '@zeal/domains/Transactions/domains/TransactionHash/helpers/getExplorerLink'

export const CommonDetails = ({
    transaction,
    networkMap,
    knownCurrencies,
    loadable,
}: {
    transaction: Exclude<ActivityTransaction, InboundP2PActivityTransaction>
    networkMap: NetworkMap
    knownCurrencies: KnownCurrencies
    loadable: LoadableData<RpcTransaction, unknown>
}) => {
    const network = findNetworkByHexChainId(
        transaction.networkHexId,
        networkMap
    )

    return (
        <>
            <DetailItem
                label={
                    <FormattedMessage
                        id="activity.detail.general.hash"
                        defaultMessage="Transaction hash"
                    />
                }
                value={format({ transactionHash: transaction.hash })}
                explorerLink={getExplorerLink(
                    { transactionHash: transaction.hash },
                    network
                )}
            />
            <DetailItem
                label={
                    <FormattedMessage
                        id="activity.detail.general.network"
                        defaultMessage="Network"
                    />
                }
                value={network.name}
                explorerLink={null}
            />
            {transaction.paidFee && (
                <>
                    <DetailItem
                        label={
                            <FormattedMessage
                                id="activity.detail.general.fee-in-tokens"
                                defaultMessage="Network fee in Tokens"
                            />
                        }
                        value={
                            <FormattedFeeInNativeTokenCurrency
                                money={
                                    transaction.paidFee.priceInNativeCurrency
                                }
                                knownCurrencies={knownCurrencies}
                            />
                        }
                        explorerLink={null}
                    />
                    {transaction.paidFee.priceInDefaultCurrency && (
                        <DetailItem
                            label={
                                <FormattedMessage
                                    id="activity.detail.general.fee-in-default-currency"
                                    defaultMessage="Network fee in {defaultCurrency}"
                                    values={{
                                        defaultCurrency:
                                            transaction.paidFee
                                                .priceInDefaultCurrency
                                                .currencyId,
                                    }}
                                />
                            }
                            value={
                                <FormattedFeeInDefaultCurrency
                                    money={
                                        transaction.paidFee
                                            .priceInDefaultCurrency
                                    }
                                    knownCurrencies={knownCurrencies}
                                />
                            }
                            explorerLink={null}
                        />
                    )}
                </>
            )}
            <Nonce loadable={loadable} />
            <BlockNumber loadable={loadable} network={network} />
        </>
    )
}
