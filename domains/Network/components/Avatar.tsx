import {
    CurrentNetwork,
    CustomNetwork,
    PredefinedNetwork,
    TestNetwork,
} from '@zeal/domains/Network'
import {
    AllNetwork,
    Arbitrum,
    Aurora,
    Avalanche,
    BNB,
    Base as BaseIcon,
    Celo,
    Cronos,
    Eth,
    Evmos,
    Fantom,
    Gnosis,
    Harmony,
    Moonriver,
    Optimism,
    Polygon,
    PolygonZkevm,
    TestnetArbitrum,
    TestnetAurora,
    TestnetAvalanche,
    TestnetBNBSmartChain,
    TestnetEthereum,
    TestnetFantom,
    TestnetOptimism,
    TestnetPolygon,
    Zksync,
} from '@zeal/domains/Network/components/Icons'
import { KNOWN_NETWORKS_MAP } from '@zeal/domains/Network/constants'
import { notReachable } from '@zeal/toolkit'
import { AvatarSize, Avatar as UIAvatar } from '@zeal/uikit/Avatar'
import { QuestionCircle } from '@zeal/uikit/Icon/QuestionCircle'
import { SvgImage } from '@zeal/uikit/SvgImage'
import React from 'react'

type Props = {
    currentNetwork: CurrentNetwork
    size: AvatarSize
}

export const Avatar = ({ currentNetwork, size }: Props) => {
    switch (currentNetwork.type) {
        case 'all_networks':
            return <AllNetwork size={size} />
        case 'specific_network':
            switch (currentNetwork.network.type) {
                case 'predefined':
                    return (
                        <PredefinedNetworkAvatar
                            network={currentNetwork.network}
                            size={size}
                        />
                    )
                case 'custom':
                    return (
                        <CustomNetworkAvatar
                            size={size}
                            network={currentNetwork.network}
                        />
                    )

                case 'testnet':
                    return (
                        <TestNetworkAvatar
                            size={size}
                            network={currentNetwork.network}
                        />
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(currentNetwork.network)
            }
        /* istanbul ignore next */
        default:
            return notReachable(currentNetwork)
    }
}

const TestNetworkAvatar = ({
    size,
    network,
}: {
    size: AvatarSize
    network: TestNetwork
}) => {
    switch (network.name) {
        case 'PolygonMumbai':
            return (
                <UIAvatar size={size}>
                    <TestnetPolygon size={size} />
                </UIAvatar>
            )
        case 'BscTestnet':
            return (
                <UIAvatar size={size}>
                    <TestnetBNBSmartChain size={size} />
                </UIAvatar>
            )
        case 'AvalancheFuji':
            return (
                <UIAvatar size={size}>
                    <TestnetAvalanche size={size} />
                </UIAvatar>
            )
        case 'OptimismGoerli':
            return (
                <UIAvatar size={size}>
                    <TestnetOptimism size={size} />
                </UIAvatar>
            )
        case 'FantomTestnet':
            return (
                <UIAvatar size={size}>
                    <TestnetFantom size={size} />
                </UIAvatar>
            )
        case 'ArbitrumGoerli':
            return (
                <UIAvatar size={size}>
                    <TestnetArbitrum size={size} />
                </UIAvatar>
            )

        case 'EthereumSepolia':
        case 'EthereumGoerli':
            return (
                <UIAvatar size={size}>
                    <TestnetEthereum size={size} />
                </UIAvatar>
            )

        case 'AuroraTestnet':
            return (
                <UIAvatar size={size}>
                    <TestnetAurora size={size} />
                </UIAvatar>
            )

        /* istanbul ignore next */
        default:
            return notReachable(network.name)
    }
}

const PredefinedNetworkAvatar = ({
    network,
    size,
}: {
    network: PredefinedNetwork
    size: AvatarSize
}) => {
    switch (network.name) {
        case 'Ethereum':
            return (
                <UIAvatar size={size}>
                    <Eth size={size} />
                </UIAvatar>
            )
        case 'Arbitrum':
            return (
                <UIAvatar size={size}>
                    <Arbitrum size={size} />
                </UIAvatar>
            )
        case 'zkSync':
            return (
                <UIAvatar size={size}>
                    <Zksync size={size} />
                </UIAvatar>
            )
        case 'BSC':
            return (
                <UIAvatar size={size}>
                    <BNB size={size} />
                </UIAvatar>
            )
        case 'Polygon':
            return (
                <UIAvatar size={size}>
                    <Polygon size={size} />
                </UIAvatar>
            )
        case 'PolygonZkevm':
            return (
                <UIAvatar size={size}>
                    <PolygonZkevm size={size} />
                </UIAvatar>
            )
        case 'Fantom':
            return (
                <UIAvatar size={size}>
                    <Fantom size={size} />
                </UIAvatar>
            )
        case 'Optimism':
            return (
                <UIAvatar size={size}>
                    <Optimism size={size} />
                </UIAvatar>
            )
        case 'Base':
            return (
                <UIAvatar size={size}>
                    <BaseIcon size={size} />
                </UIAvatar>
            )
        case 'Gnosis':
            return (
                <UIAvatar size={size}>
                    <Gnosis size={size} />
                </UIAvatar>
            )
        case 'Celo':
            return (
                <UIAvatar size={size}>
                    <Celo size={size} />
                </UIAvatar>
            )
        case 'Avalanche':
            return (
                <UIAvatar size={size}>
                    <Avalanche size={size} />
                </UIAvatar>
            )
        case 'Harmony':
            return (
                <UIAvatar size={size}>
                    <Harmony size={size} />
                </UIAvatar>
            )
        case 'Moonriver':
            return (
                <UIAvatar size={size}>
                    <Moonriver size={size} />
                </UIAvatar>
            )
        case 'Cronos':
            return (
                <UIAvatar size={size}>
                    <Cronos size={size} />
                </UIAvatar>
            )

        case 'Aurora':
            return (
                <UIAvatar size={size}>
                    <Aurora size={size} />
                </UIAvatar>
            )
        case 'Evmos':
            return (
                <UIAvatar size={size}>
                    <Evmos size={size} />
                </UIAvatar>
            )

        /* istanbul ignore next */
        default:
            return notReachable(network.name)
    }
}

export const CustomNetworkAvatar = ({
    network,
    size,
}: {
    network: CustomNetwork
    size: number
}) => {
    const iconUrl = iconUrlFromKnownNetworks(network.hexChainId)

    if (iconUrl) {
        return (
            <UIAvatar size={size as AvatarSize}>
                <SvgImage src={iconUrl} />
            </UIAvatar>
        )
    } else {
        return <QuestionCircle size={size} color="iconDefault" />
    }
}

const iconUrlFromKnownNetworks = (chainId: string): string | null => {
    const chain = KNOWN_NETWORKS_MAP[chainId]

    if (!chain || !chain.icon) {
        return null
    }

    return `/chain-icons/${chain.icon}.png`
}
