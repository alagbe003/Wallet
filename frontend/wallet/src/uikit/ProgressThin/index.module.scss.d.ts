export type Styles = {
    Bar: string
    BarBackground_critical: string
    BarBackground_neutral: string
    BarBackground_primary: string
    BarBackground_success: string
    BarBackground_warning: string
    Progress: string
    Wrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
