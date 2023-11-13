import {
    AccountsChangeMsg,
    ChangeIframeSizeMessage,
    ContentScriptToInPageScript,
    ContentScriptToZwidget,
    Disconnect,
    Drag,
    InitProviderMsg,
    InPageToContentScriptMessage,
    NetworkChangeMsg,
    ProviderAnnouncementMsg,
    RPCRequestMsg,
    RPCResponse,
    SelectMetaMaskProvider,
    SwitchToZealProvider,
    ZwidgetConnectedToMetaMask,
    ZwidgetReadyMsg,
    ZwidgetToContentScript,
} from '@zeal/domains/Main'
import {
    match,
    nullableOf,
    number,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
    ValidObject,
} from '@zeal/toolkit/Result'
import { notReachable } from '@zeal/toolkit'

const parseRPCRequestMsg = (
    input: ValidObject
): Result<unknown, RPCRequestMsg> =>
    shape({
        type: match(input.type, 'rpc_request'),
        request: object(input.request).andThen((o) =>
            shape({
                id: number(o.id),
                method: success(o.method),
                params: success(o.params),
            })
        ),
    })

const parseRPCResponse = (
    input: ValidObject
): Result<unknown, RPCResponse<unknown, unknown>> =>
    shape({
        type: match(input.type, 'rpc_response'),
        id: number(input.id),
        response: object(input.response).andThen((o) =>
            oneOf([
                shape({
                    type: match(o.type, 'success'),
                    data: success(o.data),
                }),
                shape({
                    type: match(o.type, 'failure'),
                    reason: success(o.reason),
                }),
            ])
        ),
    })

const parseChangeIframeSizeMessage = (
    input: ValidObject
): Result<unknown, ChangeIframeSizeMessage> =>
    shape({
        type: match(input.type, 'change_iframe_size'),
        size: oneOf([
            match(input.size, 'icon'),
            match(input.size, 'small'),
            match(input.size, 'large'),
            match(input.size, 'large_with_full_screen_takeover'),
        ]),
    })

const parseAccountsChangeMsg = (
    input: ValidObject
): Result<unknown, AccountsChangeMsg> =>
    shape({
        type: match(input.type, 'account_change'),
        account: string(input.account),
    })

const parseNetworkChangeMsg = (
    input: ValidObject
): Result<unknown, NetworkChangeMsg> =>
    shape({
        type: match(input.type, 'network_change'),
        chainId: string(input.chainId),
    })

const parseDisconnect = (input: ValidObject): Result<unknown, Disconnect> =>
    shape({
        type: match(input.type, 'disconnect'),
    })

const parseDrag = (input: ValidObject): Result<unknown, Drag> =>
    shape({
        type: match(input.type, 'drag'),
        movement: object(input.movement).andThen((mov) =>
            shape({
                x: number(mov.x),
                y: number(mov.y),
            })
        ),
    })

const parseInitProviderMsg = (
    input: ValidObject
): Result<unknown, InitProviderMsg> =>
    shape({
        type: match(input.type, 'init_provider'),
        account: nullableOf(input.account, string),
        chainId: string(input.chainId),
    })

const parseSelectMetaMaskProvider = (
    input: ValidObject
): Result<unknown, SelectMetaMaskProvider> =>
    shape({
        type: match(input.type, 'select_meta_mask_provider'),
        id: number(input.id),
        ethRequestAccounts: object(input.ethRequestAccounts).andThen((req) =>
            shape({
                method: oneOf([
                    match(req.method, 'eth_requestAccounts'),
                    match(req.method, 'eth_accounts'),
                ]),
                params: success([] as []),
            })
        ),
    })

const parseSwitchToZealProvider = (
    input: ValidObject
): Result<unknown, SwitchToZealProvider> =>
    shape({
        type: match(input.type, 'switch_to_zeal_provider_requested'),
        account: string(input.account),
        chainId: string(input.chainId),
    })

const parseProviderAnnouncementMsg = (
    input: ValidObject
): Result<unknown, ProviderAnnouncementMsg> =>
    shape({
        type: match(input.type, 'provider_announcement_msg'),
        provider: oneOf([
            match(input.provider, 'metamask'),
            match(input.provider, 'provider_unavailable'),
        ]),
    })

const parseZwidgetConnectedToMetaMask = (
    input: ValidObject
): Result<unknown, ZwidgetConnectedToMetaMask> =>
    shape({
        type: match(input.type, 'zwidget_connected_to_meta_mask'),
    })

const parseZwidgetReadyMsg = (
    input: ValidObject
): Result<unknown, ZwidgetReadyMsg> =>
    shape({
        type: match(input.type, 'ready'),
    })

const zwidgetToContentScript: ZwidgetToContentScript<unknown, unknown> = {
    type: 'ready',
} as ZwidgetToContentScript<unknown, unknown>

switch (zwidgetToContentScript.type) {
    case 'disconnect':
    case 'rpc_response':
    case 'change_iframe_size':
    case 'account_change':
    case 'network_change':
    case 'drag':
    case 'init_provider':
    case 'select_meta_mask_provider':
    case 'switch_to_zeal_provider_requested':
    case 'zwidget_connected_to_meta_mask':
    case 'ready':
        // do not forget to add parser when extending ZwidgetToContentScript
        break
    /* istanbul ignore next */
    default:
        notReachable(zwidgetToContentScript)
}

export const parseZwidgetToContentScript = (
    input: unknown
): Result<unknown, ZwidgetToContentScript<unknown, unknown>> =>
    object(input).andThen((obj) =>
        oneOf([
            parseZwidgetReadyMsg(obj),
            parseZwidgetConnectedToMetaMask(obj),
            parseSwitchToZealProvider(obj),
            parseRPCResponse(obj),
            parseChangeIframeSizeMessage(obj),
            parseAccountsChangeMsg(obj),
            parseNetworkChangeMsg(obj),
            parseDisconnect(obj),
            parseDrag(obj),
            parseInitProviderMsg(obj),
            parseSelectMetaMaskProvider(obj),
        ])
    )

const contentScriptToInPageScript: ContentScriptToInPageScript<
    unknown,
    unknown
> = {
    type: 'disconnect',
} as ContentScriptToInPageScript<unknown, unknown>

switch (contentScriptToInPageScript.type) {
    case 'disconnect':
    case 'rpc_response':
    case 'account_change':
    case 'network_change':
    case 'init_provider':
    case 'select_meta_mask_provider':
    case 'switch_to_zeal_provider_requested':
    case 'zwidget_connected_to_meta_mask':
    case 'rpc_request':
    case 'provider_announcement_msg':
        // don't forget to add parser
        break
    /* istanbul ignore next */
    default:
        notReachable(contentScriptToInPageScript)
}

export const parseContentScriptToInPageScript = (
    input: unknown
): Result<unknown, ContentScriptToInPageScript<unknown, unknown>> =>
    object(input).andThen((obj) =>
        oneOf([
            parseRPCResponse(obj),
            parseAccountsChangeMsg(obj),
            parseNetworkChangeMsg(obj),
            parseDisconnect(obj),
            parseInitProviderMsg(obj),
            parseSelectMetaMaskProvider(obj),
            parseSwitchToZealProvider(obj),
            parseZwidgetConnectedToMetaMask(obj),
            parseSwitchToZealProvider(obj),
            parseInPageToContentScriptMessage(obj),
        ])
    )

const inPageToContentScriptMessage: InPageToContentScriptMessage = {
    type: 'provider_announcement_msg',
    provider: 'metamask',
} as InPageToContentScriptMessage

switch (inPageToContentScriptMessage.type) {
    case 'rpc_request':
    case 'provider_announcement_msg':
        // dont forget to update parsers
        break
    /* istanbul ignore next */
    default:
        notReachable(inPageToContentScriptMessage)
}

export const parseInPageToContentScriptMessage = (
    input: unknown
): Result<unknown, InPageToContentScriptMessage> =>
    object(input).andThen((obj) =>
        oneOf([parseRPCRequestMsg(obj), parseProviderAnnouncementMsg(obj)])
    )

export const parseContentScriptToZwidget = (
    input: unknown
): Result<unknown, ContentScriptToZwidget> =>
    object(input).andThen((obj) =>
        oneOf([parseRPCRequestMsg(obj), parseProviderAnnouncementMsg(obj)])
    )
