import React, { useRef } from 'react'

import { useIntersectViewport } from './useIntersectViewport'

type Props = {
    onIntersect: () => void
    onError: (_: {
        defaultView: boolean
        intersectionObserver: boolean
    }) => void
}

export const ScrollMarker: React.FC<Props> = ({ onIntersect, onError }) => {
    const ref = useRef(null)

    useIntersectViewport({
        ref,
        onIntersect: (isIntersecting) => {
            if (isIntersecting) {
                onIntersect()
            }
        },
        onError,
    })

    return <div ref={ref} />
}
