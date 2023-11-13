import { useState } from 'react'
import { Column2 } from 'src/uikit/Column2'

import { Input2 } from './index'

export default {
    title: 'Input2',
}

export const Def = () => {
    const [value, setValue] = useState<string>('')

    return (
        <div style={{ width: '360px' }}>
            <Column2 spacing={24}>
                <Input2
                    variant="large"
                    state="normal"
                    value={value}
                    placeholder="Placeholder"
                    type="text"
                    message="message!"
                    sideMessage="sidemessage"
                    onChange={(e) => setValue(e.target.value)}
                />

                <Input2
                    variant="regular"
                    state="error"
                    value={value}
                    placeholder="Placeholder"
                    type="text"
                    message="message!"
                    sideMessage="sidemessage"
                    onChange={(e) => setValue(e.target.value)}
                />

                <Input2
                    variant="small"
                    state="error"
                    value={value}
                    placeholder="Placeholder"
                    type="text"
                    message="message!"
                    sideMessage="sidemessage"
                    onChange={(e) => setValue(e.target.value)}
                />
            </Column2>
        </div>
    )
}
