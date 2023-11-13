import { Dispatch, SetStateAction, useEffect } from 'react'
import {
    LazyLoadableData,
    useLazyLoadableData,
} from '../../LoadableData/LazyLoadableData'
import { notReachable } from '../../notReachable'

const TIMEOUT = 2000

export const useCopyTextToClipboard = (): [
    LazyLoadableData<void, { stringToCopy: string }>,
    Dispatch<SetStateAction<LazyLoadableData<void, { stringToCopy: string }>>>
] => {
    const [state, setState] = useLazyLoadableData(
        ({ stringToCopy }: { stringToCopy: string }) =>
            navigator.clipboard.writeText(stringToCopy),
        {
            type: 'not_asked',
        }
    )

    useEffect(() => {
        switch (state.type) {
            case 'not_asked':
            case 'loading':
                break
            case 'loaded':
            case 'error':
                const id = setTimeout(setState, TIMEOUT, { type: 'not_asked' })
                return () => clearTimeout(id)
            /* istanbul ignore next */
            default:
                return notReachable(state)
        }
    }, [setState, state])

    return [state, setState]
}
