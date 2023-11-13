import { DefaultTheme } from 'styled-components'

const basics = {
    black: 'rgba(19, 39, 54, 1)',
    blackDeep: 'rgba(0,0,0,1)',
    white: 'rgba(255,255,255,1)',

    error: 'rgba(217, 71, 71, 1)',
    success: 'rgba(34, 204, 122, 1)',

    primary1: 'rgba(0,255,255,1)',
    primary2: 'rgba(1, 201, 201, 1)',

    grey01: `rgba(50, 63, 75, 1)`,
    grey02: 'rgba(82, 96, 109, 1)',
    grey03: 'rgba(123, 135, 148, 1)',
    grey04: 'rgba(154, 165, 177, 1)',
    grey05: 'rgba(203, 210, 217, 1)',
    grey06: 'rgba(228, 231, 235, 1)',
}

export const defaultTheme: DefaultTheme = {
    colors: {
        // basics
        // black: basics.black,
        // blackDeep: basics.blackDeep,

        // primary: basics.primary,
        transparent: 'rgba(0,0,0,0)',

        textPrimary: 'rgba(82, 96, 109, 1)',
        textOnDarkPrimary: 'rgba(255,255,255,1)',
        textSecondary: 'rgba(154, 165, 177, 1)',
        textDisabled: 'rgba(148, 163, 184, 1)',

        textOnPrimary: basics.white,
        textOnSecondary: basics.white,
        textOnGhost: basics.white,
        textOnTertiary: basics.white,
        textOnDark: basics.white,

        textError: basics.error,

        textStatusCritical: 'rgba(217,71,71,1)',
        textStatusCriticalHover: 'rgba(98,20,20,1)',
        textStatusCriticalPressed: 'rgba(250,179,179,1)',
        textStatusCriticalDisabled: 'rgba(250,179,179,1)',

        textStatusCriticalOnColor: 'rgba(201, 27, 27, 1)',
        textStatusCriticalOnColorHover: 'rgba(98, 20, 20, 1)',
        textStatusCriticalOnColorPressed: 'rgba(255, 84, 84, 1)',
        textStatusCriticalOnColorDisabled: 'rgba(225, 139, 139, 1)',

        textStatusWarning: 'rgba(241, 157, 57, 1)',
        textStatusWarningHover: 'rgba(176, 76, 0, 1)',
        textStatusWarningPressed: 'rgba(253, 209, 158, 1)',
        textStatusWarningDisabled: 'rgba(253, 209, 158, 1)',

        textStatusWarningOnColor: 'rgba(241, 157, 57, 1)',
        textStatusWarningOnColorHover: 'rgba(176, 76, 0, 1)',
        textStatusWarningOnColorPressed: 'rgba(255, 84, 84, 1)',
        textStatusWarningOnColorDisabled: 'rgba(225, 139, 139, 1)',

        textStatusSuccess: 'rgba(34, 204, 122, 1)',
        textStatusSuccessHover: 'rgba(1, 125, 65, 1)',
        textStatusSuccessPressed: 'rgba(137, 225, 183, 1)',
        textStatusSuccessDisabled: 'rgba(137, 225, 183, 1)',

        textStatusSuccessOnColor: 'rgba(1, 125, 65, 1)',
        textStatusSuccessOnColorDisabled: 'rgba(1, 125, 65, 1)',
        textStatusSuccessOnColorHover: 'rgba(1, 125, 65, 1)',
        textStatusSuccessOnColorPressed: 'rgba(1, 125, 65, 1)',

        textStatusNeutralOnColor: 'rgba(4, 97, 125, 1)',
        textStatusNeutralOnColorDisabled: 'rgba(4, 97, 125, 1)',
        textStatusNeutralOnColorHover: 'rgba(4, 97, 125, 1)',
        textStatusNeutralOnColorPressed: 'rgba(4, 97, 125, 1)',

        // supporting / status
        error: 'rgba(217, 71, 71, 1)',
        warning: 'rgba(241, 157, 57, 1)',
        success: basics.success,

        statusNeutral: 'rgba(71, 182, 217, 1)',
        statusCritical: 'rgba(217, 71, 71, 1)',
        statusWarning: 'rgba(241, 157, 57, 1)',
        statusSuccess: 'rgba(34, 204, 122, 1)',

        // icon
        iconDefault: 'rgba(196, 196, 196, 1)',
        iconDefaultOnDark: 'rgba(255, 255, 255, 1)',

        iconHover: 'rgba(123, 135, 148, 1)',
        iconPressed: 'rgba(154, 165, 177, 1)',
        iconDisabled: 'rgba(148, 163, 184, 1)',

        iconAccent1: basics.primary1,
        iconAccent2: basics.primary2,

        overlay: 'rgb(26, 54, 75, 0.8)',

        iconStatusSuccess: 'rgba(34, 204, 122, 1)',
        iconStatusNeutral: 'rgba(71, 182, 217, 1)',
        iconStatusWarning: 'rgba(241, 157, 57, 1)',
        iconStatusCritical: 'rgba(217, 71, 71, 1)',

        iconStatusNeutralOnColor: 'rgba(4, 97, 125, 1)',
        iconStatusSuccessOnColor: 'rgba(1, 125, 65, 1)',
        iconStatusCriticalOnColor: 'rgba(201, 27, 27, 1)',
        iconStatusWarningOnColor: 'rgba(176, 76, 0, 1)',

        // actions

        darkActionSecondaryDefault: 'rgba(203, 210, 217, 1)',
        darkActionSecondaryHover: 'rgba(255, 255, 255, 1)',
        darkActionSecondaryPressed: 'rgba(1, 201, 201, 1)',
        darkActionSecondaryDisabled: 'rgba(148, 163, 184, 1)',

        darkActionPrimaryDefault: 'rgba(29, 59, 81, 1)',
        darkActionPrimaryHovered: 'rgba(33, 67, 92, 1)',

        actionPrimaryDefault: 'rgba(1, 201, 201, 1)',
        actionPrimaryHovered: 'rgba(0, 227, 227, 1)',
        actionPrimaryPressed: 'rgba(0, 156, 156, 1)',
        actionPrimaryDisabled: 'rgba(242, 244, 246, 1)',

        actionSecondaryDefault: 'rgba(255, 255, 255, 1)',
        actionSecondaryHovered: 'rgba(246, 246, 247, 1)',
        actionSecondaryPressed: 'rgba(241, 242, 243, 1)',
        actionSecondaryDisabled: 'rgba(242, 244, 246, 1)',

        // border
        borderDefault: basics.grey05,
        borderFocus: basics.primary1,
        borderError: basics.error,

        borderSecondary: 'rgba(241, 241, 241, 1)',

        backgroundDark: 'rgba(19, 39, 54, 1)',
        backgroundLight: 'rgba(248, 248, 248, 1)',
        backgroundAccent: basics.primary1,

        backgroundAlertNeutral: 'rgba(209, 237, 246, 1)',
        backgroundAlertNeutralHover: 'rgba(195, 233, 245, 1)',
        backgroundAlertNeutralClicked: 'rgba(168, 221, 238, 1)',

        backgroundAlertSuccess: 'rgba(217, 246, 232, 1)',
        backgroundAlertSuccessHover: 'rgba(181, 243, 213, 1)',
        backgroundAlertSuccessClicked: 'rgba(137, 225, 183, 1)',

        backgroundAlertWarning: 'rgba(252, 235, 215, 1)',
        backgroundAlertWarningHover: 'rgba(255, 225, 190, 1)',
        backgroundAlertWarningClicked: 'rgba(253, 209, 158, 1)',

        backgroundAlertCritical: 'rgba(249, 224, 224, 1)',
        backgroundAlertCriticalHover: 'rgba(249, 204, 204, 1)',
        backgroundAlertCriticalClicked: 'rgba(250, 179, 179, 1)',

        backgroundWidget: 'rgba(40, 45, 63, 0.55)',

        surfaceDefault: basics.white,
        surfaceLight: 'rgba(248, 248, 248, 1)',
        surfaceHover: 'rgba(248, 248, 248, 1)',

        // NO LINKED TO DS colors

        unknownColor: 'rgba(255,0,224,1)',
    },
}

export type ThemeProps = {
    theme?: DefaultTheme
}
