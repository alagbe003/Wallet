import { Column2 } from 'src/uikit/Column2'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Spinner } from 'src/uikit/Spinner'

type Props = {
    actionBar: React.ReactNode
}

export const LoadingLayout = ({ actionBar }: Props) => (
    <Layout2 background="light" padding="form">
        {actionBar}

        <Spacer2 />

        <Column2 alignX="center" spacing={0}>
            <Spinner size={72} color="iconStatusNeutral" />
        </Column2>

        <Spacer2 />
    </Layout2>
)
