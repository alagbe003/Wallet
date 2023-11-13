import { FormattedMessage } from 'react-intl'
import { notReachable } from '@zeal/toolkit'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { Column2 } from 'src/uikit/Column2'
import { Row } from '@zeal/uikit/Row'
import { Spacer2 } from 'src/uikit/Spacer2'
import { EditFormCustomPresetValidationError } from '../../../FeeForecastWidget/helpers/validation'
import { CANCEL_GAS_AMOUNT } from '@zeal/domains/Transactions/constants'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    gasLimit: string
    error: NonNullable<EditFormCustomPresetValidationError['gasLimit']> | null
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_edit_gas_limit_click' }
    | { type: 'on_fix_gas_limit'; gasLimit: string }

export const InputGasLimit = ({ error, gasLimit, onMsg }: Props) => {
    return (
        <Column2 spacing={8} data-testid="gas-limit-input-container">
            <Row spacing={4}>
                <Text2
                    variant="footnote"
                    weight="regular"
                    color="textSecondary"
                >
                    <FormattedMessage
                        id="EditFeeModal.Custom.gasLimit.title"
                        defaultMessage="Gas Limit {gasLimit}"
                        values={{
                            gasLimit: BigInt(gasLimit).toString(10),
                        }}
                    />
                </Text2>
                <Spacer2 />
                <Tertiary
                    color="on_light"
                    size="small"
                    onClick={() => onMsg({ type: 'on_edit_gas_limit_click' })}
                >
                    <FormattedMessage id="actions.edit" defaultMessage="edit" />
                </Tertiary>
            </Row>

            {error && (
                <Row spacing={8}>
                    <Text2
                        color="textError"
                        variant="caption1"
                        weight="regular"
                    >
                        <ErrorMessage error={error} />
                    </Text2>
                    <Spacer2 />
                    <Tertiary
                        color="on_light"
                        size="small"
                        onClick={() =>
                            onMsg({
                                type: 'on_fix_gas_limit',
                                gasLimit: error.suggestedGasLimit,
                            })
                        }
                    >
                        <FormattedMessage
                            id="actions.fix"
                            defaultMessage="Fix"
                        />
                    </Tertiary>
                </Row>
            )}
        </Column2>
    )
}

const ErrorMessage = ({
    error,
}: {
    error: NonNullable<EditFormCustomPresetValidationError['gasLimit']>
}) => {
    switch (error.type) {
        case 'trx_likely_to_fail':
            switch (error.reason) {
                case 'less_than_estimated_gas':
                    return (
                        <FormattedMessage
                            id="EditFeeModal.EditGasLimit.less_than_estimated_gas"
                            defaultMessage="Less than estimated limit. Transaction will fail"
                        />
                    )

                case 'less_than_suggested_gas':
                    return (
                        <FormattedMessage
                            id="EditFeeModal.EditGasLimit.less_than_suggested_gas"
                            defaultMessage="Less than suggested limit. Transaction could fail"
                        />
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(error.reason)
            }

        case 'trx_will_fail_less_then_minimum_gas':
            return (
                <FormattedMessage
                    id="EditFeeModal.EditGasLimit.trx_will_fail_less_then_minimum_gas"
                    defaultMessage="Less than minimum gas limit: {minimumLimit}"
                    values={{
                        minimumLimit: BigInt(CANCEL_GAS_AMOUNT).toString(10),
                    }}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}
