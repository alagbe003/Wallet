import { Storage } from '@zeal/domains/Storage'
import { LS_KEY } from '@zeal/domains/Storage/constants'
import {
    parseLocalStorage,
    parseSessionStorage,
} from '@zeal/domains/Storage/helpers/fromLocalStorage'
import { toLocalStorage } from '../helpers/toLocalStorage'
import { postUserEvent } from 'src/domains/UserEvents/api/postUserEvent'
import { parse as parseJSON } from '@zeal/toolkit/JSON/index'
import { string } from '@zeal/toolkit/Result'
import { NetworkMap } from '@zeal/domains/Network'
import { getPredefinedNetworkMap } from '@zeal/domains/Network/helpers/getPredefinedNetworkMap'

const INSTALL_ID_STORE_KEY = 'installationId'

const getLocalStorage = async (): Promise<Storage | null> => {
    const extensionStorage =
        string(
            await chrome.storage.local.get(LS_KEY).then((data) => data[LS_KEY])
        )
            .andThen(parseJSON)
            .andThen(parseLocalStorage)
            .getSuccessResult() || null

    if (!extensionStorage) {
        const oldStorage =
            string(localStorage.getItem(LS_KEY))
                .andThen(parseJSON)
                .andThen(parseLocalStorage)
                .getSuccessResult() || null

        if (oldStorage) {
            await toLocalStorage(oldStorage)
            window.localStorage.clear()
            return oldStorage
        }
    }

    return extensionStorage
}

export const fetchStorage = async (): Promise<{
    storage: Storage | null
    sessionPassword: string | null
    installationId: string
    networkMap: NetworkMap
}> => {
    const storage = await getLocalStorage()

    const sessionStorage = parseSessionStorage(
        await chrome.storage.session.get('password')
    ).getSuccessResult()

    const ls = await chrome.storage.local.get(INSTALL_ID_STORE_KEY)
    let installationId = ls[INSTALL_ID_STORE_KEY]
    if (!installationId) {
        installationId = crypto.randomUUID()
        await chrome.storage.local.set({
            [INSTALL_ID_STORE_KEY]: installationId,
        })
        postUserEvent({
            type: 'WalletInstalledEvent',
            installationId,
        })
        chrome.runtime.setUninstallURL(
            `https://www.zeal.app/uninstall-survey?i=${installationId}`
        )
    }

    const networkMap = {
        ...getPredefinedNetworkMap(),
        ...storage?.customNetworkMap,
    }

    return {
        storage,
        sessionPassword: sessionStorage?.password || null,
        installationId,
        networkMap,
    }
}
