export type Styles = {
    base: string
    default: string
    secondary: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
