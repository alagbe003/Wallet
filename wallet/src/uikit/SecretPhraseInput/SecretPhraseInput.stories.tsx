import { useState } from 'react'
import { Descendant } from 'slate'
import { Column2 } from 'src/uikit/Column2'

import { SecretPhraseInput, getPhraseString } from './SecretPhraseInput'

export default {
    title: 'SecretPhraseInput',
}

export const Def = () => {
    const [value, setValue] = useState<Descendant[] | null>(null)
    const [hidden, setHidden] = useState<boolean>(false)

    const phrase = getPhraseString(value)

    return (
        <div style={{ width: '360px' }}>
            <Column2 spacing={24}>
                <SecretPhraseInput
                    errorWordsIndexes={[4, 8]}
                    hidden={hidden}
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                    onError={(reason) => {
                        alert(reason)
                    }}
                />
            </Column2>

            <div>
                <hr />
                {JSON.stringify(phrase)}
                <hr />
                <button onClick={() => setHidden(!hidden)}>toggle</button>
                <hr />
            </div>
        </div>
    )
}
