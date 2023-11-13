import { Account, AccountsMap } from '@zeal/domains/Account'
import { ImperativeError } from '@zeal/domains/Error'
import { SendNFT as SendNFTEntrypoint } from '@zeal/domains/Main'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { Flow } from './Flow'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

type Props = {
    accountsMap: AccountsMap
    portfolioMap: PortfolioMap
    customCurrencyMap: CustomCurrencyMap
    keyStoreMap: KeyStoreMap
    sessionPassword: string
    installationId: string
    entryPoint: SendNFTEntrypoint
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof Flow>

const calculateToken = ({
    entryPoint,
    accountsMap,
    portfolioMap,
}: {
    entryPoint: SendNFTEntrypoint
    accountsMap: AccountsMap
    portfolioMap: PortfolioMap
}): {
    fromAccount: Account
    nft: PortfolioNFT
    collection: PortfolioNFTCollection
} => {
    const fromAccount = accountsMap[entryPoint.fromAddress]
    if (!fromAccount) {
        throw new ImperativeError(
            'we try to send token from non existent account'
        )
    }

    const portfolio = portfolioMap[fromAccount.address]
    if (!portfolio) {
        throw new ImperativeError(
            'we try to send token from account that does not have portfolio'
        )
    }

    const collection = portfolio.nftCollections.find((collection) => {
        return (
            collection.networkHexId === entryPoint.networkHexId &&
            collection.mintAddress === entryPoint.mintAddress
        )
    })
    if (!collection) {
        throw new ImperativeError(
            'we try to send NFT but we collection is missing in portfolio'
        )
    }

    const nft = collection.nfts.find((nft) => nft.tokenId === entryPoint.nftId)
    if (!nft) {
        throw new ImperativeError(
            'we try to send NFT but we cannot find NFT in collection'
        )
    }

    return { fromAccount, nft, collection }
}

export const SendNFT = ({
    entryPoint,
    accountsMap,
    customCurrencyMap,
    keyStoreMap,
    portfolioMap,
    sessionPassword,
    installationId,
    networkMap,
    networkRPCMap,
    feePresetMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const { fromAccount, collection, nft } = calculateToken({
        entryPoint,
        accountsMap,
        portfolioMap,
    })

    return (
        <Flow
            currencyHiddenMap={currencyHiddenMap}
            feePresetMap={feePresetMap}
            networkMap={networkMap}
            networkRPCMap={networkRPCMap}
            installationId={installationId}
            collection={collection}
            nft={nft}
            fromAccount={fromAccount}
            customCurrencyMap={customCurrencyMap}
            accountsMap={accountsMap}
            keyStoreMap={keyStoreMap}
            portfolioMap={portfolioMap}
            sessionPassword={sessionPassword}
            onMsg={onMsg}
        />
    )
}
