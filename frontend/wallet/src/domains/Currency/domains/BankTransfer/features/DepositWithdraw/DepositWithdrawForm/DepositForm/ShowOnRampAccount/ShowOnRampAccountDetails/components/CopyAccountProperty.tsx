import { useCopyTextToClipboard } from '@zeal/toolkit/Clipboard/hooks/useCopyTextToClipboard'
import { notReachable } from '@zeal/toolkit'
import { Row } from '@zeal/uikit/Row'
import { Text2 } from 'src/uikit/Text2'
import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { Copy } from 'src/uikit/Icon/Actions/Copy'
import { IconButton } from 'src/uikit'
import { FormattedMessage } from 'react-intl'
import { TickSquare } from 'src/uikit/Icon/TickSquare'
import { captureError } from '@zeal/domains/Error/helpers/captureError'

type Props = {
    'aria-labelledby'?: string
    text: string
}

export const CopyAccountProperty = ({
    text,
    'aria-labelledby': ariaLabeledBy,
}: Props) => {
    const { formatMessage } = useIntl()
    const [state, setState] = useCopyTextToClipboard()

    useEffect(() => {
        switch (state.type) {
            case 'loaded':
            case 'not_asked':
            case 'loading':
                break

            case 'error':
                captureError(state.error)
                break
            default:
                notReachable(state)
        }
    }, [state])

    switch (state.type) {
        case 'not_asked':
            return (
                <Row spacing={4} aria-labelledby={ariaLabeledBy}>
                    <Text2
                        variant="paragraph"
                        color="textPrimary"
                        weight="medium"
                    >
                        {text}
                    </Text2>
                    <IconButton
                        aria-label={formatMessage({
                            id: 'bank_transfers.deposit.copy',
                            defaultMessage: 'Copy',
                        })}
                        onClick={() =>
                            setState({
                                type: 'loading',
                                params: { stringToCopy: text },
                            })
                        }
                    >
                        <Copy size={14} color="textPrimary" />
                    </IconButton>
                </Row>
            )
        case 'loading':
            return (
                <Row spacing={4}>
                    <Text2
                        variant="paragraph"
                        color="textPrimary"
                        weight="medium"
                    >
                        {text}
                    </Text2>
                    <Copy size={14} color="textPrimary" />
                </Row>
            )
        case 'loaded':
            return (
                <Row spacing={4}>
                    <Text2
                        variant="paragraph"
                        color="textPrimary"
                        weight="medium"
                    >
                        <FormattedMessage
                            id="bank_transfers.deposit.account-property-copied"
                            defaultMessage="Copied"
                        />
                    </Text2>
                    <TickSquare color="iconAccent1" size={14} />
                </Row>
            )
        case 'error':
            return null
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
