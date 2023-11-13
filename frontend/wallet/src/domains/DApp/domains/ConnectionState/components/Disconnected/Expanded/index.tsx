import React from 'react'
import { Story } from '@zeal/uikit/Story'
import { FormattedMessage } from 'react-intl'
import { notReachable } from '@zeal/toolkit'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const Expanded = ({ onMsg }: Props) => {
    return (
        <Story
            stories={[
                {
                    title: (
                        <FormattedMessage
                            id="connection.diconnected.page1.title"
                            defaultMessage="How to connect with Zeal?"
                        />
                    ),
                    subtitle: (
                        <FormattedMessage
                            id="connection.diconnected.page1.subtitle"
                            defaultMessage="Zeal works everywhere Metamask works. Simply connect as you would with Metamask"
                        />
                    ),
                    artworkSrc: require('./wallet_stories/connection_story_1.webp'),
                },
                {
                    title: (
                        <FormattedMessage
                            id="connection.diconnected.page2.title"
                            defaultMessage="Click Connect Wallet"
                        />
                    ),
                    subtitle: (
                        <FormattedMessage
                            id="connection.diconnected.page2.subtitle"
                            defaultMessage="You’ll see lot of options. Zeal might be one of them. If Zeal doesn’t appear..."
                        />
                    ),
                    artworkSrc: require('./wallet_stories/connection_story_2.webp'),
                },
                {
                    title: (
                        <FormattedMessage
                            id="connection.diconnected.page3.title"
                            defaultMessage="Choose Metamask"
                        />
                    ),
                    subtitle: (
                        <FormattedMessage
                            id="connection.diconnected.page3.subtitle"
                            defaultMessage="We’ll prompt a connection with Zeal. Browser or Injected should work as well. Try it!"
                        />
                    ),
                    artworkSrc: require('./wallet_stories/connection_story_3.webp'),
                },
            ]}
            mainCtaTitle={
                <FormattedMessage
                    id="connection.diconnected.got_it"
                    defaultMessage="Got it!"
                />
            }
            onMsg={(msg) => {
                switch (msg.type) {
                    case 'on_stories_completed':
                        onMsg({ type: 'close' })
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(msg.type)
                }
            }}
        />
    )
}
