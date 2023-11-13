export type Styles = {
    Color_critical: string
    Color_neutral: string
    Color_on_dark: string
    Color_on_light: string
    Color_success: string
    Color_warning: string
    Inline: string
    Size_large: string
    Size_regular: string
    Size_small: string
    Size_xl: string
    Tertiary: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
