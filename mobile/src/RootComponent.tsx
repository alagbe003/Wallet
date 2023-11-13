import { App } from './App'
import { AppProvider } from './AppProvider'

export const RootComponent = () => {
    return (
        <AppProvider>
            <App />
        </AppProvider>
    )
}
