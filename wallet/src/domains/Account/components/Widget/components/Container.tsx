import { ReactNode } from 'react'
import { Column } from '@zeal/uikit/Column'
import { CompressableContainer } from '@zeal/uikit/CompressableContainer'

type Props = {
    children: ReactNode
}

export const Container = ({ children }: Props) => {
    return (
        <CompressableContainer variant="uncompressed">
            <Column spacing={30}>{children}</Column>
        </CompressableContainer>
    )
}
