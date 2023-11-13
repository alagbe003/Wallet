import { FormattedMessage } from 'react-intl'
import { notReachable } from '@zeal/toolkit'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { Column2 } from 'src/uikit/Column2'
import { Row } from '@zeal/uikit/Row'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Text2 } from 'src/uikit/Text2'

import { EditFormCustomPresetValidationError } from '../../../FeeForecastWidget/helpers/validation'

type Props = {
    nonce: number
    simulatedNonce: number
    error: NonNullable<EditFormCustomPresetValidationError['nonce']> | null
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_edit_nonce_click' }
    | { type: 'on_fix_nonce_click'; nonce: number }

export const InputNonce = ({ nonce, simulatedNonce, error, onMsg }: Props) => (
    <Column2 spacing={8} data-testid="nonce-input-container">
        <Row spacing={4}>
            <Text2 variant="footnote" weight="regular" color="textSecondary">
                <FormattedMessage
                    id="EditFeeModal.Custom.InputNonce.nonce"
                    defaultMessage="Nonce {nonce}"
                    values={{ nonce }}
                />
            </Text2>

            <Spacer2 />

            <Tertiary
                color="on_light"
                size="small"
                onClick={() => onMsg({ type: 'on_edit_nonce_click' })}
            >
                <FormattedMessage id="actions.edit" defaultMessage="edit" />
            </Tertiary>
        </Row>

        {error && (
            <Row spacing={8}>
                <Text2 color="textError" variant="caption1" weight="regular">
                    <ErrorMessage error={error} />
                </Text2>
                <Spacer2 />
                <Tertiary
                    color="on_light"
                    size="small"
                    onClick={() =>
                        onMsg({
                            type: 'on_fix_nonce_click',
                            nonce: simulatedNonce,
                        })
                    }
                >
                    <FormattedMessage id="actions.fix" defaultMessage="Fix" />
                </Tertiary>
            </Row>
        )}
    </Column2>
)

const ErrorMessage = ({
    error,
}: {
    error: NonNullable<EditFormCustomPresetValidationError['nonce']>
}) => {
    switch (error.type) {
        case 'nonce_range_error_bigger_than_current':
            return (
                <FormattedMessage
                    id="EditFeeModal.Custom.InputNonce.bigger_than_current"
                    defaultMessage="Higher than next Nonce. Will get stuck"
                />
            )
        case 'nonce_range_error_less_than_current':
            return (
                <FormattedMessage
                    id="EditFeeModal.Custom.InputNonce.less_than_current"
                    defaultMessage="Can’t set nonce lower than current nonce"
                />
            )

        default:
            return notReachable(error)
    }
}
