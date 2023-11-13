import { fromString as parseAddressFromString } from '@zeal/domains/Address/helpers/fromString'
import { parse as parseMoney } from '@zeal/domains/Money/helpers/parse'
import { parse as parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'
import {
    ActivityTransaction,
    ApprovalAmount,
    Common,
    Erc20ApprovalActivityTransaction,
    Erc20ApprovalRevokeActivityTransaction,
    FailedActivityTransaction,
    InboundP2PActivityTransaction,
    NftCollectionApprovalActivityTransaction,
    NftCollectionApprovalRevokeActivityTransaction,
    OutboundP2PActivityTransaction,
    OutboundP2PNftActivityTransaction,
    PaidFee,
    PartialTokenApprovalActivityTransaction,
    SelfP2PActivityTransaction,
    SingleNftApprovalActivityTransaction,
    SingleNftApprovalRevokeActivityTransaction,
    TransactionNft,
    TransactionToken,
    UnknownActivityTransaction,
} from '@zeal/domains/Transactions'
import {
    array,
    bigint,
    combine,
    failure,
    match,
    nullable,
    nullableOf,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
    timeEpochMs,
} from '@zeal/toolkit/Result'
import { parseNft } from '@zeal/domains/NFTCollection/parsers/parseNft'
import { parseSmartContract } from '@zeal/domains/SmartContract/parsers/parseSmartContract'
import { parseNftCollectionInfo } from '@zeal/domains/NFTCollection/parsers/parseNftCollectionInfo'

export const parseActivityTransaction = (
    input: unknown
): Result<unknown, ActivityTransaction> =>
    oneOf([
        parseInboundP2PActivityTransaction(input),
        parseOutboundP2PActivityTransaction(input),
        parseOutboundP2PNftActivityTransaction(input),
        parseSelfP2PActivityTransaction(input),
        parseSingleNftApprovalActivityTransaction(input),
        parseSingleNftApprovalRevokeActivityTransaction(input),
        parseNftCollectionApprovalActivityTransaction(input),
        parseNftCollectionApprovalRevokeActivityTransaction(input),
        parseErc20ApprovalActivityTransaction(input),
        parseErc20ApprovalRevokeActivityTransaction(input),
        oneOf([
            parsePartialTokenApprovalActivityTransaction(input),
            parseUnknownActivityTransaction(input),
            parseFailedActivityTransaction(input),
        ]),
    ])

const parseInboundP2PActivityTransaction = (
    input: unknown
): Result<unknown, InboundP2PActivityTransaction> =>
    object(input).andThen((obj) =>
        shape({
            type: match(obj.type, 'InboundP2PActivityTransaction' as const),
            tokens: array(obj.tokens).andThen((arr) =>
                combine(arr.map(parseTransactionToken))
            ),
            nfts: array(obj.nfts).andThen((arr) =>
                combine(arr.map(parseTransactionNft))
            ),
            sender: string(obj.sender).andThen(parseAddressFromString),
            networkHexId: oneOf([
                parseNetworkHexId(obj.network),
                parseNetworkHexId(obj.networkHexId),
            ]),
            hash: string(obj.hash),
            timestamp: timeEpochMs(obj.timestamp),
        })
    )

const parseOutboundP2PActivityTransaction = (
    input: unknown
): Result<unknown, OutboundP2PActivityTransaction> =>
    object(input).andThen((obj) =>
        shape({
            type: match(obj.type, 'OutboundP2PActivityTransaction' as const),
            token: parseTransactionToken(obj.token),
            receiver: string(obj.receiver).andThen(parseAddressFromString),
            common: parseCommon(obj),
        }).map((parsed) => ({
            type: parsed.type,
            token: parsed.token,
            receiver: parsed.receiver,
            ...parsed.common,
        }))
    )

const parseOutboundP2PNftActivityTransaction = (
    input: unknown
): Result<unknown, OutboundP2PNftActivityTransaction> =>
    object(input).andThen((obj) =>
        shape({
            type: match(obj.type, 'OutboundP2PNftActivityTransaction' as const),
            nft: parseTransactionNft(obj.nft),
            receiver: string(obj.receiver).andThen(parseAddressFromString),
            common: parseCommon(obj),
        }).map((parsed) => ({
            type: parsed.type,
            nft: parsed.nft,
            receiver: parsed.receiver,
            ...parsed.common,
        }))
    )

const parseSelfP2PActivityTransaction = (
    input: unknown
): Result<unknown, SelfP2PActivityTransaction> =>
    object(input).andThen((obj) =>
        shape({
            type: match(obj.type, 'SelfP2PActivityTransaction' as const),
            common: parseCommon(obj),
        }).map((parsed) => ({
            type: parsed.type,
            ...parsed.common,
        }))
    )

const parseSingleNftApprovalActivityTransaction = (
    input: unknown
): Result<unknown, SingleNftApprovalActivityTransaction> =>
    object(input).andThen((obj) =>
        shape({
            type: match(
                obj.type,
                'SingleNftApprovalActivityTransaction' as const
            ),
            nft: parseNft(obj.nft),
            approveTo: parseSmartContract(obj.approveTo),
            common: parseCommon(obj),
        }).map((parsed) => ({
            type: parsed.type,
            nft: parsed.nft,
            approveTo: parsed.approveTo,
            ...parsed.common,
        }))
    )

const parseSingleNftApprovalRevokeActivityTransaction = (
    input: unknown
): Result<unknown, SingleNftApprovalRevokeActivityTransaction> =>
    object(input).andThen((obj) =>
        shape({
            type: match(
                obj.type,
                'SingleNftApprovalRevokeActivityTransaction' as const
            ),
            nft: parseNft(obj.nft),
            revokeFrom: parseSmartContract(obj.revokeFrom),
            common: parseCommon(obj),
        }).map((parsed) => ({
            type: parsed.type,
            nft: parsed.nft,
            revokeFrom: parsed.revokeFrom,
            ...parsed.common,
        }))
    )

const parseNftCollectionApprovalActivityTransaction = (
    input: unknown
): Result<unknown, NftCollectionApprovalActivityTransaction> =>
    object(input).andThen((obj) =>
        shape({
            type: match(
                obj.type,
                'NftCollectionApprovalActivityTransaction' as const
            ),
            nftCollectionInfo: parseNftCollectionInfo(obj.nftCollectionInfo),
            approveTo: parseSmartContract(obj.approveTo),
            common: parseCommon(obj),
        }).map((parsed) => ({
            type: parsed.type,
            nftCollectionInfo: parsed.nftCollectionInfo,
            approveTo: parsed.approveTo,
            ...parsed.common,
        }))
    )

const parseNftCollectionApprovalRevokeActivityTransaction = (
    input: unknown
): Result<unknown, NftCollectionApprovalRevokeActivityTransaction> =>
    object(input).andThen((obj) =>
        shape({
            type: match(
                obj.type,
                'NftCollectionApprovalRevokeActivityTransaction' as const
            ),
            nftCollectionInfo: parseNftCollectionInfo(obj.nftCollectionInfo),
            revokeFrom: parseSmartContract(obj.revokeFrom),
            common: parseCommon(obj),
        }).map((parsed) => ({
            type: parsed.type,
            nftCollectionInfo: parsed.nftCollectionInfo,
            revokeFrom: parsed.revokeFrom,
            ...parsed.common,
        }))
    )

const parseErc20ApprovalActivityTransaction = (
    input: unknown
): Result<unknown, Erc20ApprovalActivityTransaction> =>
    object(input).andThen((obj) =>
        shape({
            type: match(obj.type, 'Erc20ApprovalActivityTransaction' as const),
            approveTo: parseSmartContract(obj.approveTo),
            allowance: parseApprovalAmount(obj.allowance),
            common: parseCommon(obj),
        }).map((parsed) => ({
            type: parsed.type,
            approveTo: parsed.approveTo,
            allowance: parsed.allowance,
            ...parsed.common,
        }))
    )

const parseErc20ApprovalRevokeActivityTransaction = (
    input: unknown
): Result<unknown, Erc20ApprovalRevokeActivityTransaction> =>
    object(input).andThen((obj) =>
        shape({
            type: match(
                obj.type,
                'Erc20ApprovalRevokeActivityTransaction' as const
            ),
            revokeFrom: parseSmartContract(obj.revokeFrom),
            allowance: parseApprovalAmount(obj.allowance),
            common: parseCommon(obj),
        }).map((parsed) => ({
            type: parsed.type,
            revokeFrom: parsed.revokeFrom,
            allowance: parsed.allowance,
            ...parsed.common,
        }))
    )

const parsePartialTokenApprovalActivityTransaction = (
    input: unknown
): Result<unknown, PartialTokenApprovalActivityTransaction> =>
    object(input).andThen((obj) =>
        shape({
            type: match(
                obj.type,
                'PartialTokenApprovalActivityTransaction' as const
            ),
            approveTo: parseSmartContract(obj.approveTo),
            common: parseCommon(obj),
        }).map((parsed) => ({
            type: parsed.type,
            approveTo: parsed.approveTo,
            ...parsed.common,
        }))
    )

const parseUnknownActivityTransaction = (
    input: unknown
): Result<unknown, UnknownActivityTransaction> =>
    object(input).andThen((obj) =>
        shape({
            type: match(obj.type, 'UnknownActivityTransaction' as const),
            method: string(obj.method),
            smartContract: parseSmartContract(obj.smartContract),
            tokens: array(obj.tokens).andThen((arr) =>
                combine(arr.map(parseTransactionToken))
            ),
            nfts: array(obj.nfts).andThen((arr) =>
                combine(arr.map(parseTransactionNft))
            ),
            common: parseCommon(obj),
        }).map((parsed) => ({
            type: parsed.type,
            method: parsed.method,
            smartContract: parsed.smartContract,
            tokens: parsed.tokens,
            nfts: parsed.nfts,
            ...parsed.common,
        }))
    )

const parseFailedActivityTransaction = (
    input: unknown
): Result<unknown, FailedActivityTransaction> =>
    object(input).andThen((obj) =>
        shape({
            type: match(obj.type, 'FailedActivityTransaction' as const),
            method: string(obj.method),
            smartContract: parseSmartContract(obj.smartContract),
            common: parseCommon(obj),
        }).map((parsed) => ({
            type: parsed.type,
            method: parsed.method,
            smartContract: parsed.smartContract,
            ...parsed.common,
        }))
    )

const parseCommon = (input: unknown): Result<unknown, Common> =>
    object(input).andThen((obj) =>
        shape({
            networkHexId: parseNetworkHexId(obj.network),
            hash: string(obj.hash),
            timestamp: timeEpochMs(obj.timestamp),
            paidFee: nullableOf(obj.paidFee, parsePaidFee),
        })
    )

const parsePaidFee = (input: unknown): Result<unknown, PaidFee> =>
    object(input).andThen((obj) =>
        shape({
            priceInNativeCurrency: parseMoney(obj.priceInNativeCurrency),
            priceInDefaultCurrency: nullableOf(
                obj.priceInDefaultCurrency,
                parseMoney
            ),
        })
    )

const parseTransactionToken = (
    input: unknown
): Result<unknown, TransactionToken> =>
    object(input).andThen((obj) =>
        shape({
            type: success('transaction_token' as const),
            direction: parseDirection(obj.direction),
            amount: parseMoney(obj.amount),
            priceInDefaultCurrency: oneOf([
                // TODO For history this field is not coming. We should consider total separation of History transaction (including transaction token) from preparation
                parseMoney(obj.priceInDefaultCurrency),
                nullable(obj.priceInDefaultCurrency),
            ]),
        })
    )

export const parseTransactionNft = (
    input: unknown
): Result<unknown, TransactionNft> =>
    object(input).andThen((obj) =>
        shape({
            type: success('transaction_nft' as const),
            direction: parseDirection(obj.direction),
            amount: bigint(obj.amount),
            nft: parseNft(obj.nft),
        })
    )

export const parseApprovalAmount = (
    input: unknown
): Result<unknown, ApprovalAmount> =>
    object(input).andThen((dto) =>
        oneOf([
            shape({
                type: match(dto.type, 'Limited' as const),
                amount: parseMoney(dto.amount),
            }),
            shape({
                type: match(dto.type, 'Unlimited' as const),
                amount: parseMoney(dto.amount),
            }),
        ])
    )

const TRANSACTION_TOKEN_DIRECTION_MAP: Record<
    TransactionToken['direction'],
    true
> = {
    Send: true,
    Receive: true,
}

const parseDirection = (
    input: unknown
): Result<unknown, TransactionToken['direction']> =>
    string(input).andThen((key) =>
        TRANSACTION_TOKEN_DIRECTION_MAP[key as TransactionToken['direction']]
            ? success(key as TransactionToken['direction'])
            : failure({
                  type: 'cannot_parse_transaction_token_direction',
                  value: key,
              })
    )
