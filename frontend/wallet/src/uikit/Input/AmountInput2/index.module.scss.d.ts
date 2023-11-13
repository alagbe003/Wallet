export type Styles = {
    Bottom: string
    BottomLeft: string
    BottomRight: string
    Container: string
    Content: string
    HTMLInput: string
    State_error: string
    State_normal: string
    Top: string
    TopLeft: string
    TopRight: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
