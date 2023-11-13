// TODO :: consider to move to Entry Point domain

import { LS_KEY } from '@zeal/domains/Storage/constants'

// I'm not sure about this one... but lets see
export const logout = async () => {
    await chrome.storage.local.set({ [LS_KEY]: null })
    await chrome.storage.session.clear()
}

export const lock = async () => {
    await chrome.storage.session.clear()
}
