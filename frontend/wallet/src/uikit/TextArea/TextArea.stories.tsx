import { useState } from 'react'
import { Column2 } from 'src/uikit/Column2'

import { TextArea } from './TextArea'

export default {
    title: 'TextArea',
}

export const Def = () => {
    const [value, setValue] = useState<string>('')

    return (
        <div style={{ width: '360px' }}>
            <Column2 spacing={24}>
                <TextArea
                    type="text"
                    placeholder=""
                    autoHeight
                    state="normal"
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                />

                <TextArea
                    type="password"
                    placeholder=""
                    autoHeight
                    autoFocus
                    state="error"
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                />
            </Column2>
        </div>
    )
}
