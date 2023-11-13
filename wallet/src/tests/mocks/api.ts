import { matchPath } from '@remix-run/router'
import { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from 'axios'
import { components } from '@zeal/api/portfolio'
import { APIPaths, request as axiosInstance } from '@zeal/api/request'
import { request as socketAxiosInstance } from '@zeal/api/socketApi'
import { currenciesMatrix } from 'src/domains/Currency/api/fixtures/currenciesMatrix'
import { unblockGBPtoUSDRate } from 'src/domains/Currency/domains/BankTransfer/api/fixtures/exchangeRate'
import { unblockNoFee } from 'src/domains/Currency/domains/BankTransfer/api/fixtures/fees'
import { successfulUnblockLogin } from 'src/domains/Currency/domains/BankTransfer/api/fixtures/login'
import { unblockRemoteGBPandEURAccounts } from 'src/domains/Currency/domains/BankTransfer/api/fixtures/remoteBankAccounts'
import { unblockGBPandEURaccounts } from 'src/domains/Currency/domains/BankTransfer/api/fixtures/unblockBankAccounts'
import { unblockFullUser } from 'src/domains/Currency/domains/BankTransfer/api/fixtures/user'
import { HttpError } from '@zeal/domains/Error'
import { PREDEFINED_AND_TEST_NETWORKS } from '@zeal/domains/Network/constants'
import { initialPortfolio } from 'src/domains/Portfolio/api/fixtures/portfolio'
import { RPCRequest } from '@zeal/domains/RPCRequest'
import { ethBlockNumber } from 'src/domains/RPCRequest/api/fixtures/ethBlockNumber'
import { ethGetBlockByNumber } from 'src/domains/RPCRequest/api/fixtures/ethGetBlockByNumber'
import { ethGetTransactionCount } from 'src/domains/RPCRequest/api/fixtures/ethGetTransactionCount'
import { ethSendRawTransactionResponse } from 'src/domains/RPCRequest/api/fixtures/ethSendRawTransaction'
import { safetyChecksPassed } from 'src/domains/SafetyCheck/api/fixtures/passed'
import {
    initialHistory,
    initialHistoryLegacy,
} from 'src/domains/Transactions/api/fixtures/history'
import { usdcApprovalPloygonForecast } from 'src/domains/Transactions/api/fixtures/usdcApprovalPloygonForecast'
import { approvalSimulation } from 'src/domains/Transactions/domains/SimulatedTransaction/api/fixtures/approval'
import { keys } from '@zeal/toolkit/Object'
import { replaceUUID } from '@zeal/toolkit/replaceUUID'

let initialAdapter: typeof axiosInstance.defaults.adapter
let initialSocketAdapter: typeof socketAxiosInstance.defaults.adapter

type ResponseFunction = (config: AxiosRequestConfig) => [number, unknown]

type SocketMocks = Record<
    | '@socket/quote'
    | '@socket/approval/check-allowance'
    | '@socket/build-tx'
    | '@socket/approval/build-tx'
    | '@socket/bridge-status',
    ResponseFunction
>

type MockApiPaths = Omit<
    APIPaths,
    `/wallet/rate/default/${components['schemas']['Network']}/${string}/`
> & {
    '/wallet/rate/default/:network/:address/': APIPaths[`/wallet/rate/default/${components['schemas']['Network']}/${string}/`]
}

export type ApiMock = Omit<
    {
        [Property in keyof MockApiPaths]: {
            [Meth in keyof MockApiPaths[Property]]: ResponseFunction
        }
    },
    '/wallet/rpc/' | '/wallet/unblock/'
> & {
    '/wallet/rpc/': Record<RPCRequest['method'], ResponseFunction>
    '/wallet/unblock/': Record<
        MockApiPaths['/wallet/unblock/']['get']['parameters']['query']['path'],
        Partial<
            Record<keyof MockApiPaths['/wallet/unblock/'], ResponseFunction>
        >
    >
} & SocketMocks

// TODO Wrap mock functions with jest.fn() [jest.Mock<T, P> type]

let apiMock: ApiMock

const getPRCResponder = (
    config: AxiosRequestConfig,
    url: '/wallet/rpc/'
): ResponseFunction => {
    const mocks = apiMock[url]
    const requestData = JSON.parse(config.data)

    const responder =
        'method' in requestData &&
        mocks[requestData.method as keyof typeof mocks]
            ? mocks[requestData.method as keyof typeof mocks]
            : null

    if (!responder) {
        // eslint-disable-next-line no-console
        console.error(
            `Failed to find mock for RPC request [${url}] method [${JSON.stringify(
                requestData,
                null,
                2
            )}]`
        )
        process.exit(-1)
    }

    return responder
}

const getUnblockResponder = (
    config: AxiosRequestConfig,
    url: '/wallet/unblock/'
): ResponseFunction => {
    const mocks = apiMock[url]
    const unblockPath = (config.params.path as string)
        ? replaceUUID(config.params.path.split('?')[0], ':uuid')
        : null

    const requestMethod = config.method || null

    const responders =
        unblockPath && mocks[unblockPath as keyof typeof mocks]
            ? mocks[unblockPath as keyof typeof mocks] || null
            : null

    const responder =
        responders && responders[requestMethod as keyof typeof responders]
            ? responders[requestMethod as keyof typeof responders] || null
            : null

    if (!responder) {
        // eslint-disable-next-line no-console
        console.error(
            `Failed to find mock for unblock request [${requestMethod}:${unblockPath}]`
        )
        process.exit(-1)
    }

    return responder
}

const getSocketResponder = (config: AxiosRequestConfig): ResponseFunction => {
    const url = config.url
    const responder = apiMock[`@socket${url}` as keyof SocketMocks]

    if (!responder) {
        // eslint-disable-next-line no-console
        console.error(
            `Failed to find mock for SOCKET request [${url}] ${JSON.stringify(
                config.params,
                null,
                2
            )}`
        )
        process.exit(-1)
    }
    return responder
}

const getMockResponder = (config: AxiosRequestConfig): ResponseFunction => {
    const requestUrl = config.url || ''
    const requestMethod = config.method || ''
    const mockPaths = keys(apiMock)

    // Special handing for socket API
    if (config.baseURL === 'https://api.socket.tech/v2') {
        return getSocketResponder(config)
    }

    // Special handling for RPC endpoint
    if (requestUrl === '/wallet/rpc/') {
        return getPRCResponder(config, requestUrl)
    }

    // Special handling for Unblock endpoint
    if (requestUrl === '/wallet/unblock/') {
        return getUnblockResponder(config, requestUrl)
    }

    const matchedMock =
        apiMock[requestUrl as keyof typeof apiMock] ||
        apiMock[
            mockPaths.find((path) =>
                matchPath(path, requestUrl)
            ) as keyof typeof apiMock
        ]

    if (!matchedMock) {
        // eslint-disable-next-line no-console
        console.error(
            `Failed to find mock for URL[${requestUrl}] method [${requestMethod}]`
        )
        process.exit(-1)
    }

    const responder: ResponseFunction | null =
        (matchedMock as Record<string, ResponseFunction>)[requestMethod] || null

    if (!responder) {
        // eslint-disable-next-line no-console
        console.error(
            `Failed to find mock for URL[${requestUrl}] method [${requestMethod}]`
        )
        process.exit(-1)
    }

    return responder
}

const cleanupUrl = (input: string): string => {
    const networksReplaced = PREDEFINED_AND_TEST_NETWORKS.reduce(
        (str, network) => str.replace(`/${network.name}/`, '/:network/'),
        input
    )

    return networksReplaced.replace(/0x[a-fA-F0-9]{40}/gim, ':address')
}

const getResponse = async (
    config: AxiosRequestConfig
): Promise<AxiosResponse<unknown>> => {
    const requestUrl = cleanupUrl(config.url || '')
    const requestMethod = config.method || ''

    const responder = getMockResponder(config)

    const [status, data] = responder(config)

    if (status > 299) {
        throw new HttpError(requestUrl, requestMethod, status, null, data, {})
    }

    const response: AxiosResponse<unknown> = {
        config,
        data,
        status,
        headers: {},
        statusText: 'OK',
    }

    return response
}

const mockAdapter: AxiosAdapter = (config) => getResponse(config)

export const getMocks = () => {
    axiosInstance.defaults.adapter = mockAdapter
    socketAxiosInstance.defaults.adapter = mockAdapter

    apiMock = {
        '/wallet/fee/forecast': {
            post: () => [200, usdcApprovalPloygonForecast],
        },

        '/wallet/metrics': {
            post: () => [200, null],
        },

        '/wallet/rpc/': {
            eth_getStorageAt: jest.fn(() => [500, null]),
            wallet_watchAsset: jest.fn(() => [500, null]),
            web3_clientVersion: jest.fn(() => [500, null]),
            debug_traceTransaction: jest.fn(() => [500, null]),
            eth_accounts: jest.fn(() => [500, null]),
            eth_blockNumber: jest.fn(() => [200, ethBlockNumber]),
            eth_call: jest.fn(() => [500, null]),
            eth_chainId: jest.fn(() => [500, null]),
            eth_coinbase: jest.fn(() => [500, null]),
            eth_estimateGas: jest.fn(() => [500, null]),
            eth_gasPrice: jest.fn(() => [500, null]),
            eth_getBalance: jest.fn(() => [500, null]),
            eth_getBlockByNumber: jest.fn(() => [200, ethGetBlockByNumber]),
            eth_getCode: jest.fn(() => [500, null]),
            eth_getLogs: jest.fn(() => [500, null]),
            eth_getTransactionByHash: jest.fn(() => [500, null]),
            eth_getTransactionCount: jest.fn(() => [
                200,
                ethGetTransactionCount,
            ]),
            eth_getTransactionReceipt: jest.fn(() => [500, null]),
            eth_requestAccounts: jest.fn(() => [500, null]),
            eth_sendRawTransaction: jest.fn(() => [
                200,
                ethSendRawTransactionResponse,
            ]),
            eth_sendTransaction: jest.fn(() => [500, null]),
            eth_signTypedData_v4: jest.fn(() => [500, null]),
            eth_signTypedData_v3: jest.fn(() => [500, null]),
            eth_signTypedData: jest.fn(() => [500, null]),
            net_version: jest.fn(() => [500, null]),
            personal_ecRecover: jest.fn(() => [500, null]),
            personal_sign: jest.fn(() => [500, null]),
            wallet_addEthereumChain: jest.fn(() => [500, null]),
            wallet_switchEthereumChain: jest.fn(() => [500, null]),
        },

        '/wallet/safetychecks/connection/': {
            post: () => [200, safetyChecksPassed],
        },

        '/wallet/transaction/simulate/': {
            post: () => [200, approvalSimulation],
        },

        /* Template string URLs (not auto-requested by type check, will fail during test runtime) */
        '/wallet/portfolio/:address/': {
            get: () => [200, initialPortfolio],
        },

        '/wallet/transaction/history/:address/': {
            get: () => [200, initialHistoryLegacy],
        },

        '/wallet/transaction/activity/:address/': {
            get: () => [200, initialHistory],
        },

        '/wallet/transaction/:hash/result': {
            get: () => [500, null],
        },

        '/wallet/rate/default/:network/:address/': {
            get: () => [500, null],
        },

        '/wallet/currencies/bridge': {
            get: () => [200, currenciesMatrix],
        },

        '/wallet/unblock/': {
            '/auth/login': {
                post: () => [200, successfulUnblockLogin],
            },
            '/user': {
                get: () => [200, unblockFullUser],
            },
            '/user/bank-account/remote': {
                get: () => [200, unblockRemoteGBPandEURAccounts],
            },
            '/user/bank-account/unblock': {
                get: () => [200, unblockGBPandEURaccounts],
            },
            '/user/kyc/applicant': {},
            '/user/kyc/applicant/token': {},
            '/user/transactions': {
                get: () => [200, []],
            },
            '/user/wallet/polygon': {},
            '/user/bank-account/remote/:uuid': {},
            '/exchange-rates/': {
                get: () => [200, unblockGBPtoUSDRate],
            },
            '/fees': {
                get: () => [200, unblockNoFee],
            },
        },

        '/wallet/unblock/webhook/': {
            get: () => [500, null],
        },

        '/wallet/sign-message/simulate/': {
            post: () => [500, null],
        },

        '@socket/quote': () => [500, null],
        '@socket/approval/check-allowance': () => [500, null],
        '@socket/build-tx': () => [500, null],
        '@socket/approval/build-tx': () => [500, null],
        '@socket/bridge-status': () => [500, null],
    }

    return apiMock
}

export const clearMocks = () => {
    axiosInstance.defaults.adapter = initialAdapter
    socketAxiosInstance.defaults.adapter = initialSocketAdapter
}
