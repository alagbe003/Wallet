export type Styles = {
    Background_dark: string
    Background_default: string
    Background_light: string
    Background_magenta: string
    Background_onboarding: string
    Background_surfaceDark: string
    Background_teal: string
    base: string
    ContentBox: string
    HeaderBox: string
    LayoutContent: string
    LayoutContentContainer: string
    LayoutFooter: string
    LayoutHeaderContainer: string
    Padding_centered: string
    Padding_form: string
    Padding_main: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
