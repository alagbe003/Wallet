import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { OnboardingLogo as UIOnboardingLogo } from './Logo/OnboardingLogo'

const off = {
    table: {
        disable: true,
    },
}
const disabledArgs = {
    ref: off,
    theme: off,
    as: off,
    forwardedAs: off,
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Icons',
    component: UIOnboardingLogo,
    parameters: {
        // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
        layout: 'fullscreen',
    },
    argTypes: {
        ...disabledArgs,
        size: { type: 'number', defaultValue: 0 },
    },
} as ComponentMeta<typeof UIOnboardingLogo>

const Template: ComponentStory<typeof UIOnboardingLogo> = () => (
    <UIOnboardingLogo />
)

export const Text = Template.bind({})

Text.args = {}
