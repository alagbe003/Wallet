import React from 'react'
import { defaultTheme } from 'src/uikit/Theme'
import { ThemeProvider } from 'styled-components'
import { IntlProvider } from 'react-intl'

type Props = {
    children: React.ReactNode
}

export const AppProvider = ({ children }: Props) => {
    return (
        <ThemeProvider theme={defaultTheme}>
            <IntlProvider locale="en">{children}</IntlProvider>
        </ThemeProvider>
    )
}
