import { CurrencyId } from '@zeal/domains/Currency'
import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'
import { NetworkHexId } from '@zeal/domains/Network'
import { Address } from '@zeal/domains/Address'
import { parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'

const parseStaticAddress = (address: string) =>
    parseAddress(address).getSuccessResultOrThrow(
        'Failed to parse static address'
    )

const parseStaticNetworkHexId = (input: string) =>
    parseNetworkHexId(input).getSuccessResultOrThrow(
        'Failed to parse static network hex id'
    )

export const DEFAULT_CURRENCY_ID = 'USD' as CurrencyId

/**
 * This taken from https://docs.gelato.network/developer-services/relay/payment-and-fees/syncfee-payment-tokens#mainnets
 * FIXME @resetko-zeal currently added only mainnets, add test nets
 * FIXME @resetko-zeal this looks not super typesafe, maybe use name prop type from predefined & test networks?
 */
export const GAS_ABSTRACTION_GAS_TOKEN_ADDRESSES: Record<
    NetworkHexId,
    Address[]
> = {
    [parseStaticNetworkHexId('0xa4b1')]: [
        // Arbitrum
        parseStaticAddress('0x0000000000000000000000000000000000000000'),
        parseStaticAddress('0x82af49447d8a07e3bd95bd0d56f35241523fbab1'),
        parseStaticAddress('0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'),
        parseStaticAddress('0xff970a61a04b1ca14834a43f5de4533ebddb5cc8'),
        parseStaticAddress('0xaf88d065e77c8cc2239327c5edb3a432268e5831'),
        parseStaticAddress('0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9'),
        parseStaticAddress('0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f'),
    ],
    [parseStaticNetworkHexId('0xa86a')]: [
        // Avalanche
        parseStaticAddress('0x0000000000000000000000000000000000000000'),
        parseStaticAddress('0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7'),
        parseStaticAddress('0xd586e7f844cea2f87f50152665bcbc2c279d8d70'),
        parseStaticAddress('0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664'),
        parseStaticAddress('0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e'),
        parseStaticAddress('0xc7198437980c041c805a1edcba50c1ce5db95118'),
        parseStaticAddress('0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7'),
        parseStaticAddress('0x50b7545627a5162f82a992c33b87adc75187b218'),
        parseStaticAddress('0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab'),
    ],
    [parseStaticNetworkHexId('0x2105')]: [
        // Base
        parseStaticAddress('0x0000000000000000000000000000000000000000'),
        parseStaticAddress('0x4200000000000000000000000000000000000006'),
        parseStaticAddress('0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca'),
    ],
    [parseStaticNetworkHexId('0x38')]: [
        // BSC
        parseStaticAddress('0x0000000000000000000000000000000000000000'),
        parseStaticAddress('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'),
        parseStaticAddress('0xe9e7cea3dedca5984780bafc599bd69add087d56'),
        parseStaticAddress('0x55d398326f99059ff775485246999027b3197955'),
        parseStaticAddress('0xd40bedb44c081d2935eeba6ef5a3c8a31a1bbe13'),
        parseStaticAddress('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82'),
        parseStaticAddress('0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c'),
        parseStaticAddress('0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d'),
    ],
    [parseStaticNetworkHexId('0x1')]: [
        // Ethereum
        parseStaticAddress('0x0000000000000000000000000000000000000000'),
        parseStaticAddress('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'),
        parseStaticAddress('0x6b175474e89094c44da98b954eedeac495271d0f'),
        parseStaticAddress('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'),
        parseStaticAddress('0xdac17f958d2ee523a2206206994597c13d831ec7'),
        parseStaticAddress('0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'),
    ],
    [parseStaticNetworkHexId('0x64')]: [
        // Gnosis
        parseStaticAddress('0x44fa8e6f47987339850636f88629646662444217'),
        parseStaticAddress('0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d'),
        parseStaticAddress('0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb'),
        parseStaticAddress('0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83'),
        parseStaticAddress('0x4ECaBa5870353805a9F068101A40E0f32ed605C6'),
        parseStaticAddress('0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1'),
    ],
    [parseStaticNetworkHexId('0xa')]: [
        // Optimism
        parseStaticAddress('0x0000000000000000000000000000000000000000'),
        parseStaticAddress('0x4200000000000000000000000000000000000006'),
        parseStaticAddress('0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'),
        parseStaticAddress('0x7f5c764cbc14f9669b88837ca1490cca17c31607'),
        parseStaticAddress('0x94b008aa00579c1307b0ef2c499ad98a8ce58e58'),
        parseStaticAddress('0x68f180fcce6836688e9084f035309e29bf0a2095'),
        parseStaticAddress('0x8700daec35af8ff88c16bdf0418774cb3d7599b4'),
        parseStaticAddress('0x61baadcf22d2565b0f471b291c475db5555e0b76'),
        parseStaticAddress('0x2e3d870790dc77a83dd1d18184acc7439a53f475'),
    ],
    [parseStaticNetworkHexId('0x89')]: [
        // Polygon
        parseStaticAddress('0x0000000000000000000000000000000000001010'),
        parseStaticAddress('0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'),
        parseStaticAddress('0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'),
        parseStaticAddress('0x2791bca1f2de4661ed88a30c99a7a9449aa84174'),
        parseStaticAddress('0xc2132d05d31c914a87c6611c10748aeb04b58e8f'),
        parseStaticAddress('0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6'),
        parseStaticAddress('0x7ceb23fd6bc0add59e62ac25578270cff1b9f619'),
    ],
    [parseStaticNetworkHexId('0x44d')]: [
        // PolygonZkevm
        parseStaticAddress('0x0000000000000000000000000000000000000000'),
        parseStaticAddress('0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9'),
        parseStaticAddress('0xA8CE8aee21bC2A48a5EF670afCc9274C7bbbC035'),
    ],
}
