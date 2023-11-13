import { Address } from '@zeal/domains/Address'
import { ComponentPropsWithoutRef, useEffect } from 'react'
import { noop, notReachable } from '@zeal/toolkit'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { format } from '@zeal/domains/Address/helpers/format'
import { Copy } from 'src/uikit/Icon/Actions/Copy'
import { TickSquare } from 'src/uikit/Icon/TickSquare'
import { useCopyTextToClipboard } from '@zeal/toolkit/Clipboard/hooks/useCopyTextToClipboard'
import { captureError } from '@zeal/domains/Error/helpers/captureError'

type Props = {
    size: ComponentPropsWithoutRef<typeof Tertiary>['size']
    color: 'on_dark' | 'on_light'
    address: Address
}

export const CopyAddress = ({ size, address, color }: Props) => {
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
                <Tertiary
                    color={color}
                    size={size}
                    onClick={(e) => {
                        e.stopPropagation()
                        setState({
                            type: 'loading',
                            params: { stringToCopy: address },
                        })
                    }}
                >
                    {format(address)}
                    <Copy size={14} />
                </Tertiary>
            )
        case 'loading':
            return (
                <Tertiary color={color} size={size} onClick={noop}>
                    {format(address)}
                    <Copy size={14} />
                </Tertiary>
            )
        case 'error':
            return null

        case 'loaded':
            return (
                <Tertiary color={color} size={size}>
                    {format(address)}
                    <TickSquare color="iconAccent1" size={14} />
                </Tertiary>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
