import { FormattedMessage, useIntl } from 'react-intl'
import {
    MONTHLY_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY,
    POST_KYC_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY,
} from '@zeal/domains/Currency/domains/BankTransfer/constants'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { notReachable } from '@zeal/toolkit'
import { Column2 } from 'src/uikit/Column2'
import { Divider } from 'src/uikit/Divider'
import { Header } from 'src/uikit/Header'
import { Popup } from 'src/uikit/Popup'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from 'src/uikit/Skeleton'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Text2 } from 'src/uikit/Text2'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { WithdrawPollable } from './WithdrawalForm/Form/validation'
import { DepositPollable } from './DepositForm/Form/validation'
import { FormattedFeeInDefaultCurrencyWhichCanBeZero } from '@zeal/domains/Money/components/FormattedFeeInDefaultCurrencyWhichCanBeZero'

type Props = {
    knownCurrencies: KnownCurrencies
    pollable: DepositPollable | WithdrawPollable
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const TransferFeesModal = ({
    onMsg,
    pollable,
    knownCurrencies,
}: Props) => (
    <Popup.Layout onMsg={onMsg}>
        <Header
            title={
                <FormattedMessage
                    id="bank_transfers.deposit.modal.transfer-fees.title"
                    defaultMessage="Transfer fees"
                />
            }
        />

        <Column2 spacing={20}>
            <Column2 spacing={8}>
                <TotalFees
                    pollable={pollable}
                    knownCurrencies={knownCurrencies}
                />
            </Column2>

            <Column2 spacing={8}>
                <Text2 variant="paragraph" color="textPrimary">
                    <FormattedMessage
                        id="bank_transfers.deposit.modal.transfer-fees.content.monthly-limits"
                        defaultMessage="Your monthly limits"
                    />
                </Text2>

                <Divider variant="secondary" />

                <Row spacing={4}>
                    <Text2 variant="paragraph" color="textPrimary">
                        <FormattedMessage
                            id="bank_transfers.deposit.modal.transfer-fees.content.free"
                            defaultMessage="Free"
                        />
                    </Text2>
                    <Text2 variant="paragraph" color="textSecondary">
                        <FormattedMessage
                            id="bank_transfers.deposit.modal.transfer-fees.content.fee-above"
                            defaultMessage="0.2% fee above"
                        />
                    </Text2>
                    <Spacer2 />
                    <Text2 variant="paragraph" color="textPrimary">
                        <FormattedTokenBalanceInDefaultCurrency
                            knownCurrencies={knownCurrencies}
                            money={MONTHLY_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY}
                        />
                    </Text2>
                </Row>

                <Row spacing={4}>
                    <Text2 variant="paragraph" color="textPrimary">
                        <FormattedMessage
                            id="bank_transfers.deposit.modal.transfer-fees.content.max"
                            defaultMessage="Max"
                        />
                    </Text2>
                    <Spacer2 />
                    <Text2 variant="paragraph" color="textPrimary">
                        <FormattedTokenBalanceInDefaultCurrency
                            knownCurrencies={knownCurrencies}
                            money={POST_KYC_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY}
                        />
                    </Text2>
                </Row>
            </Column2>
        </Column2>
    </Popup.Layout>
)

const TotalFees = ({
    pollable,
    knownCurrencies,
}: {
    pollable: DepositPollable | WithdrawPollable
    knownCurrencies: KnownCurrencies
}) => {
    const { formatNumber } = useIntl()

    return (
        <Row spacing={4}>
            <Text2 variant="paragraph" color="textPrimary">
                <FormattedMessage
                    id="bank_transfers.deposit.modal.transfer_fees.content.total_fees"
                    defaultMessage="Total fees"
                />
            </Text2>

            <Spacer2 />

            {(() => {
                switch (pollable.type) {
                    case 'loading':
                    case 'reloading':
                        return (
                            <Skeleton
                                variant="default"
                                width={40}
                                height={16}
                            />
                        )

                    case 'loaded':
                    case 'subsequent_failed':
                        // TODO Zeal vs Partner fees now not available in the data so showing only total
                        const feeInfo = pollable.data.fee
                        return (
                            <>
                                <Text2
                                    variant="paragraph"
                                    color="textSecondary"
                                    weight="regular"
                                >
                                    {formatNumber(feeInfo.percentageFee, {
                                        style: 'percent',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2,
                                    })}
                                </Text2>

                                <Text2
                                    variant="paragraph"
                                    color="textPrimary"
                                    weight="regular"
                                >
                                    <FormattedFeeInDefaultCurrencyWhichCanBeZero
                                        knownCurrencies={knownCurrencies}
                                        money={feeInfo.amount}
                                    />
                                </Text2>
                            </>
                        )

                    case 'error':
                        return (
                            <Text2
                                variant="paragraph"
                                color="textStatusCriticalOnColor"
                                weight="regular"
                            >
                                <FormattedMessage
                                    id="bank_transfers.deposit.failed_to_load_fee"
                                    defaultMessage="Unknown"
                                />
                            </Text2>
                        )

                    /* istanbul ignore next */
                    default:
                        return notReachable(pollable)
                }
            })()}
        </Row>
    )
}
