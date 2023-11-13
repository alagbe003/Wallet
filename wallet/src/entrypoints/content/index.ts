import { initProviderConnection } from './provider-connection'
import { initIFrameProviderConnection } from './initIFrameProviderConnection'
import { notReachable } from '@zeal/toolkit'

type ContentScriptType =
    | { type: 'generic' }
    | { type: 'ignored' }
    | { type: 'iframe-content-script' }

const ignoredHosts = new Set<string>([
    'www.meiamaratonadoporto.com',
    'login.xero.com',
    'connect.trezor.io',
])

const calculateScriptType = (url: string): ContentScriptType => {
    const urlObject = new URL(url)

    if (ignoredHosts.has(urlObject.host)) {
        return { type: 'ignored' }
    }

    if (window.parent !== window) {
        return { type: 'iframe-content-script' }
    } else {
        return { type: 'generic' }
    }
}

const scriptType = calculateScriptType(window.location.href)

switch (scriptType.type) {
    case 'generic':
        initProviderConnection()
        break

    case 'ignored':
        // if site is ignored - we do nothing
        break

    case 'iframe-content-script':
        initIFrameProviderConnection({ window })
        break

    default:
        notReachable(scriptType)
}
