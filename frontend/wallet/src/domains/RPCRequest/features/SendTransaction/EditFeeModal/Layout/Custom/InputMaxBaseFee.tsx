import { FormattedMessage } from 'react-intl'
import { notReachable } from '@zeal/toolkit'
import { Column2 } from 'src/uikit/Column2'
import { Input2 } from 'src/uikit/Input/Input2'

import { Big } from 'big.js'
import { components } from '@zeal/api/portfolio'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import {
    FloatInput,
    useFloatInputFromLiveUpstream,
} from 'src/uikit/Input/FloatInput'
import { Text2 } from 'src/uikit/Text2'
import Web3 from 'web3'
import { EditFormCustomPresetValidationError } from '../../../FeeForecastWidget/helpers/validation'

type Props = {
    error: NonNullable<EditFormCustomPresetValidationError['maxBaseFee']> | null
    networkState: components['schemas']['Eip1559NetworkState'] | null
    maxBaseFee: string
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'on_max_base_fee_change'
    maxBaseFee: string
}

export const InputMaxBaseFee = ({
    error,
    maxBaseFee,
    networkState,
    onMsg,
}: Props) => {
    const [floatString, setFloatString] = useFloatInputFromLiveUpstream({
        value: Web3.utils.fromWei(maxBaseFee, 'gwei'),
        update: (val) => {
            onMsg({
                type: 'on_max_base_fee_change',
                maxBaseFee: Web3.utils.toHex(Web3.utils.toWei(val, 'gwei')),
            })
        },
        fractionDigits: 2,
    })

    return (
        <Column2 spacing={8} data-testid="max-base-fee-input-container">
            <Text2
                id="maxBaseFeeInput"
                variant="footnote"
                weight="regular"
                color="textPrimary"
            >
                <FormattedMessage
                    id="EditFeeModa.Custom.LegacyForm.maxBaseFee.title"
                    defaultMessage="Max Base Fee"
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
                        aria-labelledby="maxBaseFeeInput"
                        variant="small"
                        placeholder="0"
                        state={error ? 'error' : 'normal'}
                        rightIcon={
                            <Text2
                                variant="caption1"
                                weight="regular"
                                color="textPrimary"
                            >
                                Gwei
                            </Text2>
                        }
                        message={
                            <Message
                                maxBaseFee={maxBaseFee}
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

const SideMessage = ({
    error,
    onMsg,
}: {
    onMsg: (msg: Msg) => void
    error: NonNullable<EditFormCustomPresetValidationError['maxBaseFee']> | null
}) => {
    if (!error) {
        return null
    }

    switch (error.type) {
        case 'pollable_failed_to_fetch':
            return null
        case 'trx_may_take_long_to_proceed_base_fee_low':
            return (
                <Tertiary
                    color="on_light"
                    size="small"
                    onClick={() =>
                        onMsg({
                            type: 'on_max_base_fee_change',
                            maxBaseFee: error.suggestedMaxBaseFee,
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

const Message = ({
    error,
    networkState,
    maxBaseFee,
}: {
    networkState: components['schemas']['Eip1559NetworkState'] | null
    error: NonNullable<EditFormCustomPresetValidationError['maxBaseFee']> | null
    maxBaseFee: string
}) => {
    if (!error) {
        if (!networkState) {
            return null
        }

        return (
            <NetworkState maxBaseFee={maxBaseFee} networkState={networkState} />
        )
    }

    switch (error.type) {
        case 'trx_may_take_long_to_proceed_base_fee_low':
            return (
                <FormattedMessage
                    id="EditFeeModal.Custom.trx_may_take_long_to_proceed_base_fee_low"
                    defaultMessage="Will get stuck until Base Fee decreases"
                />
            )

        case 'pollable_failed_to_fetch':
            return (
                <FormattedMessage
                    id="EditFeeModal.Custom.InputMaxBaseFee.pollable_failed_to_fetch"
                    defaultMessage="We couldn’t get current Base Fee"
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}

const NetworkState = ({
    maxBaseFee,
    networkState,
}: {
    maxBaseFee: string
    networkState: components['schemas']['Eip1559NetworkState']
}) => {
    const current = new Big(BigInt(maxBaseFee).toString(10))
    const network = new Big(BigInt(networkState.baseFee).toString(10))

    const buffer = current.div(network).toFixed(1)
    const currentFormatted = new Big(
        Web3.utils.fromWei(networkState.baseFee, 'gwei')
    )
        .toFixed(2)
        .replace(/\.00$/gi, '')

    return (
        <FormattedMessage
            id="EditFeeModal.Custom.InputMaxBaseFee.network_state_buffer"
            defaultMessage="Base Fee: {baseFee} • Safety buffer: {buffer}x"
            values={{
                buffer,
                baseFee: currentFormatted,
            }}
        />
    )
}
