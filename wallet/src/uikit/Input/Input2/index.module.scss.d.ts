export type Styles = {
    HTMLInput: string
    InputBox: string
    State_error: string
    State_normal: string
    Variant_large: string
    Variant_regular: string
    Variant_small: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
