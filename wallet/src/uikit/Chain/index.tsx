import React, { Children } from 'react'
import { Text } from '@zeal/uikit/Text'

type Props = {
    children: React.ReactNode
}

const content = ' · '

export const Chain = ({ children }: Props) => {
    return (
        <Text>
            {intersperse(Children.toArray(children), <Text>{content}</Text>)}
        </Text>
    )
}

const intersperse = <T,>(arr: T[], sep: T) =>
    arr.reduce((a, v) => [...a, v, sep], [] as T[]).slice(0, -1)
