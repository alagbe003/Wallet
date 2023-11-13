import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Header } from 'src/uikit/Header'
import { Logo } from 'src/uikit/Icon/Logo/Logo'
import { FormattedMessage } from 'react-intl'
import { Column2 } from 'src/uikit/Column2'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Group } from 'src/uikit/Group'
import { BoldGlasses } from 'src/uikit/Icon/BoldGlasses'
import { SolidFilesBook } from 'src/uikit/Icon/SolidFilesBook'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_used_web3_before_click' }
    | { type: 'on_new_to_web3_click' }

export const HowExperiencedYouAre = ({ onMsg }: Props) => {
    return (
        <Layout2 padding="form" background="light">
            <Column2 spacing={24}>
                <Header
                    icon={({ color }) => <Logo size={36} color={color} />}
                    title={
                        <FormattedMessage
                            id="main.onboarding.how_experienced_you_are.title"
                            defaultMessage="How experienced are you with web3?"
                        />
                    }
                />
                <Column2 spacing={8} alignX="center">
                    <Group variant="default">
                        <ListItem2
                            size="regular"
                            aria-selected={false}
                            onClick={() =>
                                onMsg({ type: 'on_used_web3_before_click' })
                            }
                            avatar={({ size }) => (
                                <BoldGlasses color="iconAccent2" size={size} />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="main.onboarding.how_experienced_you_are.used_web_3_before"
                                    defaultMessage="I’ve used web3 before"
                                />
                            }
                            shortText={
                                <FormattedMessage
                                    id="main.onboarding.how_experienced_you_are.learn_why"
                                    defaultMessage="Learn why Zeal is the better choice"
                                />
                            }
                        />
                    </Group>
                    <Group variant="default">
                        <ListItem2
                            size="regular"
                            aria-selected={false}
                            onClick={() =>
                                onMsg({ type: 'on_new_to_web3_click' })
                            }
                            avatar={({ size }) => (
                                <SolidFilesBook
                                    color="iconAccent2"
                                    size={size}
                                />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="main.onboarding.how_experienced_you_are.new_to_web_3"
                                    defaultMessage="I’m new to web3"
                                />
                            }
                            shortText={
                                <FormattedMessage
                                    id="main.onboarding.how_experienced_you_are.learn_basics"
                                    defaultMessage="Learn the basics of web3"
                                />
                            }
                        />
                    </Group>
                </Column2>
            </Column2>
        </Layout2>
    )
}
