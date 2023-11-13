import { Address } from '@zeal/domains/Address'
import { NetworkHexId } from '@zeal/domains/Network'
import { CurrencyId } from '@zeal/domains/Currency'

export type EntryPoint =
    | AddAccount
    | AddFromHardwareWallet
    | CreateContact
    | Extension
    | Onboarding
    | SendERC20Token
    | SendNFT
    | SetupRecoveryKit
    | ZWidget
    | Swap
    | Bridge
    | BankTransfer
    | KycProcess

export type PageEntrypoint = Exclude<EntryPoint, ZWidget | Extension>

export type OnboardedEntrypoint = Exclude<PageEntrypoint, Onboarding>

export type BankTransfer = {
    type: 'bank_transfer'
}

export type KycProcess = {
    type: 'kyc_process'
}

export type CreateContact = {
    type: 'create_contact'
}

export type AddFromHardwareWallet = {
    type: 'add_from_hardware_wallet'
}

export type Swap = {
    type: 'swap'
    fromAddress: Address
    fromCurrencyId: CurrencyId | null
}

export type Bridge = {
    type: 'bridge'
    fromAddress: Address
    fromCurrencyId: CurrencyId | null
}

export type Onboarding = {
    type: 'onboarding'
}

export type ZWidget = {
    type: 'zwidget'
    dAppUrl: string
}

export type Extension = {
    type: 'extension'
}

export type AddAccount = {
    type: 'add_account'
}

export type SendERC20Token = {
    type: 'send_erc20_token'
    fromAddress: Address
    tokenCurrencyId: CurrencyId | null
}

export type SendNFT = {
    type: 'send_nft'
    fromAddress: Address
    nftId: string
    mintAddress: Address
    networkHexId: NetworkHexId
}

export type SetupRecoveryKit = {
    type: 'setup_recovery_kit'
    address: Address
}

// Messages

export type RPCRequestMsg = {
    type: 'rpc_request'
    request: {
        id: number
        method: unknown
        params: unknown
    }
}

export type RPCResponse<T, E> = {
    type: 'rpc_response'
    id: number
    response: { type: 'success'; data: T } | { type: 'failure'; reason: E } // TODO @max-tern would be nice to use Result API
}

export type Disconnect = {
    type: 'disconnect'
}

export type ChangeIframeSizeMessage = {
    type: 'change_iframe_size'
    size: 'icon' | 'small' | 'large' | 'large_with_full_screen_takeover'
}

export type ReadyMsg = {
    type: 'ready'
}

export type Drag = { type: 'drag'; movement: { x: number; y: number } }

export type NetworkChangeMsg = {
    type: 'network_change'
    chainId: string
}

export type AccountsChangeMsg = {
    type: 'account_change'
    account: string
}

export type InitProviderMsg = {
    type: 'init_provider'
    account: string | null
    chainId: string
}

export type ExtensionAccountChange = {
    type: 'extension_address_change'
    address: string
}

export type ProviderAnnouncementMsg = {
    type: 'provider_announcement_msg'
    provider: AlternativeProvider
}

export type AlternativeProvider = 'metamask' | 'provider_unavailable'

export type SelectMetaMaskProvider = {
    type: 'select_meta_mask_provider'
    id: number
    ethRequestAccounts: {
        method: 'eth_requestAccounts' | 'eth_accounts'
        params: []
    }
}

export type ZwidgetConnectedToMetaMask = {
    type: 'zwidget_connected_to_meta_mask'
}

export type SwitchToZealProvider = {
    type: 'switch_to_zeal_provider_requested'
    account: string
    chainId: string
}

export type ZwidgetReadyMsg = { type: 'ready' }

export type ExtensionToZWidget = ExtensionAccountChange

export type InPageToContentScriptMessage =
    | RPCRequestMsg
    | ProviderAnnouncementMsg

export type ContentScriptToZwidget = RPCRequestMsg | ProviderAnnouncementMsg

export type ZwidgetToContentScript<T, E> =
    | RPCResponse<T, E>
    | ChangeIframeSizeMessage
    | AccountsChangeMsg
    | NetworkChangeMsg
    | Disconnect
    | Drag
    | InitProviderMsg
    | SelectMetaMaskProvider
    | SwitchToZealProvider
    | ZwidgetConnectedToMetaMask
    | ZwidgetReadyMsg

export type ContentScriptToInPageScript<T, E> =
    | RPCResponse<T, E>
    | AccountsChangeMsg
    | NetworkChangeMsg
    | Disconnect
    | InitProviderMsg
    | SelectMetaMaskProvider
    | SwitchToZealProvider
    | ZwidgetConnectedToMetaMask
    // we can have quite few iframes on the page hence any message then sent to bcm will be received in the in-page listener
    | InPageToContentScriptMessage
