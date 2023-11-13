import { FormattedMessage } from 'react-intl'
import { Text2 } from 'src/uikit/Text2'
import { LightDangerTriangle } from 'src/uikit/Icon/LightDangerTriangle'
import { Row } from '@zeal/uikit/Row'
import { NotEnoughBalance } from 'src/domains/TransactionRequest/helpers/validateNotEnoughBalance'
import { FormattedTokenBalances } from 'src/domains/Money/components/FormattedTokenBalances'

export const NetworkFeeLabel = () => (
    <Text2 ellipsis variant="paragraph" weight="regular" color="textPrimary">
        <FormattedMessage
            id="FeeForecastWiget.networkFee"
            defaultMessage="Network fee"
        />
    </Text2>
)

export const UnknownLabel = () => {
    return (
        <Row spacing={4}>
            <LightDangerTriangle size={20} color="iconDefault" />
            <Text2 variant="paragraph" weight="regular" color="textPrimary">
                <FormattedMessage
                    id="FeeForecastWiget.unknownFee"
                    defaultMessage="Unknown"
                />
            </Text2>
        </Row>
    )
}

export const CannotCalculateNetworkFeeLabel = () => (
    <FormattedMessage
        id="FeeForecastWiget.pollable_errored_and_user_did_not_selected_custom_preset.widget_error_message"
        defaultMessage="We couldn’t calculate network fee"
    />
)

export const NotEnoughBalanceLabel = ({
    error,
}: {
    error: NotEnoughBalance
}) => {
    const { currencies } = error.pollable.data
    const nativeCurrency = currencies[error.requiredAmount.currencyId]

    return (
        <FormattedMessage
            id="FeeForecastWiget.NotEnoughBalance.errorMessage"
            defaultMessage="Need {amount} {symbol} to submit transaction"
            values={{
                amount: (
                    <FormattedTokenBalances
                        knownCurrencies={currencies}
                        money={error.requiredAmount}
                    />
                ),
                symbol: nativeCurrency.symbol,
            }}
        />
    )
}
