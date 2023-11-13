export type Styles = {
    Clickable: string
    container: string
    Size_large: string
    Size_regular: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
