export type Styles = {
    Box: string
    Password: string
    State_error: string
    State_normal: string
    Textarea: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
