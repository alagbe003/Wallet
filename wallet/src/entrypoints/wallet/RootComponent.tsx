import './index.css'

import { AppProvider } from './AppProvider'
import { WalletWidgetFork } from 'src/domains/Main/features/EntryPoint'
import { ErrorBoundary } from 'src/domains/Error/components/ErrorBoundary'
import { Manifest } from 'src/domains/Manifest'

type Props = {
    manifest: Manifest
}

export const RootComponent = ({ manifest }: Props) => (
    <AppProvider>
        <ErrorBoundary>
            <WalletWidgetFork manifest={manifest} />
            <div id="modal" />
        </ErrorBoundary>
    </AppProvider>
)
