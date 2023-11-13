import { FormattedMessage } from 'react-intl'
import { Content } from 'src/uikit/Layout/Content'

type Props = {
    onAnimationComplete: null | (() => void)
}

export const SuccessLayout = ({ onAnimationComplete }: Props) => (
    <Content.Splash
        onAnimationComplete={onAnimationComplete}
        variant="success"
        title={
            <FormattedMessage
                id="CheckConfirmation.success.splash"
                defaultMessage="Complete"
            />
        }
    />
)
