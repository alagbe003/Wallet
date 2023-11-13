import { FormattedMessage } from 'react-intl'
import { Story, StoryPage } from '@zeal/uikit/Story'

type Props = {
    onMsg: (msg: Msg) => void
}

export const STORY_SLIDES: StoryPage[] = [
    {
        title: (
            <FormattedMessage
                id="onboarding.story.welcome.title"
                defaultMessage="Welcome to Zeal"
            />
        ),
        subtitle: (
            <FormattedMessage
                id="onboarding.story.welcome.subtitle"
                defaultMessage="Click through to see what makes Zeal the best wallet for crypto earners"
            />
        ),
        artworkSrc: require('./wallet_stories/welcome-story-v1.png'),
    },
    {
        title: (
            <FormattedMessage
                id="onboarding.story.multi_network_wallet.title"
                defaultMessage="Multi-network wallet"
            />
        ),
        subtitle: (
            <FormattedMessage
                id="onboarding.story.multi_network_wallet.subtitle"
                defaultMessage="Popular EVM networks and testnets come already added to Zeal and you can add any others"
            />
        ),
        artworkSrc: require('./wallet_stories/Multi-network-v1.png'),
    },
    {
        title: (
            <FormattedMessage
                id="onboarding.story.smart_portfolio.title"
                defaultMessage="Smart portfolio"
            />
        ),
        subtitle: (
            <FormattedMessage
                id="onboarding.story.smart_portfolio.subtitle"
                defaultMessage="Tokens, NFTs and DeFi positions are added automatically and updated in real time"
            />
        ),
        artworkSrc: require('./wallet_stories/Portfolio-story-v1.webp'),
    },
    {
        title: (
            <FormattedMessage
                id="onboarding.story.transaction_preivew.title"
                defaultMessage="Transaction Preview"
            />
        ),
        subtitle: (
            <FormattedMessage
                id="onboarding.story.transaction_preivew.subtitle"
                defaultMessage="See the exact tokens you’ll send or receive in a transaction before you sign"
            />
        ),
        artworkSrc: require('./wallet_stories/Transaction-preview-v1.webp'),
    },
    {
        title: (
            <FormattedMessage
                id="onboarding.story.safety_checks.title"
                defaultMessage="Safety Checks"
            />
        ),
        subtitle: (
            <FormattedMessage
                id="onboarding.story.safety_checks.subtitle"
                defaultMessage="Avoid scams and mistakes. We highlight risks in sites and contracts"
            />
        ),
        artworkSrc: require('./wallet_stories/Safety-checks-v1.webp'),
    },
]

type Msg = { type: 'on_stories_completed' }

export const WalletStories = ({ onMsg }: Props) => {
    return (
        <Story
            stories={STORY_SLIDES}
            mainCtaTitle={
                <FormattedMessage
                    id="onboarding.story.mainCTA"
                    defaultMessage="Lets gooo!"
                />
            }
            onMsg={onMsg}
        />
    )
}
