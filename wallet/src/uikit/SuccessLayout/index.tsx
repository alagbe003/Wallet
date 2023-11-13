import React from 'react'
import { Spacer } from 'src/uikit/Space'
import { Column2 } from 'src/uikit/Column2'
import { Animation } from '@zeal/uikit/Animation'
import { notReachable } from '@zeal/toolkit'
import { Text2 } from 'src/uikit/Text2'
import { Layout2 } from 'src/uikit/Layout/Layout2'

type Props = {
    title: React.ReactNode
    onAnimationComplete: () => void
}

export const SuccessLayout = ({ title, onAnimationComplete }: Props) => {
    return (
        <Layout2 padding="main" background="light">
            <Spacer size={142} />

            <Column2 spacing={16} alignX="center">
                <Animation
                    loop={false}
                    animation="success"
                    onAnimationEvent={(event) => {
                        switch (event) {
                            case 'complete':
                                onAnimationComplete()
                                break

                            /* istanbul ignore next */
                            default:
                                return notReachable(event)
                        }
                    }}
                    size={100}
                />

                <Text2 variant="callout" weight="medium" color="textPrimary">
                    {title}
                </Text2>
            </Column2>
        </Layout2>
    )
}
