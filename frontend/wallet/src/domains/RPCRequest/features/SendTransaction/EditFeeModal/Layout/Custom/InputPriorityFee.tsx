import { Big } from 'big.js'
import { FormattedMessage } from 'react-intl'
import { components } from '@zeal/api/portfolio'
import { notReachable } from '@zeal/toolkit'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { Column2 } from 'src/uikit/Column2'
import {
    FloatInput,
    useFloatInputFromLiveUpstream,
} from 'src/uikit/Input/FloatInput'
import { Input2 } from 'src/uikit/Input/Input2'
import { Text2 } from 'src/uikit/Text2'
import Web3 from 'web3'
import { EditFormCustomPresetValidationError } from '../../../FeeForecastWidget/helpers/validation'
import { useReadableDuration } from 'src/toolkit/Date/useReadableDuration'

type Props = {
    error: NonNullable<
        EditFormCustomPresetValidationError['priorityFee']
    > | null
    maxPriorityFee: string
    networkState: components['schemas']['Eip1559NetworkState'] | null
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'on_max_priority_fee_change'
    maxPriorityFee: string
}

export const InputPriorityFee = ({
    error,
    maxPriorityFee,
    networkState,
    onMsg,
}: Props) => {
    const [floatString, setFloatString] = useFloatInputFromLiveUpstream({
        value: Web3.utils.fromWei(maxPriorityFee, 'gwei'),
        update: (val) => {
            onMsg({
                type: 'on_max_priority_fee_change',
                maxPriorityFee: Web3.utils.toHex(Web3.utils.toWei(val, 'gwei')),
            })
        },
        fractionDigits: 2,
    })

    return (
        <Column2 spacing={8} data-testid="priority-fee-input-container">
            <Text2
                id="maxPriorityFeeInput"
                variant="footnote"
                weight="regular"
                color="textPrimary"
            >
                <FormattedMessage
                    id="EditFeeModa.Custom.Eip1559Form.maxPriorityFee.title"
                    defaultMessage="Priority Fee"
                />
            </Text2>

            <FloatInput
                prefix=""
                value={floatString}
                fraction={2}
                onChange={setFloatString}
            >
                {({ onChange, value }) => (
                    <Input2
                        aria-labelledby="maxPriorityFeeInput"
                        variant="small"
                        placeholder="0"
                        rightIcon={
                            <Text2
                                variant="caption1"
                                weight="regular"
                                color="textPrimary"
                            >
                                Gwei
                            </Text2>
                        }
                        state={error ? 'error' : 'normal'}
                        message={
                            <Message
                                networkState={networkState}
                                error={error}
                            />
                        }
                        sideMessage={
                            <SideMessage error={error} onMsg={onMsg} />
                        }
                        value={value}
                        onChange={onChange}
                    />
                )}
            </FloatInput>
        </Column2>
    )
}

const NetworkStateMessage = ({
    networkState,
}: {
    networkState: components['schemas']['Eip1559NetworkState']
}) => {
    const formatHumanReadableDuration = useReadableDuration()

    return (
        <FormattedMessage
            id="EditFeeModa.Custom.Eip1559Form.priorityFeeNetworkState"
            defaultMessage="Last {period}: between {from} and {to}"
            values={{
                period: formatHumanReadableDuration(networkState.durationMs),
                from: formatGWei(networkState.minPriorityFee),
                to: formatGWei(networkState.maxPriorityFee),
            }}
        />
    )
}

const SideMessage = ({
    error,
    onMsg,
}: {
    error: NonNullable<
        EditFormCustomPresetValidationError['priorityFee']
    > | null
    onMsg: (msg: Msg) => void
}) => {
    if (!error) {
        return null
    }

    switch (error.type) {
        case 'pollable_failed_to_fetch':
            return null
        case 'trx_may_take_long_to_proceed_priority_fee_low':
            return (
                <Tertiary
                    color="on_light"
                    size="small"
                    onClick={() =>
                        onMsg({
                            type: 'on_max_priority_fee_change',
                            maxPriorityFee: error.suggestedPriorityFee,
                        })
                    }
                >
                    <FormattedMessage id="actions.fix" defaultMessage="Fix" />
                </Tertiary>
            )
        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}

const formatGWei = (hex: string) => {
    const gwei = Web3.utils.fromWei(hex, 'gwei')
    return Big(gwei).toFixed(2).replace(/\.00$/gi, '')
}

const Message = ({
    error,
    networkState,
}: {
    networkState: components['schemas']['Eip1559NetworkState'] | null
    error: NonNullable<
        EditFormCustomPresetValidationError['priorityFee']
    > | null
}) => {
    if (!error) {
        if (!networkState) {
            return null
        }

        return <NetworkStateMessage networkState={networkState} />
    }

    switch (error.type) {
        case 'trx_may_take_long_to_proceed_priority_fee_low':
            return (
                <FormattedMessage
                    id="EditFeeModal.Custom.trx_may_take_long_to_proceed_priority_fee_low"
                    defaultMessage="Low fee. Might get stuck"
                />
            )

        case 'pollable_failed_to_fetch':
            return (
                <FormattedMessage
                    id="EditFeeModal.Custom.InputPriorityFee.pollable_failed_to_fetch"
                    defaultMessage="We couldn’t calculate Priority Fee"
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}
