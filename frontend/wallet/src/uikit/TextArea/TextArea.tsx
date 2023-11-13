import { ComponentProps, useLayoutEffect, useRef } from 'react'
import { notReachable } from '@zeal/toolkit'
import { Column2 } from 'src/uikit/Column2'
import { Row } from '@zeal/uikit/Row'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Text2 } from 'src/uikit/Text2'
import styles from './index.module.scss'

type Extractor<S extends string, T extends string> = S extends `${T}_${infer R}`
    ? R
    : never

type State = Extractor<keyof typeof styles, 'State'>

type Type = 'text' | 'password'

type Props = {
    value: string
    state: State
    readOnly?: boolean
    autoHeight: boolean
    message?: React.ReactNode
    sideMessage?: React.ReactNode
    autoFocus?: boolean
    placeholder: string

    type: Type

    onChange: (value: string) => void
}

const messageColor = (
    state: State
): NonNullable<ComponentProps<typeof Text2>['color']> => {
    switch (state) {
        case 'normal':
            return 'textSecondary'

        case 'error':
            return 'textError'

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}

export const TextArea = ({
    value,
    state,
    readOnly = false,
    autoHeight,
    onChange,
    message,
    sideMessage,
    placeholder,
    autoFocus,
    type,
}: Props) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const containerClasses = [
        styles.Box,
        styles[`State_${state}`],
        (() => {
            switch (type) {
                case 'text':
                    return ''
                case 'password':
                    return styles.Password

                default:
                    notReachable(type)
            }
        })(),
    ]
        .join(' ')
        .trim()

    useLayoutEffect(() => {
        if (autoHeight && textareaRef.current) {
            const element = textareaRef.current
            element.style.height = '0px'
            const scrollHeight = element.scrollHeight
            element.style.height = scrollHeight + 'px'
        }
    }, [autoHeight, type, value]) // Type change may trigger height change

    useLayoutEffect(() => {
        if (autoFocus && textareaRef.current) {
            const element = textareaRef.current
            element.selectionStart = element.value.length
        }
    }, [autoFocus, textareaRef])

    return (
        <Column2 spacing={8}>
            <div className={containerClasses}>
                <textarea
                    autoFocus={autoFocus}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    ref={textareaRef}
                    className={styles.Textarea}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
            {(message || sideMessage) && (
                <Row spacing={8}>
                    {message && (
                        <Text2
                            ellipsis
                            color={messageColor(state)}
                            variant="caption1"
                            weight="regular"
                        >
                            {message}
                        </Text2>
                    )}
                    {sideMessage && (
                        <>
                            <Spacer2 />
                            <Text2
                                ellipsis
                                color="textSecondary"
                                variant="caption1"
                                weight="regular"
                            >
                                {sideMessage}
                            </Text2>
                        </>
                    )}
                </Row>
            )}
        </Column2>
    )
}
