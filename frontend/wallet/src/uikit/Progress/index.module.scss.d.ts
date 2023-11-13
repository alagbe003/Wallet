export type Styles = {
    clickable: string
    critical: string
    neutral: string
    Progress: string
    ProgressBar: string
    Right: string
    rounded: string
    Subtitle: string
    success: string
    Title: string
    warning: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
