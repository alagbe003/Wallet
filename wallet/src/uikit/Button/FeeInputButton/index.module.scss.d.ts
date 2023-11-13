export type Styles = {
    Button: string
    ButtonDisabled: string
    ButtonError: string
    SideIcon: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
