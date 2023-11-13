import styled from 'styled-components'
import isPropValid from '@emotion/is-prop-valid'

import { keys } from '@zeal/toolkit/Object'
import React, { ComponentPropsWithRef, forwardRef, HTMLAttributes } from 'react'
import { color, ColorProps } from 'styled-system'

const PropGuard = forwardRef((props: HTMLAttributes<HTMLDivElement>, ref) => {
    const filteredProps = keys(props)
        .filter((prop) => isPropValid(prop as string))
        .reduce((newProps, key) => {
            newProps[key] = props[key]
            return newProps
        }, {} as any)

    return <div ref={ref} {...filteredProps} />
})

type Props = ComponentPropsWithRef<typeof PropGuard> &
    ColorProps & { 'aria-label'?: HTMLAttributes<HTMLDivElement>['aria-label'] }

export const Base = styled(PropGuard)<Props>`
    display: flex;
    box-sizing: border-box;

    font-family: inherit;

    font-size: inherit;
    color: inherit;

    font-weight: inherit;

    text-decoration: none;
    font-style: inherit;

    border: none;
    padding: 0;

    ${color}
`
