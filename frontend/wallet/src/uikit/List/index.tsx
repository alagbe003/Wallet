import React, { useState } from 'react'
import { ScrollMarker } from 'src/uikit/ScrollMarker'

type Props<T> = {
    items: T[]
    renderItem: (item: T) => React.ReactNode
}

const PAGE_SIZE = 20

export const List = function <T>({ items, renderItem }: Props<T>) {
    const [state, setState] = useState<number>(PAGE_SIZE)
    const page = items.slice(0, state)
    const isFullListRendered = page.length >= items.length

    return (
        <>
            {page.map(renderItem)}
            {!isFullListRendered && (
                <ScrollMarker
                    onIntersect={() => {
                        setState((s) => s + PAGE_SIZE)
                    }}
                    onError={() => {
                        setState(items.length)
                    }}
                />
            )}
        </>
    )
}
