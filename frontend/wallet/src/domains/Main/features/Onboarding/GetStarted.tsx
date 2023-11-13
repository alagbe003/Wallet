import { FormattedMessage } from 'react-intl'
import { Button } from 'src/uikit'
import { Column2 } from 'src/uikit/Column2'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Text2 } from 'src/uikit/Text2'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import {
    ZEAL_PRIVACY_POLICY_URL,
    ZEAL_TERMS_OF_USE_URL,
} from '@zeal/domains/Main/constants'

type Props = {
    onGetStartedClicked: () => void
    onImportClicked: () => void
}

export const GetStarted = ({ onGetStartedClicked, onImportClicked }: Props) => (
    <Layout2 padding="form" background="onboarding">
        <Spacer2 />
        <Column2 spacing={24} alignX="center">
            <Column2 spacing={16} alignX="center">
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
                <Tertiary
                    color="on_light"
                    size="regular"
                    onClick={onImportClicked}
                >
                    <FormattedMessage
                        id="main.onboarding.get_started.import"
                        defaultMessage="Reinstalling? Restore wallet"
                    />
                </Tertiary>
            </Column2>
            <Text2
                align="center"
                variant="caption1"
                weight="regular"
                color="textSecondary"
            >
                <FormattedMessage
                    id="main.onboarding.get_started.terms_text"
                    defaultMessage="By using Zeal you accept our <Terms>Terms</Terms> and <PrivacyPolicy>Privacy Policy</PrivacyPolicy>"
                    values={{
                        Terms: (message) => (
                            <Tertiary
                                color="on_light"
                                size="small"
                                inline
                                onClick={() =>
                                    window.open(ZEAL_TERMS_OF_USE_URL)
                                }
                            >
                                {message}
                            </Tertiary>
                        ),
                        PrivacyPolicy: (message) => (
                            <Tertiary
                                color="on_light"
                                size="small"
                                inline
                                onClick={() =>
                                    window.open(ZEAL_PRIVACY_POLICY_URL)
                                }
                            >
                                {message}
                            </Tertiary>
                        ),
                    }}
                />
            </Text2>
        </Column2>
    </Layout2>
)
