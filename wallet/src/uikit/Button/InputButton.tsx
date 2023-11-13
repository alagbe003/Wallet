import React, { ReactNode } from 'react'
import { Base } from 'src/uikit/Base'
import { Column2 } from 'src/uikit/Column2'
import { Row } from '@zeal/uikit/Row'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Text2 } from 'src/uikit/Text2'
import styled from 'styled-components'

type Props = {
    leftIcon: ReactNode
    children: ReactNode
    rightIcon: ReactNode
    disabled?: boolean
    onClick?: () => void
}

const InputBox = styled(Base)<{
    children?: React.ReactNode
}>`
    width: 100%;
    padding: 8px 12px;
    border-radius: 4px;
    transition: border-color 0.3s ease;
    justify-content: flex-start;
    align-items: center;

    border: 1px solid;
    border-color: ${({ theme }) => theme.colors.borderDefault};

    background-color: ${({ theme }) => theme.colors.surfaceDefault};
    min-width: 0;
    color: ${({ theme }) => theme.colors.textPrimary};

    &:active {
        border-color: ${({ theme }) => theme.colors.borderFocus};
    }

    &:disabled,
    &:disabled:active {
        border: 1px solid ${({ theme }) => theme.colors.borderSecondary};
        color: ${({ theme }) => theme.colors.textSecondary};
        background-color: ${({ theme }) => theme.colors.surfaceDefault};
    }
`

export const InputButton = ({
    leftIcon,
    rightIcon,
    disabled,
    children,
    onClick,
}: Props) => {
    return (
        <InputBox
            type="button"
            disabled={disabled}
            as="button"
            onClick={onClick}
        >
            <Row grow fullWidth spacing={12}>
                {leftIcon}
                <Column2 spacing={0}>
                    <Text2 ellipsis variant="paragraph" weight="regular">
                        {children}
                    </Text2>
                </Column2>
            </Row>
            <Spacer2 />
            {rightIcon}
        </InputBox>
    )
}
