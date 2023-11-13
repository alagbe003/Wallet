import { ReactNode } from 'react'
import { notReachable } from '@zeal/toolkit'
import { Base } from 'src/uikit/Base'
import { Row } from '@zeal/uikit/Row'
import styled, { css } from 'styled-components'

type Props = {
    variant: Variant
    icon: ReactNode
    children: NonNullable<ReactNode>
}

type Variant = 'outline' | 'filled'

const variant = ({ variant }: Props) => {
    switch (variant) {
        case 'outline':
            return css`
                border: 1px solid ${({ theme }) => theme.colors.borderDefault};
            `

        case 'filled':
            return css`
                background-color: ${({ theme }) =>
                    theme.colors.backgroundLight};
            `

        /* istanbul ignore next */
        default:
            return notReachable(variant)
    }
}

const BannerBase = styled(Base)<Props>`
    border-radius: 5px;
    padding: 8px;
    ${variant};
`

const Content = styled(Base)`
    flex-grow: 1;
`
/**
 * https://www.figma.com/file/AKHnmQ1MGgjwEMkaAgC7iA/Zeal---Design-System?node-id=3748%3A96290
 */
export const Banner = (props: Props) => {
    return (
        <BannerBase {...props}>
            <Row alignY="start" grow spacing={8}>
                {props.icon && <Base>{props.icon}</Base>}

                <Content>{props.children}</Content>
            </Row>
        </BannerBase>
    )
}
