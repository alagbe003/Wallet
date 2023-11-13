import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Animation as UIAnimation } from './index'

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
    title: 'Components',
    component: UIAnimation,
    parameters: {
        // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
        layout: 'fullscreen',
    },
    argTypes: {
        ...disabledArgs,
    },
} as ComponentMeta<typeof UIAnimation>

const Template: ComponentStory<typeof UIAnimation> = ({ ...rest }) => (
    <UIAnimation {...rest}></UIAnimation>
)

export const Animation = Template.bind({})

Animation.args = {
    animation: 'success',
    size: 125,
}
