import { noop } from '@zeal/toolkit'
import { Column2 } from 'src/uikit/Column2'
import { Row } from '@zeal/uikit/Row'
import styles from './index.module.scss'
import React, { useState } from 'react'
import { Spacer2 } from 'src/uikit/Spacer2'
import { v4 as uuid } from 'uuid'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    errored?: boolean

    right: React.ReactNode
    left: React.ReactNode

    message?: React.ReactNode
    sideMessage?: React.ReactNode
    ctaButton?: React.ReactNode
} & (
    | {
          disabled?: false
          onClick: () => void
      }
    | { disabled: true }
)

export const FeeInputButton = (props: Props) => {
    const { right, left } = props
    const [labelId] = useState(uuid())
    const [descriptionId] = useState(uuid())

    const buttonClassname = [
        styles.Button,
        props.errored ? styles.ButtonError : null,
        props.disabled ? styles.ButtonDisabled : null,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <Column2 spacing={8}>
            <div
                aria-labelledby={labelId}
                aria-describedby={descriptionId}
                className={buttonClassname}
                role={props.disabled ? undefined : 'button'}
                onClick={props.disabled ? noop : props.onClick}
            >
                <Row spacing={4}>
                    <Row id={labelId} spacing={4}>
                        {left}
                    </Row>
                    <Spacer2 />
                    <Row id={descriptionId} spacing={12}>
                        {right}
                    </Row>
                </Row>
            </div>

            <Row spacing={4}>
                {props.message && (
                    <Text2
                        variant="caption1"
                        weight="regular"
                        color={props.errored ? 'textError' : 'textSecondary'}
                    >
                        {props.message}
                    </Text2>
                )}
                {props.ctaButton && (
                    <>
                        <Spacer2 />
                        {props.ctaButton}
                    </>
                )}
            </Row>
        </Column2>
    )
}
