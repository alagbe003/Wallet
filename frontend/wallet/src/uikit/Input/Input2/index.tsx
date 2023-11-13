import React, { ChangeEvent, ComponentProps } from 'react'
import { notReachable } from '@zeal/toolkit'
import { Column2 } from 'src/uikit/Column2'
import { Row } from '@zeal/uikit/Row'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Text2 } from 'src/uikit/Text2'

import styles from './index.module.scss'

type Props = {
    variant: 'regular' | 'large' | 'small'
    type?: 'password' | 'text'
    autoFocus?: boolean
    spellCheck?: boolean
    value: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void

    state: State
    message?: React.ReactNode
    sideMessage?: React.ReactNode
    rightIcon?: React.ReactNode
    leftIcon?: React.ReactNode

    placeholder: string

    onFocus?: () => void
    onBlur?: () => void

    'aria-labelledby'?: string
    'aria-label'?: string

    children?: React.ReactNode
    disabled?: boolean
}

type State = 'normal' | 'error'

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

const getAriaInvalid = (state: State): boolean => {
    switch (state) {
        case 'normal':
            return false

        case 'error':
            return true

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}

export const Input2 = ({
    type,
    value,
    autoFocus,
    placeholder,
    onChange,
    onBlur,
    onFocus,
    message,
    sideMessage,
    state,
    variant,
    rightIcon,
    leftIcon,
    'aria-labelledby': ariaLabelledBy,
    'aria-label': ariaLabel,
    disabled,
    spellCheck,
}: Props) => {
    const inputBoxClassName = [
        styles.InputBox,
        styles[`State_${state}`],
        styles[`Variant_${variant}`],
    ]
        .filter(Boolean)
        .join(' ')

    const HTMLInputClassName = [styles.HTMLInput].filter(Boolean).join(' ')

    return (
        <Column2 style={{ flex: '0 0 auto' }} spacing={8}>
            <div className={inputBoxClassName}>
                {leftIcon}
                <input
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledBy}
                    aria-invalid={getAriaInvalid(state)}
                    className={HTMLInputClassName}
                    type={type}
                    value={value}
                    autoFocus={autoFocus}
                    onChange={onChange}
                    placeholder={placeholder}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    disabled={disabled}
                    spellCheck={spellCheck}
                />
                {rightIcon}
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
