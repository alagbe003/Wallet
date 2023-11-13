import React from 'react'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Story as UIStory } from '@zeal/uikit/Story'
import { FormattedMessage } from 'react-intl'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof UIStory>

export const Story = ({ onMsg }: Props) => {
    return (
        <UIStory
            stories={[
                {
                    title: (
                        <FormattedMessage
                            id="bank_transfers.story.free_fast_bank_transfers"
                            defaultMessage="Free, fast bank transfers"
                        />
                    ),
                    subtitle: (
                        <FormattedMessage
                            id="bank_transfers.story_cta.transfer_between_your_local_currency"
                            defaultMessage="Transfer between your local currency & USDC"
                        />
                    ),
                    artworkSrc: require('./wallet_stories/bank_transfers_1.png'),
                },
            ]}
            mainCtaTitle={
                <FormattedMessage
                    id="bank_transfers.story_cta.get_started"
                    defaultMessage="Get started"
                />
            }
            onMsg={onMsg}
        />
    )
}
