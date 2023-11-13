import { v4 as uuid } from 'uuid'

import { injectInpageScript } from './injectInpageScript'
import { findRootWindow } from '@zeal/toolkit/Window'

export type IFrameToParentHandshake = {
    type: 'iframe-to-parent-handshake'
    id: string
}

export type ParentToIframeHandshake = {
    type: 'parent-to-iframe-handshake'
    childId: string
    parentId: string
}

export const parseIFrameToParentHandshake = (
    msg: unknown
): IFrameToParentHandshake | null => {
    if (
        msg &&
        typeof msg === 'object' &&
        'type' in msg &&
        typeof msg.type === 'string' &&
        msg.type === 'iframe-to-parent-handshake' &&
        'id' in msg &&
        typeof msg.id === 'string'
    ) {
        return {
            type: 'iframe-to-parent-handshake',
            id: msg.id,
        }
    }

    return null
}

const parseParentToIFrameHandshake = (
    msg: unknown
): ParentToIframeHandshake | null => {
    if (
        msg &&
        typeof msg === 'object' &&
        'type' in msg &&
        typeof msg.type === 'string' &&
        msg.type === 'parent-to-iframe-handshake' &&
        'parentId' in msg &&
        typeof msg.parentId === 'string' &&
        'childId' in msg &&
        typeof msg.childId === 'string'
    ) {
        return {
            type: 'parent-to-iframe-handshake',
            childId: msg.childId,
            parentId: msg.parentId,
        }
    }

    return null
}

type Params = {
    window: Window
}

export const initIFrameProviderConnection = ({ window }: Params): void => {
    const auxId = uuid()
    const rootWindow = findRootWindow(window)

    const initListener = (message: MessageEvent<any>) => {
        if (message.origin === rootWindow.origin) {
            const parentMessage = parseParentToIFrameHandshake(message.data)

            if (parentMessage && parentMessage.childId === auxId) {
                window.removeEventListener('message', initListener)
                injectInpageScript({ window, id: parentMessage.parentId })
            }
        }
    }

    window.addEventListener('message', initListener)

    rootWindow.postMessage({
        type: 'iframe-to-parent-handshake',
        id: auxId,
    } as IFrameToParentHandshake)
}
