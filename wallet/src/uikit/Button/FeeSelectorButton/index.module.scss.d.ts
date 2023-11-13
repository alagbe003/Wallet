export type Styles = {
    Amount: string
    FeeSelectorButton: string
    FeeSelectorButtonDisabled: string
    FeeSelectorButtonError: string
    FeeSelectorButtonSelected: string
    Icon: string
    Skeleton: string
    Spacer: string
    Time: string
    Title: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
