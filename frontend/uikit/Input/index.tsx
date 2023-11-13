import React, { ComponentProps, useState } from 'react'
import { notReachable } from '@zeal/toolkit'
import { Row } from '@zeal/uikit/Row'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text, styles as textStyles } from '@zeal/uikit/Text'
import {
    NativeSyntheticEvent,
    StyleSheet,
    TextInput,
    TextInputSubmitEditingEventData,
    View,
} from 'react-native'
import { colors } from '@zeal/uikit/colors'

const styles = StyleSheet.create({
    inputWrapper: {
        flexDirection: 'row',
        width: '100%',
        borderWidth: 1,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        backgroundColor: colors.surfaceDefault,
        flexGrow: 0,
        flexShrink: 0,
        rowGap: 8,
    },

    input: {
        flex: 1,
        width: '100%',
        textAlign: 'left',
        outlineStyle: 'none',
        height: 24,
        color: colors.textPrimary,
        placeholderTextColor: colors.textSecondary,
        fontWeight: '400',
    },

    inputDisabled: {
        color: colors.textDisabled,
        cursor: 'default',
    },

    State_normal: {
        borderColor: colors.borderSecondary,
    },

    State_focus: {
        borderColor: colors.borderFocus,
    },

    State_error: {
        borderColor: colors.borderError,
    },

    Variant_small: {
        paddingVertical: 3,
        paddingHorizontal: 12,
    },

    Variant_regular: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },

    Variant_large: {
        padding: 12,
    },
})

type Variant = 'regular' | 'large' | 'small'
type Props = {
    variant: Variant
    type?: 'password' | 'text'
    autoFocus?: boolean
    spellCheck?: boolean
    value: string
    onChange: (text: string) => void
    onSubmitEditing: (
        e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
    ) => void

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
): NonNullable<ComponentProps<typeof Text>['color']> => {
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

const variantToTypographyStyle = (variant: Variant) => {
    switch (variant) {
        case 'small':
            return textStyles.variant_footnote
        case 'regular':
            return textStyles.variant_paragraph
        case 'large':
            return textStyles.variant_callout

        /* istanbul ignore next */
        default:
            notReachable(variant)
    }
}

export const Input = ({
    type,
    value,
    autoFocus,
    placeholder,
    onChange,
    onBlur,
    onFocus,
    message,
    sideMessage,
    onSubmitEditing,
    state,
    variant,
    rightIcon,
    leftIcon,
    'aria-labelledby': ariaLabelledBy,
    'aria-label': ariaLabel,
    disabled,
    spellCheck,
}: Props) => {
    const [isFocused, setFocused] = useState(false)

    const inputWrapperStyles = [
        styles.inputWrapper,
        styles[
            `State_${
                isFocused && state !== 'error' && !disabled ? 'focus' : state
            }`
        ],
        styles[`Variant_${variant}`],
    ]

    const inputStyles = [
        styles.input,
        variantToTypographyStyle(variant),
        disabled && styles.inputDisabled,
    ]

    return (
        <>
            <View style={inputWrapperStyles}>
                {leftIcon}
                <TextInput
                    style={inputStyles}
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledBy}
                    aria-invalid={getAriaInvalid(state)}
                    secureTextEntry={type === 'password'}
                    value={value}
                    autoFocus={autoFocus}
                    onSubmitEditing={onSubmitEditing}
                    onChangeText={onChange}
                    placeholder={placeholder}
                    onFocus={() => {
                        setFocused(true)
                        onFocus && onFocus()
                    }}
                    onBlur={() => {
                        setFocused(false)
                        onBlur && onBlur()
                    }}
                    editable={!disabled}
                    spellCheck={spellCheck}
                />
                {rightIcon}
            </View>
            {(message || sideMessage) && (
                <Row spacing={8}>
                    {message && (
                        <Text
                            ellipsis
                            color={messageColor(state)}
                            variant="caption1"
                            weight="regular"
                        >
                            {message}
                        </Text>
                    )}
                    {sideMessage && (
                        <>
                            <Spacer />
                            <Text
                                ellipsis
                                color="textSecondary"
                                variant="caption1"
                                weight="regular"
                            >
                                {sideMessage}
                            </Text>
                        </>
                    )}
                </Row>
            )}
        </>
    )
}
