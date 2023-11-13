import React from 'react'
import { Row } from '@zeal/uikit/Row'

type Props = {
    children: React.ReactNode
}

export const Actions = ({ children }: Props) => (
    <Row spacing={8} alignX="center">
        {children}
    </Row>
)
