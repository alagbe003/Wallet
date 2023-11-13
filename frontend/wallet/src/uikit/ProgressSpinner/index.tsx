import { Animation } from '@zeal/uikit/Animation'

type Props = {
    key: number
    size: number
    durationMs: number
}

const SPINNER_PADDING = 2

export const ProgressSpinner = ({ size, durationMs }: Props) => {
    return (
        <div style={{ padding: `${SPINNER_PADDING}px` }}>
            <Animation
                animation="radial-progress"
                durationMs={durationMs}
                size={size - SPINNER_PADDING * 2}
                loop={false}
            />
        </div>
    )
}
