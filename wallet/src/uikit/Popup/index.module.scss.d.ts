export type Styles = {
    Background_backgroundLight: string
    Background_surfaceDefault: string
    Container: string
    Content: string
    Dynamic: string
    Stopper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
