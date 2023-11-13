import 'styled-components'

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            // primary: string

            transparent: string

            textPrimary: string
            textOnDarkPrimary: string
            textSecondary: string
            textDisabled: string

            textOnPrimary: string
            textOnSecondary: string
            textOnGhost: string
            textOnTertiary: string

            textOnDark: string
            textError: string

            textStatusCritical: string
            textStatusCriticalHover: string
            textStatusCriticalPressed: string
            textStatusCriticalDisabled: string

            textStatusCriticalOnColor: string
            textStatusCriticalOnColorHover: string
            textStatusCriticalOnColorPressed: string
            textStatusCriticalOnColorDisabled: string

            textStatusWarning: string
            textStatusWarningHover: string
            textStatusWarningPressed: string
            textStatusWarningDisabled: string

            textStatusWarningOnColor: string
            textStatusWarningOnColorHover: string
            textStatusWarningOnColorPressed: string
            textStatusWarningOnColorDisabled: string

            textStatusSuccess: string
            textStatusSuccessHover: string
            textStatusSuccessPressed: string
            textStatusSuccessDisabled: string

            textStatusSuccessOnColor: string
            textStatusSuccessOnColorHover: string
            textStatusSuccessOnColorPressed: string
            textStatusSuccessOnColorDisabled: string

            textStatusNeutralOnColor: string
            textStatusNeutralOnColorHover: string
            textStatusNeutralOnColorPressed: string
            textStatusNeutralOnColorDisabled: string

            // supporting / status
            error: string
            warning: string
            success: string

            statusNeutral: string
            statusCritical: string
            statusSuccess: string
            statusWarning: string

            // icon
            iconDefault: string
            iconDefaultOnDark: string
            iconHover: string
            iconPressed: string
            iconDisabled: string

            iconAccent1: string
            iconAccent2: string

            iconStatusSuccess: string
            iconStatusNeutral: string
            iconStatusWarning: string
            iconStatusCritical: string

            iconStatusNeutralOnColor: string
            iconStatusSuccessOnColor: string
            iconStatusCriticalOnColor: string
            iconStatusWarningOnColor: string

            overlay: string

            // actions

            darkActionSecondaryDefault: string
            darkActionSecondaryHover: string
            darkActionSecondaryPressed: string
            darkActionSecondaryDisabled: string

            darkActionPrimaryDefault: string
            darkActionPrimaryHovered: string

            actionPrimaryDefault: string
            actionPrimaryHovered: string
            actionPrimaryPressed: string
            actionPrimaryDisabled: string

            actionSecondaryDefault: string
            actionSecondaryHovered: string
            actionSecondaryPressed: string
            actionSecondaryDisabled: string

            // Surface/Default
            surfaceDefault: string
            surfaceLight: string
            surfaceHover: string

            // border
            borderDefault: string
            borderFocus: string
            borderError: string

            borderSecondary: string

            // background

            backgroundDark: string
            backgroundLight: string
            backgroundAccent: string

            backgroundAlertNeutral: string
            backgroundAlertNeutralHover: string
            backgroundAlertNeutralClicked: string

            backgroundAlertSuccess: string
            backgroundAlertSuccessHover: string
            backgroundAlertSuccessClicked: string

            backgroundAlertWarning: string
            backgroundAlertWarningHover: string
            backgroundAlertWarningClicked: string

            backgroundAlertCritical: string
            backgroundAlertCriticalHover: string
            backgroundAlertCriticalClicked: string

            backgroundWidget: string

            // NO LINKED TO DS colors

            unknownColor: string
        }
    }
}
