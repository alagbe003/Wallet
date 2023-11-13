import { CSSProperties, ReactNode } from 'react'
import { notReachable } from '@zeal/toolkit'

type Props = {
    align: 'bottomRight'
    children: ReactNode
}

// TODO: move style to scss
export const OutOfFlow = ({ align, children }: Props) => {
    return (
        <div
            style={{
                position: 'relative',
                alignSelf: 'stretch',
            }}
        >
            <div
                style={((): CSSProperties => {
                    switch (align) {
                        case 'bottomRight':
                            return {
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                            }
                        default:
                            return notReachable(align)
                    }
                })()}
            >
                {children}
            </div>
        </div>
    )
}
