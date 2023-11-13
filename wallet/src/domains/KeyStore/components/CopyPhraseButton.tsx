import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { noop, notReachable } from '@zeal/toolkit'
import { useCopyTextToClipboard } from '@zeal/toolkit/Clipboard/hooks/useCopyTextToClipboard'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { Copy } from 'src/uikit/Icon/Actions/Copy'
import { TickSquare } from 'src/uikit/Icon/TickSquare'

type Props = {
    decryptedPhrase: string
}

export const CopyPhraseButton = ({ decryptedPhrase }: Props) => {
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

            /* istanbul ignore next */
            default:
                notReachable(state)
        }
    }, [state])

    switch (state.type) {
        case 'not_asked':
            return (
                <Tertiary
                    color="on_light"
                    size="small"
                    onClick={() => {
                        setState({
                            type: 'loading',
                            params: { stringToCopy: decryptedPhrase },
                        })
                    }}
                >
                    <Copy size={14} />
                    <FormattedMessage
                        id="CopyKeyButton.copyYourPhrase"
                        defaultMessage="Copy your phrase"
                    />
                </Tertiary>
            )
        case 'loading':
            return (
                <Tertiary color="on_light" size="small" onClick={noop}>
                    <Copy size={14} />
                    <FormattedMessage
                        id="CopyKeyButton.copyYourPhrase"
                        defaultMessage="Copy your phrase"
                    />
                </Tertiary>
            )
        case 'error':
            return null

        case 'loaded':
            return (
                <Tertiary color="on_light" size="small">
                    <TickSquare color="iconAccent1" size={14} />
                    <FormattedMessage
                        id="CopyKeyButton.copied"
                        defaultMessage="Copied"
                    />
                </Tertiary>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
