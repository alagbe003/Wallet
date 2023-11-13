export type Styles = {
    layout: string
    text: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
