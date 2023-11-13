import { parse as parseAccount } from '@zeal/domains/Account/helpers/parse'
import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'
import { parseIndexKey } from '@zeal/domains/Address/helpers/parseIndexKey'
import { parseCryptoCurrency } from '@zeal/domains/Currency/helpers/parse'
import { parse } from '@zeal/domains/KeyStore/parsers/parse'
import { parse as parsePortfolio } from '@zeal/domains/Portfolio/helpers/parse'
import { Storage } from '@zeal/domains/Storage'
import { parseDAppConnectionState } from '@zeal/domains/Storage/domains/DAppConnectionState'
import { parseSubmitted } from '@zeal/domains/TransactionRequest/parsers/parseTransactionRequest'
import {
    array,
    boolean,
    groupByType,
    match,
    nullable,
    number,
    object,
    oneOf,
    parseDate,
    record,
    recordStrict,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'
import { v4 as uuid } from 'uuid'
import { parseBridgeSubmitted } from '@zeal/domains/Currency/domains/Bridge/parsers/parseBridgeSubmitted'
import { parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'
import { parseBankTransferInfo } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseBankTransferInfo'
import { parseSubmittedOfframpTransaction } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseSubmittedWithdrawalTransaction'

export const parseLocalStorage = (input: unknown): Result<unknown, Storage> => {
    return object(input).andThen((obj) =>
        shape({
            currencyHiddenMap: oneOf([
                object(obj.currencyHiddenMap).andThen((currencyHiddenMap) =>
                    recordStrict(currencyHiddenMap, {
                        keyParser: string,
                        valueParser: boolean,
                    })
                ),
                success({}),
            ]),
            currencyPinMap: oneOf([
                object(obj.currencyPinMap).andThen((currencyPinMap) =>
                    recordStrict(currencyPinMap, {
                        keyParser: string,
                        valueParser: boolean,
                    })
                ),
                success({}),
            ]),
            isOnboardingStorySeen: oneOf([
                boolean(obj.isOnboardingStorySeen),
                success(false),
            ]),
            feePresetMap: oneOf([
                object(obj.feePresetMap).andThen((obj) =>
                    recordStrict(obj, {
                        keyParser: parseNetworkHexId,
                        valueParser: (preset) =>
                            object(preset).andThen((presetObj) =>
                                oneOf([
                                    shape({
                                        type: match(
                                            presetObj.type,
                                            'Slow' as const
                                        ),
                                    }),
                                    shape({
                                        type: match(
                                            presetObj.type,
                                            'Normal' as const
                                        ),
                                    }),
                                    shape({
                                        type: match(
                                            presetObj.type,
                                            'Fast' as const
                                        ),
                                    }),
                                ])
                            ),
                    })
                ),
                success({}),
            ]),
            customNetworkMap: oneOf([
                object(obj.customNetworkMap).andThen((obj) =>
                    recordStrict(obj, {
                        keyParser: string,
                        valueParser: (customNetwork) =>
                            object(customNetwork).andThen((customNetwork) =>
                                shape({
                                    type: success('custom' as const),
                                    name: string(customNetwork.name),
                                    nativeCurrency: object(
                                        customNetwork.nativeCurrency
                                    ).andThen(parseCryptoCurrency),
                                    hexChainId: parseNetworkHexId(
                                        customNetwork.hexChainId
                                    ),
                                    blockExplorerUrl: string(
                                        customNetwork.blockExplorerUrl
                                    ),
                                    defaultRpcUrl: oneOf([
                                        string(customNetwork.defaultRpcUrl),
                                        string(customNetwork.rpcUrl),
                                    ]),
                                    rpcUrl: string(customNetwork.rpcUrl),
                                    isSimulationSupported: success(
                                        false as const
                                    ),
                                    isZealRPCSupported: success(false as const),
                                    trxType: oneOf([
                                        match(
                                            customNetwork.trxType,
                                            'legacy' as const
                                        ),
                                        match(
                                            customNetwork.trxType,
                                            'eip1559' as const
                                        ),
                                    ]),
                                })
                            ),
                    })
                ),
                success({}),
            ]),
            networkRPCMap: oneOf([
                object(obj.networkRPCMap).andThen((obj) =>
                    recordStrict(obj, {
                        keyParser: string,
                        valueParser: (networkRPC) =>
                            object(networkRPC).andThen((networkRPC) =>
                                shape({
                                    current: object(networkRPC.current).andThen(
                                        (current) =>
                                            oneOf([
                                                shape({
                                                    type: match(
                                                        current.type,
                                                        'default' as const
                                                    ),
                                                }),
                                                shape({
                                                    type: match(
                                                        current.type,
                                                        'custom' as const
                                                    ),
                                                    url: string(current.url),
                                                }),
                                            ])
                                    ),

                                    available: array(
                                        networkRPC.available
                                    ).andThen((arr) => {
                                        const [, parsed] = groupByType(
                                            arr.map(string)
                                        )
                                        return success(parsed)
                                    }),
                                })
                            ),
                    })
                ),
                success({}),
            ]),
            selectedAddress: oneOf([
                parseAddress(obj.selectedAddress),
                nullable(obj.selectedAddress),
            ]),
            fetchedAt: parseDate(obj.fetchedAt),
            accounts: object(obj.accounts)
                .andThen(parseIndexKey)
                .andThen((accounts) => record(accounts, parseAccount)),
            portfolios: oneOf([
                object(obj.portfolios)
                    .andThen(parseIndexKey)
                    .andThen((portfolios) =>
                        record(portfolios, parsePortfolio)
                    ),

                success({}),
            ]),
            keystoreMap: oneOf([parse(obj.keystoreMap), success({})]),
            encryptedPassword: oneOf([
                string(obj.password), // TODO we should schedule a clean up for such migrations
                string(obj.encryptedPassword),
            ]),
            customCurrencies: oneOf([
                object(obj.customCurrencies).andThen((curriencies) =>
                    record(curriencies, (input: unknown) =>
                        object(input).andThen(parseCryptoCurrency)
                    )
                ),
                success({}),
            ]),
            dApps: oneOf([
                object(obj.dApps).andThen((dApps) =>
                    record(dApps, parseDAppConnectionState)
                ),
                success({}),
            ]),
            transactionRequests: oneOf([
                object(obj.transactionRequests)
                    .andThen(parseIndexKey)
                    .andThen((transactionRequestsDto) =>
                        record(transactionRequestsDto, (arrDto) =>
                            array(arrDto).andThen((items) => {
                                const [, parsed] = groupByType(
                                    items.map(parseSubmitted)
                                )
                                return success(parsed)
                            })
                        )
                    ),
                success({}),
            ]),
            submitedBridges: oneOf([
                object(obj.submitedBridges).andThen((dto) =>
                    recordStrict(dto, {
                        keyParser: parseAddress,
                        valueParser: (bribges: unknown) =>
                            array(bribges).andThen((arr) => {
                                const [, parsed] = groupByType(
                                    arr.map(parseBridgeSubmitted)
                                )
                                return success(parsed)
                            }),
                    })
                ),
                success({}),
            ]),
            submittedOffRampTransactions: oneOf([
                array(obj.submittedOffRampTransactions).andThen((arr) => {
                    const [, parsed] = groupByType(
                        arr.map(parseSubmittedOfframpTransaction)
                    )
                    return success(parsed)
                }),
                success([]),
            ]),
            installationId: oneOf([
                string(obj.installationId),
                success(uuid()),
            ]),
            swapSlippagePercent: oneOf([
                number(obj.swapSlippagePercent),
                nullable(obj.swapSlippagePercent),
                success(null),
            ]),
            bankTransferInfo: parseBankTransferInfo(obj.bankTransferInfo),
        })
    )
}

export const parseSessionStorage = (
    input: unknown
): Result<unknown, { password: string | null }> => {
    return object(input).andThen((obj) => {
        return shape({
            password: string(obj.password),
        })
    })
}
