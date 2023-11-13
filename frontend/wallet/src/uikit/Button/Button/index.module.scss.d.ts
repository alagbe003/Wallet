export type Styles = {
    Button: string
    Size_compressed: string
    Size_regular: string
    Size_small: string
    Variant_primary: string
    Variant_secondary: string
    Variant_tertiary: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
