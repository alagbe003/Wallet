import { Address } from '@zeal/domains/Address'
import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'
import { initCustomCurrency } from '@zeal/domains/Currency/helpers/initCustomCurrency'
import { ImperativeError } from '@zeal/domains/Error'
import {
    Network,
    NetworkHexId,
    NetworkMap,
    PredefinedNetwork,
    TestNetwork,
} from '@zeal/domains/Network'
import { getChainIdNumber } from '@zeal/domains/Network/helpers/getChainIdNumber'
import { values } from '@zeal/toolkit/Object'
import { KNOWN_NETWORKS, KnownNetwork } from './chains'

export const KNOWN_NETWORKS_MAP: Record<string, KnownNetwork> =
    KNOWN_NETWORKS.reduce(
        (acc, network) => ({
            ...acc,
            [network.hexChainId]: network,
        }),
        {}
    )

const parseStaticAddress = (str: string): Address =>
    parseAddress(str).getSuccessResultOrThrow(
        `Failed to parse static address ${str}`
    )

// Do not export this one, it is used only for not to forget to add new networks to the array if new type is added
const PREDEFINED_NETWORKS_MAP: {
    [K in PredefinedNetwork['name']]: Omit<PredefinedNetwork, 'name'> & {
        name: K
    }
} = {
    Ethereum: {
        type: 'predefined',
        blockExplorerUrl: 'https://etherscan.io/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0x1' as NetworkHexId, // TODO :: use parse for network
        isSimulationSupported: true,
        isZealRPCSupported: true,
        name: 'Ethereum',
        trxType: 'eip1559',
    },
    Polygon: {
        type: 'predefined',
        blockExplorerUrl: 'https://polygonscan.com/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000001010'
        ),
        hexChainId: '0x89' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        name: 'Polygon',
        trxType: 'eip1559',
    },
    PolygonZkevm: {
        type: 'predefined',
        blockExplorerUrl: 'https://zkevm.polygonscan.com/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0x44d' as NetworkHexId,
        isSimulationSupported: false,
        isZealRPCSupported: true,
        name: 'PolygonZkevm',
        trxType: 'legacy',
    },
    Arbitrum: {
        type: 'predefined',
        blockExplorerUrl: 'https://arbiscan.io/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0xa4b1' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        name: 'Arbitrum',
        trxType: 'legacy',
    },
    zkSync: {
        type: 'predefined',
        blockExplorerUrl: 'https://explorer.zksync.io/',
        gasTokenAddress: parseStaticAddress(
            '0x000000000000000000000000000000000000800A'
        ),
        hexChainId: '0x144' as NetworkHexId,
        isSimulationSupported: false,
        isZealRPCSupported: true,
        name: 'zkSync',
        trxType: 'legacy',
    },
    Aurora: {
        type: 'predefined',
        blockExplorerUrl: 'https://aurorascan.dev/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0x4e454152' as NetworkHexId,
        isSimulationSupported: false,
        isZealRPCSupported: true,
        name: 'Aurora',
        trxType: 'legacy',
    },
    Avalanche: {
        type: 'predefined',
        blockExplorerUrl: 'https://snowtrace.io/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0xa86a' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        name: 'Avalanche',
        trxType: 'eip1559',
    },
    BSC: {
        type: 'predefined',
        blockExplorerUrl: 'https://www.bscscan.com/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0x38' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        name: 'BSC',
        trxType: 'legacy',
    },
    Celo: {
        type: 'predefined',
        blockExplorerUrl: 'https://celoscan.io/',
        gasTokenAddress: parseStaticAddress(
            '0x471ece3750da237f93b8e339c536989b8978a438'
        ),
        hexChainId: '0xa4ec' as NetworkHexId,
        isSimulationSupported: false,
        isZealRPCSupported: true,
        name: 'Celo',
        trxType: 'legacy',
    },
    Fantom: {
        type: 'predefined',
        blockExplorerUrl: 'https://ftmscan.com/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0xfa' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        name: 'Fantom',
        trxType: 'legacy',
    },
    Gnosis: {
        type: 'predefined',
        blockExplorerUrl: 'https://blockscout.com/xdai/mainnet',
        gasTokenAddress: parseStaticAddress(
            '0x44fa8e6f47987339850636f88629646662444217'
        ),
        hexChainId: '0x64' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        name: 'Gnosis',
        trxType: 'eip1559',
    },
    Optimism: {
        type: 'predefined',
        blockExplorerUrl: 'https://optimistic.etherscan.io/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0xa' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        name: 'Optimism',
        trxType: 'legacy',
    },
    Base: {
        type: 'predefined',
        blockExplorerUrl: 'https://basescan.org/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0x2105' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        name: 'Base',
        trxType: 'legacy',
    },
    Harmony: {
        type: 'predefined',
        blockExplorerUrl: 'https://explorer.harmony.one/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0x63564c40' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: false,
        name: 'Harmony',
        trxType: 'legacy',
    },
    Moonriver: {
        type: 'predefined',
        blockExplorerUrl: 'https://moonriver.moonscan.io/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0x505' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: false,
        name: 'Moonriver',
        trxType: 'legacy',
    },
    Cronos: {
        type: 'predefined',
        blockExplorerUrl: 'https://cronoscan.com/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0x19' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        name: 'Cronos',
        trxType: 'legacy',
    },
    Evmos: {
        type: 'predefined',
        blockExplorerUrl: 'https://evm.evmos.org/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0x2329' as NetworkHexId,
        isSimulationSupported: false,
        isZealRPCSupported: false,
        name: 'Evmos',
        trxType: 'legacy',
    },
}

// Do not export this one, it is used only for not to forget to add new networks to the array if new type is added
const TEST_NETWORKS_MAP: {
    [K in TestNetwork['name']]: Omit<TestNetwork, 'name'> & {
        name: K
    }
} = {
    ArbitrumGoerli: {
        type: 'testnet',
        blockExplorerUrl: 'https://goerli.arbiscan.io/',
        hexChainId: '0x66eed' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        trxType: 'legacy',
        name: 'ArbitrumGoerli',
        nativeCurrency: initCustomCurrency({
            address: parseStaticAddress(
                '0x0000000000000000000000000000000000000000'
            ),
            networkHexChainId: '0x66eed' as NetworkHexId,
            fraction: 18,
            id: `ArbitrumGoerli+ETH+Native`,
            symbol: 'ETH',
            icon: null,
        }),
    },
    AuroraTestnet: {
        type: 'testnet',
        blockExplorerUrl: 'https://explorer.testnet.aurora.dev/',
        hexChainId: '0x4e454153' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        trxType: 'legacy',
        name: 'AuroraTestnet',
        nativeCurrency: initCustomCurrency({
            address: parseStaticAddress(
                '0x0000000000000000000000000000000000000000'
            ),
            networkHexChainId: '0x4e454153' as NetworkHexId,
            fraction: 18,
            id: `AuroraTestnet+ETH+Native`,
            symbol: 'ETH',
            icon: null,
        }),
    },
    AvalancheFuji: {
        type: 'testnet',
        blockExplorerUrl: 'https://testnet.snowtrace.io/',
        hexChainId: '0xa869' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        trxType: 'eip1559',
        name: 'AvalancheFuji',
        nativeCurrency: initCustomCurrency({
            address: parseStaticAddress(
                '0x0000000000000000000000000000000000000000'
            ),
            networkHexChainId: '0xa869' as NetworkHexId,
            fraction: 18,
            id: `AvalancheFuji+AVAX+Native`,
            symbol: 'AVAX',
            icon: null,
        }),
    },
    BscTestnet: {
        type: 'testnet',
        blockExplorerUrl: 'https://testnet.bscscan.com/',
        hexChainId: '0x61' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        trxType: 'legacy',
        name: 'BscTestnet',
        nativeCurrency: initCustomCurrency({
            address: parseStaticAddress(
                '0x0000000000000000000000000000000000000000'
            ),
            networkHexChainId: '0x61' as NetworkHexId,
            fraction: 18,
            id: `BscTestnet+BNB+Native`,
            symbol: 'BNB',
            icon: null,
        }),
    },
    EthereumGoerli: {
        type: 'testnet',
        blockExplorerUrl: 'https://goerli.etherscan.io/',
        hexChainId: '0x5' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        trxType: 'eip1559',
        name: 'EthereumGoerli',
        nativeCurrency: initCustomCurrency({
            address: parseStaticAddress(
                '0x0000000000000000000000000000000000000000'
            ),
            networkHexChainId: '0x5' as NetworkHexId,
            fraction: 18,
            id: `EthereumGoerli+goETH+Native`,
            symbol: 'goETH',
            icon: null,
        }),
    },
    EthereumSepolia: {
        type: 'testnet',
        blockExplorerUrl: 'https://sepolia.etherscan.io/',
        hexChainId: '0xaa36a7' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        trxType: 'eip1559',
        name: 'EthereumSepolia',
        nativeCurrency: initCustomCurrency({
            address: parseStaticAddress(
                '0x0000000000000000000000000000000000000000'
            ),
            networkHexChainId: '0xaa36a7' as NetworkHexId,
            fraction: 18,
            id: `EthereumSepolia+spETH+Native`,
            symbol: 'spETH',
            icon: null,
        }),
    },
    FantomTestnet: {
        type: 'testnet',
        blockExplorerUrl: 'https://testnet.ftmscan.com/',
        hexChainId: '0xfa2' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        trxType: 'legacy',
        name: 'FantomTestnet',
        nativeCurrency: initCustomCurrency({
            address: parseStaticAddress(
                '0x0000000000000000000000000000000000000000'
            ),
            networkHexChainId: '0xfa2' as NetworkHexId,
            fraction: 18,
            id: `FantomTestnet+FTM+Native`,
            symbol: 'FTM',
            icon: null,
        }),
    },
    OptimismGoerli: {
        type: 'testnet',
        blockExplorerUrl: 'https://goerli-optimism.etherscan.io/',
        hexChainId: '0x1a4' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        trxType: 'legacy',
        name: 'OptimismGoerli',
        nativeCurrency: initCustomCurrency({
            address: parseStaticAddress(
                '0x0000000000000000000000000000000000000000'
            ),
            networkHexChainId: '0x1a4' as NetworkHexId,
            fraction: 18,
            id: `OptimismGoerli+ETH+Native`,
            symbol: 'ETH',
            icon: null,
        }),
    },
    PolygonMumbai: {
        type: 'testnet',
        blockExplorerUrl: 'https://mumbai.polygonscan.com/',
        hexChainId: '0x13881' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        trxType: 'eip1559',
        name: 'PolygonMumbai',
        nativeCurrency: initCustomCurrency({
            address: parseStaticAddress(
                '0x0000000000000000000000000000000000001010'
            ),
            networkHexChainId: '0x13881' as NetworkHexId,
            fraction: 18,
            id: `PolygonMumbai+MATIC+Native`,
            symbol: 'MATIC',
            icon: null,
        }),
    },
}

export const POLYGON = PREDEFINED_NETWORKS_MAP['Polygon']
export const ETHEREUM = PREDEFINED_NETWORKS_MAP['Ethereum']

export const PREDEFINED_NETWORKS: PredefinedNetwork[] = values(
    PREDEFINED_NETWORKS_MAP
)

export const TEST_NETWORKS: TestNetwork[] = values(TEST_NETWORKS_MAP)

export const PREDEFINED_AND_TEST_NETWORKS: (PredefinedNetwork | TestNetwork)[] =
    [...PREDEFINED_NETWORKS, ...TEST_NETWORKS]

export const findNetworkByNumber = (
    networkId: number
): TestNetwork | PredefinedNetwork => {
    const network = PREDEFINED_AND_TEST_NETWORKS.find(
        (n) => getChainIdNumber(n) === networkId
    )
    if (!network) {
        throw new ImperativeError(`cannot find ${networkId}`)
    }
    return network
}

export const findNetworkByHexChainId = (
    hexChanId: NetworkHexId,
    networkMap: NetworkMap
): Network => {
    const network = networkMap[hexChanId]
    if (!network) {
        throw new ImperativeError(`cannot find network for ${hexChanId}`)
    }
    return network
}

export const DEFAULT_NETWORK = PREDEFINED_NETWORKS[0]
