import * as React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { IntegerInput as GInput } from './IntegerInput'
import { useState } from 'react'

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
    component: GInput,
    parameters: {
        // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
        layout: 'fullscreen',
    },
    argTypes: {
        ...disabledArgs,
        label: { type: 'string', defaultValue: 'Get Started' },
    },
} as ComponentMeta<typeof GInput>

const Template: ComponentStory<typeof GInput> = ({ ...rest }) => {
    const [state, setState] = useState<string>(rest.integerString)
    return (
        <GInput integerString={state} onChange={setState}>
            {({ value, onChange }) => (
                <input value={value} onChange={onChange} />
            )}
        </GInput>
    )
}

export const GweiInput = Template.bind({})

GweiInput.args = {
    integerString: '127.003',
}
