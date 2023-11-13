import React, { useRef, useState } from 'react'
import { Rifm } from 'rifm'

type Props = {
    value: string | null
    prefix: string
    fraction: number
    onChange: (value: string | null) => void
    children: (args: RifmRenderArgs) => React.ReactNode
}

interface RifmRenderArgs<E = HTMLInputElement | HTMLTextAreaElement> {
    value: string
    onChange: React.ChangeEventHandler<E>
}

const numberAccept = /[\d.]+/g
const SEPARATOR = '.'
const parseNumber = (string: string): string =>
    (string.match(numberAccept) || []).join('')

const formatFloatingPointNumber = (
    value: string,
    maxDigits: number,
    prefix: string
): string => {
    /**
     * this is to allow input starting with .
     * firm try to assume that . and 0 is valid input from user and struggle to figure out diff and where to put cursor,
     * so we add 0 and then in onChange force cursor move to the end
     */
    if (value === '.') {
        return '0.'
    }

    /**
     * the way rifm work makes it hard to use ',' separator as well
     * eg you have 100 -> type 0 in the end -> format called and return '1,000' using itl;
     * then you type ',' in the end as separator; you get 1,000, to format function ->
     * you will need to understand which ',' is formatted and which is separator ','
     */
    const parsed = parseNumber(value)
    const [head, tail] = parsed.split(SEPARATOR)
    /**
     *  don't allow to overflow head part
     *  :: ??? ::
     *  not sure if this acceptable to limit main part.
     *  some tokens have fraction = 2, this creates opportunity to have big int in main part;
     *  but locale format number allows only number as fractional formatting;
     *  to allow big int we will need to format big it first and then format fraction by our selfs
     *  eg: 100.1,0 vs 100,1.0
     *
     */
    const trimmedHead = head.slice(0, 15)
    // Avoid rounding errors at toLocaleString as when user enters 1.239 and maxDigits=2 we
    // must not to convert it to 1.24, it must stay 1.23
    const scaledTail = tail != null ? tail.slice(0, maxDigits) : ''

    const number = Number.parseFloat(`${trimmedHead}.${scaledTail}`)

    if (Number.isNaN(number)) {
        return ''
    }

    const formatted = number.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: maxDigits,
    })

    if (parsed.includes(SEPARATOR)) {
        const [formattedHead] = formatted.split(SEPARATOR)

        // skip zero at digits position for non fixed floats
        // as at digits 2 for non fixed floats numbers like 1.50 has no sense, just 1.5 allowed
        // but 1.0 has sense as otherwise you will not be able to enter 1.05 for example
        const formattedTail =
            scaledTail !== '' && scaledTail[maxDigits - 1] === '0'
                ? scaledTail.slice(0, -1)
                : scaledTail

        return `${prefix}${formattedHead}.${formattedTail}`
    }
    return `${prefix}${formatted}`
}

export const FloatInput = ({
    value,
    prefix,
    onChange,
    fraction,
    children,
}: Props) => {
    const formattedValue = value || ''

    const ref = useRef<EventTarget & (HTMLInputElement | HTMLTextAreaElement)>()

    const overwriteChildren: (args: RifmRenderArgs) => React.ReactNode = ({
        value,
        onChange,
    }) => {
        return children({
            value,
            onChange: (e) => {
                ref.current = e.target
                onChange(e)
            },
        })
    }

    return (
        <Rifm
            accept={numberAccept}
            format={(string) => {
                return formatFloatingPointNumber(string, fraction, prefix)
            }}
            value={formattedValue}
            onChange={(s) => {
                if (s === '') {
                    onChange(null)
                    return
                }
                if (s === '0.' && ref.current) {
                    // rifm rerender input after onChange
                    setTimeout(() => {
                        if (ref.current) {
                            ref.current.setSelectionRange(s.length, s.length)
                        }
                    }, 0)
                }

                onChange(parseNumber(s))
            }}
        >
            {overwriteChildren}
        </Rifm>
    )
}

// TODO: @max Remove this
export const useFloatInputFromLiveUpstream = ({
    value: upstreamValue,
    update: setUpstreamValue,
    fractionDigits,
}: {
    value: string
    update: (value: string) => void
    fractionDigits: number
}): [string | null, (_: string | null) => void] => {
    const [floatValue, setFloatValue] = useState<string | null>(upstreamValue)

    const onChange = (value: string | null) => {
        setFloatValue((prev) => {
            if (value === null) {
                setUpstreamValue('0')
            } else if (
                prev === null ||
                !sameFloat(prev, value, fractionDigits)
            ) {
                setUpstreamValue(value)
            }

            return value
        })
    }

    const actualValue =
        (floatValue === null && upstreamValue === '0') ||
        (floatValue !== null &&
            sameFloat(floatValue, upstreamValue, fractionDigits))
            ? floatValue
            : upstreamValue

    return [actualValue, onChange]
}

const sameFloat = (a: string, b: string, fractionDigits?: number) => {
    return (
        parseFloat(a).toFixed(fractionDigits) ===
        parseFloat(b).toFixed(fractionDigits)
    )
}
