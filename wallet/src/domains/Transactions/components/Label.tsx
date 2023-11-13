import { ActivityTransaction } from '@zeal/domains/Transactions'
import { FormattedFeeInDefaultCurrency } from '@zeal/domains/Money/components/FormattedFeeInDefaultCurrency'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { notReachable } from '@zeal/toolkit'
import { Text2 } from 'src/uikit/Text2'
import { FormattedMessage } from 'react-intl'
import { TruncatedFeeInNativeTokenCurrency } from '@zeal/domains/Money/components/TruncatedFeeInNativeTokenCurrency'

type Props = {
    transaction: ActivityTransaction
    knownCurrencies: KnownCurrencies
}

export const Label = ({ transaction, knownCurrencies }: Props) => {
    switch (transaction.type) {
        case 'InboundP2PActivityTransaction':
            return null
        case 'FailedActivityTransaction':
            return (
                <Text2
                    variant="footnote"
                    ellipsis
                    weight="regular"
                    color="textStatusCriticalOnColor"
                >
                    <FormattedMessage
                        id="activity.failed-transaction.label"
                        defaultMessage="Failed"
                    />
                </Text2>
            )
        case 'SelfP2PActivityTransaction':
        case 'OutboundP2PActivityTransaction':
        case 'OutboundP2PNftActivityTransaction':
        case 'SingleNftApprovalActivityTransaction':
        case 'SingleNftApprovalRevokeActivityTransaction':
        case 'NftCollectionApprovalActivityTransaction':
        case 'NftCollectionApprovalRevokeActivityTransaction':
        case 'Erc20ApprovalActivityTransaction':
        case 'Erc20ApprovalRevokeActivityTransaction':
        case 'PartialTokenApprovalActivityTransaction':
        case 'UnknownActivityTransaction':
            return transaction.paidFee ? (
                transaction.paidFee.priceInDefaultCurrency ? (
                    <Text2
                        variant="footnote"
                        ellipsis
                        weight="regular"
                        color="textSecondary"
                    >
                        <FormattedFeeInDefaultCurrency
                            money={transaction.paidFee.priceInDefaultCurrency}
                            knownCurrencies={knownCurrencies}
                        />
                    </Text2>
                ) : (
                    <Text2
                        variant="footnote"
                        ellipsis
                        weight="regular"
                        color="textSecondary"
                    >
                        <TruncatedFeeInNativeTokenCurrency
                            money={transaction.paidFee.priceInNativeCurrency}
                            knownCurrencies={knownCurrencies}
                        />
                    </Text2>
                )
            ) : null
        /* istanbul ignore next */
        default:
            return notReachable(transaction)
    }
}
