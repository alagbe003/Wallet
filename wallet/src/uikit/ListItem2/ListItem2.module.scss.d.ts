export type Styles = {
    clickable: string
    container: string
    container_critical: string
    container_default: string
    container_solid: string
    container_warning: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
