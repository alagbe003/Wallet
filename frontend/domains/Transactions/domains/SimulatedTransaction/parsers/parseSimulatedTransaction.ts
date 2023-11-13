import { parse as parseMoney } from '@zeal/domains/Money/helpers/parse'
import { fromString as parseAddressFromString } from '@zeal/domains/Address/helpers/fromString'

import {
    ApprovalTransaction,
    FailedTransaction,
    NftCollectionApprovalTransaction,
    P2PNFTTransaction,
    P2PTransaction,
    SimulatedTransaction,
    SingleNftApprovalTransaction,
    UnknownTransaction,
    UnknownTransactionToken,
} from '../SimulatedTransaction'

import {
    array,
    combine,
    failure,
    match,
    nullable,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'
import { parseSmartContract } from '@zeal/domains/SmartContract/parsers/parseSmartContract'
import { parseNftCollectionInfo } from '@zeal/domains/NFTCollection/parsers/parseNftCollectionInfo'
import { parseNft } from '@zeal/domains/NFTCollection/parsers/parseNft'
import { components } from '@zeal/api/portfolio'
import {
    parseApprovalAmount,
    parseTransactionNft,
} from '@zeal/domains/Transactions/helpers/parseActivityTransaction'

export const parseSimulatedTransaction = (
    input: unknown
): Result<unknown, SimulatedTransaction> =>
    oneOf([
        parseApprovalTransaction(input),
        parseUnknownTransaction(input),
        parseFailedTransaction(input),
        parseNftCollectionApprovalTransaction(input),
        parseSingleNftApprovalTransaction(input),
        parseP2PTransaction(input),
        parseP2PNFTTransaction(input),
    ])

const parseP2PTransaction = (input: unknown): Result<unknown, P2PTransaction> =>
    object(input).andThen((dto) =>
        shape({
            type: match(dto.type, 'P2PTransaction' as const),
            gas: string(dto.gas),
            token: parseUnknownTransactionToken(dto.token),
            toAddress: string(dto.toAddress).andThen(parseAddressFromString),
        })
    )

const parseP2PNFTTransaction = (
    input: unknown
): Result<unknown, P2PNFTTransaction> =>
    object(input).andThen((dto) =>
        shape({
            type: match(dto.type, 'P2PNftTransaction' as const),
            gas: string(dto.gas),
            nft: parseTransactionNft(dto.nft),
            toAddress: string(dto.toAddress).andThen(parseAddressFromString),
        })
    )

const parseNftCollectionApprovalTransaction = (
    input: unknown
): Result<unknown, NftCollectionApprovalTransaction> =>
    object(input).andThen((dto) =>
        shape({
            type: match(dto.type, 'NftCollectionApprovalTransaction' as const),
            nftCollectionInfo: parseNftCollectionInfo(dto.nftCollectionInfo),
            approveTo: parseSmartContract(dto.approveTo),
            gas: string(dto.gas),
        })
    )

const parseSingleNftApprovalTransaction = (
    input: unknown
): Result<unknown, SingleNftApprovalTransaction> =>
    object(input).andThen((dto) =>
        shape({
            type: match(dto.type, 'SingleNftApprovalTransaction' as const),
            nft: parseNft(dto.nft),
            approveTo: parseSmartContract(dto.approveTo),
            gas: string(dto.gas),
        })
    )

const parseFailedTransaction = (
    input: unknown
): Result<unknown, FailedTransaction> =>
    object(input).andThen((dto) =>
        shape({
            type: match(dto.type, 'FailedTransaction' as const),

            method: string(dto.method),
        })
    )

const parseApprovalTransaction = (
    input: unknown
): Result<unknown, ApprovalTransaction> =>
    object(input).andThen((dto) =>
        shape({
            type: match(dto.type, 'ApprovalTransaction' as const),

            amount: parseApprovalAmount(dto.amount),
            gas: string(dto.gas),
            approveTo: parseSmartContract(dto.approveTo),
        })
    )

type Direction = components['schemas']['TransactionDirection']

const DIRECTION_MAP: Record<Direction, true> = {
    Receive: true,
    Send: true,
}

export const parseUnknownTransactionToken = (
    input: unknown
): Result<unknown, UnknownTransactionToken> =>
    object(input).andThen((obj) =>
        shape({
            direction: string(obj.direction).andThen((direction) =>
                DIRECTION_MAP[direction as Direction]
                    ? success(direction as Direction)
                    : failure({
                          type: 'cannot_parse_token_direction',
                          value: direction,
                      })
            ),
            amount: parseMoney(obj.amount),
            priceInDefaultCurrency: oneOf([
                parseMoney(obj.priceInDefaultCurrency),
                nullable(obj.priceInDefaultCurrency),
            ]),
        })
    )

const parseUnknownTransaction = (
    input: unknown
): Result<unknown, UnknownTransaction> =>
    object(input).andThen((dto) =>
        shape({
            type: match(dto.type, 'UnknownTransaction' as const),

            method: string(dto.method),
            gas: string(dto.gas),
            tokens: array(dto.tokens).andThen((arr) =>
                combine(arr.map(parseUnknownTransactionToken))
            ),
            nfts: array(dto.nfts).andThen((arr) =>
                combine(arr.map(parseTransactionNft))
            ),
        })
    )
