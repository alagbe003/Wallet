export type Styles = {
    Group: string
    Group_variant_compressed: string
    Group_variant_default: string
    Section: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
