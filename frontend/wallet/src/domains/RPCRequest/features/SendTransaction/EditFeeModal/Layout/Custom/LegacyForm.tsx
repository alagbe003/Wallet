import { components } from '@zeal/api/portfolio'
import { Column2 } from 'src/uikit/Column2'
import { EditFormCustomPresetValidationError } from '../../../FeeForecastWidget/helpers/validation'

import { InputNonce, Msg as InputNonceMsg } from './InputNonce'
import { InputGasLimit, Msg as InputGasLimitMsg } from './InputGasLimit'
import { InputGasPrice } from './InputGasPrice'

type Props = {
    gasLimit: string
    nonce: number
    simulatedNonce: number
    fee: components['schemas']['LegacyCustomPresetRequestFee']
    validationData: EditFormCustomPresetValidationError
    onMsg: (msg: Msg) => void
}

type Msg =
    | {
          type: 'on_gas_price_change'
          gasPrice: string
      }
    | { type: 'on_edit_gas_limit_click' }
    | InputNonceMsg
    | InputGasLimitMsg

export const LegacyForm = ({
    fee,
    onMsg,
    gasLimit,
    nonce,
    simulatedNonce,
    validationData,
}: Props) => {
    return (
        <Column2 spacing={24}>
            <InputGasPrice
                error={validationData.gasPrice || null}
                gasPrice={fee.gasPrice}
                onMsg={onMsg}
            />

            <Column2 spacing={8}>
                <InputGasLimit
                    gasLimit={gasLimit}
                    onMsg={onMsg}
                    error={validationData.gasLimit || null}
                />

                <InputNonce
                    simulatedNonce={simulatedNonce}
                    nonce={nonce}
                    onMsg={onMsg}
                    error={validationData.nonce || null}
                />
            </Column2>
        </Column2>
    )
}
