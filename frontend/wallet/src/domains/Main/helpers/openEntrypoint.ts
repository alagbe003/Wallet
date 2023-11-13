import { Address } from '@zeal/domains/Address'
import { CurrencyId } from '@zeal/domains/Currency'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'

export const openCreateContactPage = () => {
    const url = chrome.runtime.getURL(
        `page_entrypoint.html?type=create_contact`
    )
    window.open(url, '_blank')
}

export const openAddFromHardwareWallet = () => {
    const url = chrome.runtime.getURL(
        `page_entrypoint.html?type=add_from_hardware_wallet`
    )
    window.open(url, '_blank')
}

export const openAddAccountPageTab = () => {
    const url = chrome.runtime.getURL(`page_entrypoint.html?type=add_account`)

    window.open(url, '_blank')
}

export const openOnboardingPageTab = () => {
    const url = chrome.runtime.getURL(`page_entrypoint.html?type=onboarding`)

    window.open(url, '_blank')
}

export const openRecoveryKitSetup = (address: Address) => {
    const url = chrome.runtime.getURL(
        `page_entrypoint.html?type=setup_recovery_kit&address=${address}`
    )
    window.open(url, '_blank')
}

export const openBankTransferPage = () => {
    const url = chrome.runtime.getURL(`page_entrypoint.html?type=bank_transfer`)
    window.open(url, '_blank')
}

export const openKycProcessPage = () => {
    const url = chrome.runtime.getURL(`page_entrypoint.html?type=kyc_process`)
    window.open(url, '_blank')
}

export const openSwap = ({
    fromAddress,
    fromCurrencyId,
}: {
    fromAddress: Address
    fromCurrencyId: CurrencyId | null
}) => {
    const fromCurrencyIdEncoded =
        fromCurrencyId && encodeURIComponent(fromCurrencyId)
    const url = fromCurrencyId
        ? `page_entrypoint.html?type=swap&fromAddress=${fromAddress}&fromCurrencyId=${fromCurrencyIdEncoded}`
        : `page_entrypoint.html?type=swap&fromAddress=${fromAddress}`

    window.open(chrome.runtime.getURL(url), '_blank')
}

export const openBridge = ({
    fromAddress,
    fromCurrencyId,
}: {
    fromAddress: Address
    fromCurrencyId: CurrencyId | null
}) => {
    const fromCurrencyIdEncoded =
        fromCurrencyId && encodeURIComponent(fromCurrencyId)
    const url = fromCurrencyId
        ? `page_entrypoint.html?type=bridge&fromAddress=${fromAddress}&fromCurrencyId=${fromCurrencyIdEncoded}`
        : `page_entrypoint.html?type=bridge&fromAddress=${fromAddress}`

    window.open(chrome.runtime.getURL(url), '_blank')
}

export const openSendERC20 = ({
    fromAddress,
    currencyId,
}: {
    fromAddress: Address
    currencyId: CurrencyId | null
}) => {
    const currencyIdEncoded = currencyId && encodeURIComponent(currencyId)
    const url = currencyId
        ? `page_entrypoint.html?type=send_erc20_token&fromAddress=${fromAddress}&tokenCurrencyId=${currencyIdEncoded}`
        : `page_entrypoint.html?type=send_erc20_token&fromAddress=${fromAddress}`

    window.open(chrome.runtime.getURL(url), '_blank')
}

export const openSendNFT = ({
    fromAddress,
    collection,
    nft,
}: {
    fromAddress: Address
    nft: PortfolioNFT
    collection: PortfolioNFTCollection
}) => {
    const nftId = encodeURIComponent(nft.tokenId)
    const { mintAddress, networkHexId } = collection

    const url = `page_entrypoint.html?type=send_nft&fromAddress=${fromAddress}&nftId=${nftId}&mintAddress=${mintAddress}&networkHexId=${networkHexId}`

    window.open(chrome.runtime.getURL(url), '_blank')
}
