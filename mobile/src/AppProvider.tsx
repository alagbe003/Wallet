import { IntlProvider } from 'react-intl'
import { useLocales } from 'expo-localization'

type Props = {
    children: React.ReactNode
}

export const AppProvider = ({ children }: Props) => {
    const locales = useLocales()

    return (
        <IntlProvider locale={locales[0].languageCode}>{children}</IntlProvider>
    )
}
