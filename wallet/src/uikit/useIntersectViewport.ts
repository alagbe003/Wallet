import React, { useEffect } from 'react'
import { useLiveRef } from '@zeal/toolkit'

type Props = {
    ref: React.RefObject<HTMLElement | null>
    onIntersect: (isIntersecting: boolean) => void
    threshold?: number | number[]
    onError?: (_: {
        defaultView: boolean
        intersectionObserver: boolean
    }) => void
}

export function useIntersectViewport({
    onIntersect,
    ref,
    onError,
    threshold,
}: Props) {
    const win = document.defaultView
    const callbackRef = useLiveRef(onIntersect)
    const errorLiveRef = useLiveRef(onError)

    useEffect(() => {
        const element = ref.current

        if (element) {
            if (win && win.IntersectionObserver) {
                const observer = new win.IntersectionObserver(
                    ([entry]) => {
                        if (callbackRef.current)
                            callbackRef.current(entry.isIntersecting)
                    },
                    { threshold }
                )

                observer.observe(element)
                return () => observer.disconnect()
            } else {
                if (errorLiveRef.current) {
                    errorLiveRef.current({
                        defaultView: !!win,
                        intersectionObserver: !!win?.IntersectionObserver,
                    })
                }
            }
        }
    }, [win, ref, threshold, callbackRef, errorLiveRef])
}
