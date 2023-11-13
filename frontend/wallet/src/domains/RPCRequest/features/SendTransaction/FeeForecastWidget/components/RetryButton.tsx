import { FormattedMessage } from 'react-intl'
import { Tertiary } from 'src/uikit/Button/Tertiary'

type Props = {
    onClick: () => void
}

export const RetryButton = ({ onClick }: Props) => {
    return (
        <Tertiary size="small" color="on_light" onClick={onClick}>
            <FormattedMessage id="action.retry" defaultMessage="Retry" />
        </Tertiary>
    )
}
