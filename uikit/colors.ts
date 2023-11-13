type RGBAColor = `rgba(${number}, ${number}, ${number}, ${number})`

type ColorsMap = {
    /* background */

    surfaceDefault: RGBAColor
    surfaceGhost: RGBAColor
    surfaceLight: RGBAColor
    surfaceHover: RGBAColor

    surfaceDark: RGBAColor // TODO proper color name in DS

    backgroundDark: RGBAColor
    backgroundLight: RGBAColor

    backgroundAlertNeutral: RGBAColor
    backgroundAlertNeutralHover: RGBAColor
    backgroundAlertNeutralClicked: RGBAColor

    backgroundAlertSuccess: RGBAColor
    backgroundAlertSuccessHover: RGBAColor
    backgroundAlertSuccessClicked: RGBAColor

    backgroundAlertWarning: RGBAColor
    backgroundAlertWarningHover: RGBAColor
    backgroundAlertWarningClicked: RGBAColor

    backgroundAlertCritical: RGBAColor
    backgroundAlertCriticalHover: RGBAColor
    backgroundAlertCriticalClicked: RGBAColor

    backgroundStatusNeutral: RGBAColor
    backgroundStatusCritical: RGBAColor
    backgroundStatusWarning: RGBAColor
    backgroundStatusSuccess: RGBAColor

    /* Text */

    textPrimary: RGBAColor
    textAccent2: RGBAColor
    textOnDarkPrimary: RGBAColor
    textSecondary: RGBAColor
    textDisabled: RGBAColor

    textOnPrimary: RGBAColor
    textOnSecondary: RGBAColor
    textOnGhost: RGBAColor
    textOnTertiary: RGBAColor
    textOnDark: RGBAColor
    textError: RGBAColor

    textStatusNeutral: RGBAColor
    textStatusNeutralOnColor: RGBAColor
    textStatusNeutralOnColorDisabled: RGBAColor
    textStatusNeutralOnColorHover: RGBAColor
    textStatusNeutralOnColorPressed: RGBAColor

    textStatusWarning: RGBAColor
    textStatusWarningOnColor: RGBAColor
    textStatusWarningOnColorHover: RGBAColor
    textStatusWarningOnColorPressed: RGBAColor
    textStatusWarningOnColorDisabled: RGBAColor

    textStatusSuccess: RGBAColor
    textStatusSuccessOnColor: RGBAColor
    textStatusSuccessOnColorDisabled: RGBAColor
    textStatusSuccessOnColorHover: RGBAColor
    textStatusSuccessOnColorPressed: RGBAColor

    textStatusCritical: RGBAColor
    textStatusCriticalOnColor: RGBAColor
    textStatusCriticalOnColorHover: RGBAColor
    textStatusCriticalOnColorPressed: RGBAColor
    textStatusCriticalOnColorDisabled: RGBAColor

    /* Borders */

    borderDefault: RGBAColor
    borderFocus: RGBAColor
    borderError: RGBAColor

    borderSecondary: RGBAColor

    unknownColor: RGBAColor

    /* Icons */

    iconDefault: RGBAColor
    iconDefaultOnDark: RGBAColor
    iconHover: RGBAColor
    iconPressed: RGBAColor
    iconDisabled: RGBAColor

    iconAccent1: RGBAColor
    iconAccent2: RGBAColor
    iconStatusSuccess: RGBAColor
    iconStatusNeutral: RGBAColor
    iconStatusNeutralOnColor: RGBAColor
    iconStatusWarning: RGBAColor
    iconStatusWarningOnColor: RGBAColor
    iconStatusCritical: RGBAColor
    iconStatusCriticalOnColor: RGBAColor

    /* Actions */

    darkActionSecondaryDefault: RGBAColor
    darkActionSecondaryHover: RGBAColor
    darkActionSecondaryPressed: RGBAColor
    darkActionSecondaryDisabled: RGBAColor

    darkActionPrimaryDefault: RGBAColor
    darkActionPrimaryHovered: RGBAColor

    actionPrimaryDefault: RGBAColor
    actionPrimaryHovered: RGBAColor
    actionPrimaryPressed: RGBAColor
    actionPrimaryDisabled: RGBAColor

    actionGhostDefault: RGBAColor
    actionGhostHovered: RGBAColor
    actionGhostPressed: RGBAColor
    actionGhostDisabled: RGBAColor

    actionSecondaryDefault: RGBAColor
    actionSecondaryHovered: RGBAColor
    actionSecondaryPressed: RGBAColor
    actionSecondaryDisabled: RGBAColor

    /* Status */
    statusNeutral: RGBAColor
    statusCritical: RGBAColor
    statusWarning: RGBAColor
    statusSuccess: RGBAColor

    /* Other */

    backgroundOverlay: RGBAColor

    backgroundWidget: RGBAColor
}

export type Color = keyof ColorsMap

export const colors: ColorsMap = {
    /* background */

    surfaceDefault: 'rgba(255, 255, 255, 1)',
    surfaceGhost: 'rgba(228, 255, 255, 1)',
    surfaceLight: 'rgba(248, 248, 248, 1)',
    surfaceHover: 'rgba(248, 248, 248, 1)',

    surfaceDark: 'rgba(123, 135, 148, 1)', // TODO proper color name in DS

    backgroundDark: 'rgba(19, 39, 54, 1)',
    backgroundLight: 'rgba(248, 248, 248, 1)',

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

    backgroundStatusNeutral: 'rgba(71, 182, 217, 1)',
    backgroundStatusCritical: 'rgba(217, 71, 71, 1)',
    backgroundStatusWarning: 'rgba(241, 157, 57, 1)',
    backgroundStatusSuccess: 'rgba(34, 204, 122, 1)',

    /* Text */

    textPrimary: 'rgba(82, 96, 109, 1)',
    textAccent2: 'rgba(1, 201, 201, 1)',
    textOnDarkPrimary: 'rgba(255, 255, 255, 1)',
    textSecondary: 'rgba(154, 165, 177, 1)',
    textDisabled: 'rgba(148, 163, 184, 1)',

    textOnPrimary: 'rgba(255, 255, 255, 1)',
    textOnSecondary: 'rgba(255, 255, 255, 1)',
    textOnGhost: 'rgba(255, 255, 255, 1)',
    textOnTertiary: 'rgba(255, 255, 255, 1)',
    textOnDark: 'rgba(255, 255, 255, 1)',
    textError: 'rgba(217, 71, 71, 1)',

    textStatusNeutral: 'rgba(71, 182, 217, 1)',
    textStatusNeutralOnColor: 'rgba(4, 97, 125, 1)',
    textStatusNeutralOnColorDisabled: 'rgba(4, 97, 125, 1)',
    textStatusNeutralOnColorHover: 'rgba(4, 97, 125, 1)',
    textStatusNeutralOnColorPressed: 'rgba(4, 97, 125, 1)',

    textStatusWarning: 'rgba(241, 157, 57, 1)',
    textStatusWarningOnColor: 'rgba(176, 76, 0, 1)',
    textStatusWarningOnColorHover: 'rgba(176, 76, 0, 1)',
    textStatusWarningOnColorPressed: 'rgba(255, 84, 84, 1)',
    textStatusWarningOnColorDisabled: 'rgba(225, 139, 139, 1)',

    textStatusSuccess: 'rgba(34, 204, 122, 1)',
    textStatusSuccessOnColor: 'rgba(1, 125, 65, 1)',
    textStatusSuccessOnColorDisabled: 'rgba(1, 125, 65, 1)',
    textStatusSuccessOnColorHover: 'rgba(1, 125, 65, 1)',
    textStatusSuccessOnColorPressed: 'rgba(1, 125, 65, 1)',

    textStatusCritical: 'rgba(201, 27, 27, 1)',
    textStatusCriticalOnColor: 'rgba(201, 27, 27, 1)',
    textStatusCriticalOnColorHover: 'rgba(98, 20, 20, 1)',
    textStatusCriticalOnColorPressed: 'rgba(255, 84, 84, 1)',
    textStatusCriticalOnColorDisabled: 'rgba(225, 139, 139, 1)',

    /* Borders */

    borderDefault: 'rgba(203, 210, 217, 1)',
    borderFocus: 'rgba(0, 255, 255, 1)',
    borderError: 'rgba(217, 71, 71, 1)',

    borderSecondary: 'rgba(228, 231, 235, 1)',

    unknownColor: 'rgba(255, 0, 224, 1)',

    /* Icons */

    iconDefault: 'rgba(196, 196, 196, 1)',
    iconDefaultOnDark: 'rgba(255, 255, 255, 1)',
    iconHover: 'rgba(123, 135, 148, 1)',
    iconPressed: 'rgba(154, 165, 177, 1)',
    iconDisabled: 'rgba(148, 163, 184, 1)',

    iconAccent1: 'rgba(0, 255, 255, 1)',
    iconAccent2: 'rgba(1, 201, 201, 1)',
    iconStatusSuccess: 'rgba(34, 204, 122, 1)',
    iconStatusNeutral: 'rgba(71, 182, 217, 1)',
    iconStatusNeutralOnColor: 'rgba(4, 97, 125, 1)',
    iconStatusWarning: 'rgba(241, 157, 57, 1)',
    iconStatusWarningOnColor: 'rgba(176, 76, 0, 1)',
    iconStatusCritical: 'rgba(217, 71, 71, 1)',
    iconStatusCriticalOnColor: 'rgba(201, 27, 27, 1)',

    /* Actions */

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

    actionGhostDefault: 'rgba(1, 201, 201, 1)',
    actionGhostHovered: 'rgba(0, 227, 227, 1)',
    actionGhostPressed: 'rgba(0, 156, 156, 1)',
    actionGhostDisabled: 'rgba(242, 244, 246, 1)',

    actionSecondaryDefault: 'rgba(255, 255, 255, 1)',
    actionSecondaryHovered: 'rgba(246, 246, 247, 1)',
    actionSecondaryPressed: 'rgba(241, 242, 243, 1)',
    actionSecondaryDisabled: 'rgba(242, 244, 246, 1)',

    /* Status */
    statusNeutral: 'rgba(71, 182, 217, 1)',
    statusCritical: 'rgba(217, 71, 71, 1)',
    statusWarning: 'rgba(241, 157, 57, 1)',
    statusSuccess: 'rgba(34, 204, 122, 1)',

    /* Other */

    backgroundOverlay: 'rgba(26, 54, 75, 0.8)',

    backgroundWidget: 'rgba(40, 45, 63, 0.55)',
}
