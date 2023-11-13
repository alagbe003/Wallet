import { ReactNode } from 'react'
import { Column2 } from 'src/uikit/Column2'
import { CompressableContainer } from '@zeal/uikit/CompressableContainer'

type Props = {
    children: ReactNode
}

export const Container = ({ children }: Props) => {
    return (
        <CompressableContainer variant="uncompressed">
            <Column2 spacing={30}>{children}</Column2>
        </CompressableContainer>
    )
}
