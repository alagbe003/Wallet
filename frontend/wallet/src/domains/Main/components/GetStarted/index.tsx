import { FormattedMessage } from 'react-intl'
import { Button } from 'src/uikit'
import { Column2 } from 'src/uikit/Column2'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Spacer2 } from 'src/uikit/Spacer2'

type Props = {
    onGetStartedClicked: () => void
}

export const GetStarted = ({ onGetStartedClicked }: Props) => (
    <Layout2 padding="form" background="onboarding">
        <Spacer2 />
        <Column2 spacing={24} alignX="center">
            <Button
                size="regular"
                variant="secondary"
                onClick={onGetStartedClicked}
            >
                <FormattedMessage
                    id="actions.getStarted"
                    defaultMessage="Get Started"
                />
            </Button>
        </Column2>
    </Layout2>
)
