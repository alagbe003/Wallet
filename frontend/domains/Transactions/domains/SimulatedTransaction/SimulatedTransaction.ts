import { components } from '@zeal/api/portfolio'
import { Money } from '@zeal/domains/Money'
import { SmartContract } from '@zeal/domains/SmartContract'
import { BridgeRoute } from '@zeal/domains/Currency/domains/Bridge'
import { Nft, NftCollectionInfo } from '@zeal/domains/NFTCollection'
import { WithdrawalRequest } from '@zeal/domains/Currency/domains/BankTransfer'
import { Address } from '@zeal/domains/Address'
import { ApprovalAmount, TransactionNft } from '@zeal/domains/Transactions'

export type SimulatedTransaction =
    | ApprovalTransaction
    | UnknownTransaction
    | FailedTransaction
    | SingleNftApprovalTransaction
    | NftCollectionApprovalTransaction
    | P2PTransaction
    | P2PNFTTransaction
    | BridgeTrx
    | WithdrawalTrx

export type WithdrawalTrx = {
    type: 'WithdrawalTrx'
    withdrawalRequest: WithdrawalRequest
}

export type BridgeTrx = {
    type: 'BridgeTrx'
    bridgeRoute: BridgeRoute
}

// TODO ideally part of Openapi, now is mapped?
export type ApprovalTransaction = {
    type: 'ApprovalTransaction'
    amount: ApprovalAmount
    approveTo: SmartContract
}

// TODO ideally part of Openapi, now is mapped?
export type UnknownTransaction = {
    type: 'UnknownTransaction'
    method: string
    tokens: UnknownTransactionToken[]
    nfts: TransactionNft[]
}

// TODO Remove nonce omit once everything is deployed
export type FailedTransaction = Omit<
    components['schemas']['FailedTransaction'],
    'nonce' | 'gas'
>

export type P2PTransaction = {
    type: 'P2PTransaction'
    token: UnknownTransactionToken
    toAddress: Address
}

export type P2PNFTTransaction = {
    type: 'P2PNftTransaction'
    nft: TransactionNft
    toAddress: Address
}

// TODO Remove nonce omit once everything is deployed
export type SingleNftApprovalTransaction = Omit<
    components['schemas']['SingleNftApprovalTransaction'],
    'nonce' | 'gas' | 'approveTo' | 'nft'
> & {
    approveTo: SmartContract
    nft: Nft
}

// TODO Remove nonce omit once everything is deployed
export type NftCollectionApprovalTransaction = Omit<
    components['schemas']['NftCollectionApprovalTransaction'],
    'nonce' | 'gas' | 'nftCollectionInfo' | 'approveTo'
> & {
    nftCollectionInfo: NftCollectionInfo
    approveTo: SmartContract
}

/**
 * It might look same as TransactionToken, but it renders little different
 * and also have priceInDefaultCurrency not optional
 */
export type UnknownTransactionToken = {
    direction: 'Send' | 'Receive'
    amount: Money
    priceInDefaultCurrency: Money | null
}
