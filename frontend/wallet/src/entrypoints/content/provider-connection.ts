import { v4 as generateId } from 'uuid'
import {
    ContentScriptToZwidget,
    InPageToContentScriptMessage,
} from '@zeal/domains/Main'

import {
    ParentToIframeHandshake,
    parseIFrameToParentHandshake,
} from './initIFrameProviderConnection'

import { injectInpageScript } from './injectInpageScript'
import { notReachable } from '@zeal/toolkit'
import { EXTENSION_URL } from '@zeal/domains/Main/constants'
import { joinURL } from '@zeal/toolkit/URL/joinURL'
import {
    parseInPageToContentScriptMessage,
    parseZwidgetToContentScript,
} from 'src/domains/Main/parsers/parseZwidgetContentMsgs'

export const initProviderConnection = (): void => {
    const LS_KEY = 'zeal_widget'

    const savedState = JSON.parse(localStorage.getItem(LS_KEY) || '{}')

    const id = generateId()

    let messageBufferUntilReady: InPageToContentScriptMessage[] = []

    const bcm = new BroadcastChannel(id)
    let zwidgetContentWindow: Window | null = null

    bcm.addEventListener('message', (e: MessageEvent<unknown>) => {
        const parsed = parseInPageToContentScriptMessage(e.data)
        switch (parsed.type) {
            case 'Failure':
                // eslint-disable-next-line no-console
                console.error(parsed.reason)
                break
            case 'Success':
                const message = parsed.data
                if (zwidgetContentWindow) {
                    switch (message.type) {
                        case 'rpc_request':
                        case 'provider_announcement_msg':
                            send(zwidgetContentWindow, message)
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(message)
                    }
                } else {
                    messageBufferUntilReady.push(message)
                }
                break
            /* istanbul ignore next */
            default:
                return notReachable(parsed)
        }
    })

    injectInpageScript({ id, window })

    const iframe = document.createElement('iframe')

    const overlay = document.createElement('div')

    overlay.setAttribute(
        'style',
        `
      display: block !important;
      z-index: 999999999 !important;
      position: fixed !important;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgb(26, 54, 75, 0.8);
      backdrop-filter: blur(5px);
    `
    )

    const query = new URLSearchParams()
    query.append('dAppUrl', window.location.hostname)
    query.append('type', 'zwidget')

    iframe.allow = 'clipboard-write; hid'

    iframe.src = joinURL(EXTENSION_URL, `zwidget.html?${query.toString()}`)

    iframe.width = '0px'
    iframe.height = '0px'

    iframe.setAttribute(
        'style',
        `display: block !important;
     z-index: 10000000000 !important;
     border: none !important;
     position: fixed !important;
     box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px !important;
     border-radius: 12px !important;
     pointer-events: auto !important;
`.trim()
    )

    iframe.style.width = '0px'
    iframe.style.height = '0px'

    iframe.style.top = `${savedState.top || 100}px`
    iframe.style.right = `${
        savedState.right ? window.innerWidth - savedState.right : 24
    }px`

    window.addEventListener('message', (message: MessageEvent<unknown>) => {
        if (message.source === iframe.contentWindow && iframe.contentWindow) {
            const parsed = parseZwidgetToContentScript(message.data)
            switch (parsed.type) {
                case 'Failure':
                    // report?
                    // eslint-disable-next-line no-console
                    console.error(parsed.reason)
                    break
                case 'Success':
                    const msg = parsed.data
                    switch (msg.type) {
                        case 'disconnect':
                        case 'account_change':
                        case 'rpc_response':
                        case 'network_change':
                        case 'select_meta_mask_provider':
                        case 'init_provider':
                        case 'switch_to_zeal_provider_requested':
                        case 'zwidget_connected_to_meta_mask':
                            bcm.postMessage(msg)
                            break

                        case 'ready':
                            zwidgetContentWindow = iframe.contentWindow
                            messageBufferUntilReady.forEach((msg) => {
                                send(zwidgetContentWindow!, msg)
                            })
                            messageBufferUntilReady = []
                            break

                        case 'drag':
                            iframe.style.top = `${
                                parseInt(iframe.style.top, 10) + msg.movement.y
                            }px`
                            iframe.style.right = `${
                                parseInt(iframe.style.right, 10) -
                                msg.movement.x
                            }px`
                            keepIframeInView(iframe)
                            localStorage.setItem(
                                LS_KEY,
                                JSON.stringify(iframe.getBoundingClientRect())
                            )
                            break
                        case 'change_iframe_size':
                            const size = {
                                width: iframe.width,
                                height: iframe.height,
                            }

                            overlay.remove()

                            switch (msg.size) {
                                case 'icon':
                                    size.width = '36px'
                                    size.height = '36px'
                                    break
                                case 'small':
                                    size.width = '360px'
                                    size.height = '200px'
                                    break
                                case 'large':
                                    size.width = '360px'
                                    size.height = '600px'
                                    break
                                case 'large_with_full_screen_takeover':
                                    size.width = '360px'
                                    size.height = '600px'

                                    window.document.body.append(overlay)

                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(msg.size)
                            }
                            iframe.width = size.width
                            iframe.height = size.height
                            iframe.style.width = size.width
                            iframe.style.height = size.height
                            keepIframeInView(iframe)

                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                    break
                /* istanbul ignore next */
                default:
                    return notReachable(parsed)
            }
        } else {
            const parentMessge = parseIFrameToParentHandshake(message.data)

            if (parentMessge) {
                const source = message.source
                const childId = parentMessge.id

                if (source) {
                    source.postMessage({
                        type: 'parent-to-iframe-handshake',
                        childId,
                        parentId: id,
                    } as ParentToIframeHandshake)
                }
            }
        }
    })

    const keepIframeInView = (iframe: HTMLElement) => {
        const rect = iframe.getBoundingClientRect()
        if (rect.left < 0) {
            iframe.style.right = `${
                parseInt(iframe.style.right, 10) + rect.left - 20
            }px`
        }
        if (rect.bottom >= window.innerHeight) {
            iframe.style.top = `${
                parseInt(iframe.style.top, 10) -
                (rect.bottom - window.innerHeight) -
                20
            }px`
        }

        if (rect.top < 0) {
            iframe.style.top = '20px'
        }

        if (rect.right >= window.innerWidth) {
            iframe.style.right = '20px'
        }
    }

    const observer = new MutationObserver(function () {
        // While we need to insert script asap to compete for window.ethereum object
        // we want to insert iframe to body to have proper rendering
        if (document.body) {
            // It exists now
            document.body.append(iframe)
            keepIframeInView(iframe)
            observer.disconnect()

            // Create new observer for guarding
            if (window.location.href.match(/quickswap.exchange/gi)) {
                const guardObserver = new MutationObserver((mutations) => {
                    const added = mutations
                        .map((mutation) => Array.from(mutation.addedNodes))
                        .flat()

                    const quickSwapModal = added
                        .filter(
                            (item): item is HTMLDivElement =>
                                item instanceof HTMLDivElement
                        )
                        .map((div) =>
                            div.querySelector('.MuiBox-root[tabindex="-1"]')
                        )
                        .find(Boolean)

                    if (quickSwapModal) {
                        quickSwapModal.removeAttribute('tabindex')
                    }
                })

                guardObserver.observe(document.body, { childList: true })
            }
        }
    })

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    })
}

const send = (window: Window, msg: ContentScriptToZwidget): void => {
    window.postMessage(msg, '*')
}
