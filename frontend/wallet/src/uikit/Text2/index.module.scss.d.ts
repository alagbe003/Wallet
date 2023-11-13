export type Styles = {
    Align_center: string
    Align_left: string
    BreakWord: string
    Color_textAccent2: string
    Color_textDisabled: string
    Color_textError: string
    Color_textOnDark: string
    Color_textOnDarkPrimary: string
    Color_textOnGhost: string
    Color_textOnPrimary: string
    Color_textOnSecondary: string
    Color_textOnTertiary: string
    Color_textPrimary: string
    Color_textSecondary: string
    Color_textStatusCritical: string
    Color_textStatusCriticalOnColor: string
    Color_textStatusNeutral: string
    Color_textStatusNeutralOnColor: string
    Color_textStatusSuccess: string
    Color_textStatusSuccessOnColor: string
    Color_textStatusWarning: string
    Color_textStatusWarningOnColor: string
    Color_textUnknown: string
    Ellipsis: string
    Text: string
    Typograhy_callout: string
    Typograhy_caption1: string
    Typograhy_caption2: string
    Typograhy_footnote: string
    Typograhy_headline: string
    Typograhy_inherit: string
    Typograhy_large: string
    Typograhy_paragraph: string
    Typograhy_title1: string
    Typograhy_title2: string
    Typograhy_title3: string
    Weight_bold: string
    Weight_inherit: string
    Weight_medium: string
    Weight_regular: string
    Weight_semi_bold: string
    Whitespace_normal: string
    Whitespace_nowrap: string
    'Whitespace_pre-wrap': string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
