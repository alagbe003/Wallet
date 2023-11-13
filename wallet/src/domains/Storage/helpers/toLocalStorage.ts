import { LS_KEY } from '@zeal/domains/Storage/constants'
import { Storage } from '@zeal/domains/Storage/index'

export const toLocalStorage = async (storage: Storage): Promise<void> => {
    await chrome.storage.local.set({
        [LS_KEY]: JSON.stringify(
            storage,
            (key, value) =>
                typeof value === 'bigint' ? value.toString() : value // return everything else unchanged
        ),
    })
}
