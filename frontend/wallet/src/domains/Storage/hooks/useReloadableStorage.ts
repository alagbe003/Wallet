import {
    ReloadableData,
    useReloadableData,
} from '@zeal/toolkit/LoadableData/ReloadableData'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { notReachable } from '@zeal/toolkit'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { fetchStorage } from 'src/domains/Storage/api/fetchStorage'
import { Storage } from '@zeal/domains/Storage'
import { NetworkMap } from '@zeal/domains/Network'

type Data = {
    storage: Storage | null
    sessionPassword: string | null
    installationId: string
    networkMap: NetworkMap
}

type Params = undefined

type ReturnType = [
    ReloadableData<Data, Params>,
    Dispatch<SetStateAction<ReloadableData<Data, Params>>>
]

export const useReloadableStorage = (
    initialState:
        | ReloadableData<Data, Params>
        | (() => ReloadableData<Data, Params>)
): ReturnType => {
    const [loadable, setLoadable] = useReloadableData(
        fetchStorage,
        initialState
    )

    useEffect(() => {
        const listener = () => {
            setLoadable((old) => {
                switch (old.type) {
                    case 'loaded':
                    case 'reloading':
                    case 'subsequent_failed':
                        return {
                            type: 'reloading',
                            params: undefined,
                            data: old.data,
                        }

                    case 'loading':
                    case 'error':
                        return {
                            type: 'loading',
                            params: undefined,
                        }

                    /* istanbul ignore next */
                    default:
                        return notReachable(old)
                }
            })
        }

        chrome.storage.onChanged.addListener(listener)

        return () => {
            chrome.storage.onChanged.removeListener(listener)
        }
    }, [loadable, setLoadable])

    useEffect(() => {
        switch (loadable.type) {
            case 'loaded':
            case 'reloading':
            case 'subsequent_failed':
            case 'loading':
                break

            case 'error':
                captureError(loadable.error)
                break

            default:
                notReachable(loadable)
        }
    }, [loadable])

    return [loadable, setLoadable]
}
