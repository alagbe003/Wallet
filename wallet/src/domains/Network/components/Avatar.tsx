import {
    AllNetwork,
    Arbitrum,
    Zksync,
    Aurora,
    Avalanche,
    BNB,
    Celo,
    Cronos,
    Eth,
    Evmos,
    Fantom,
    Gnosis,
    Harmony,
    Moonriver,
    Optimism,
    Base as BaseIcon,
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
} from '@zeal/domains/Network/components/Icons'
import { KNOWN_NETWORKS_MAP } from '@zeal/domains/Network/constants'
import { notReachable } from '@zeal/toolkit'
import { AvatarSize, Avatar as UIAvatar } from 'src/uikit/Avatar'
import { Base } from 'src/uikit/Base'
import { QuestionCircle } from '@zeal/uikit/Icon/QuestionCircle'
import styled from 'styled-components'
import {
    CurrentNetwork,
    CustomNetwork,
    PredefinedNetwork,
    TestNetwork,
} from '@zeal/domains/Network'

type Props = {
    currentNetwork: CurrentNetwork
    size: number
}

type AvatarProps = {
    size: number
}
const StyledAvatar = styled(Base)<AvatarProps>`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: 1px ${(props) => props.theme.colors.borderDefault} solid;
    width: ${(props) => props.size}px;
    height: ${(props) => props.size}px;
`

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
    size: number
    network: TestNetwork
}) => {
    switch (network.name) {
        case 'PolygonMumbai':
            return (
                <StyledAvatar size={size}>
                    <TestnetPolygon size={size} />
                </StyledAvatar>
            )
        case 'BscTestnet':
            return (
                <StyledAvatar size={size}>
                    <TestnetBNBSmartChain size={size} />
                </StyledAvatar>
            )
        case 'AvalancheFuji':
            return (
                <StyledAvatar size={size}>
                    <TestnetAvalanche size={size} />
                </StyledAvatar>
            )
        case 'OptimismGoerli':
            return (
                <StyledAvatar size={size}>
                    <TestnetOptimism size={size} />
                </StyledAvatar>
            )
        case 'FantomTestnet':
            return (
                <StyledAvatar size={size}>
                    <TestnetFantom size={size} />
                </StyledAvatar>
            )
        case 'ArbitrumGoerli':
            return (
                <StyledAvatar size={size}>
                    <TestnetArbitrum size={size} />
                </StyledAvatar>
            )

        case 'EthereumSepolia':
        case 'EthereumGoerli':
            return (
                <StyledAvatar size={size}>
                    <TestnetEthereum size={size} />
                </StyledAvatar>
            )

        case 'AuroraTestnet':
            return (
                <StyledAvatar size={size}>
                    <TestnetAurora size={size} />
                </StyledAvatar>
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
    size: number
}) => {
    switch (network.name) {
        case 'Ethereum':
            return (
                <StyledAvatar size={size}>
                    <Eth size={size} />
                </StyledAvatar>
            )
        case 'Arbitrum':
            return (
                <StyledAvatar size={size}>
                    <Arbitrum size={size} />
                </StyledAvatar>
            )
        case 'zkSync':
            return (
                <StyledAvatar size={size}>
                    <Zksync size={size} />
                </StyledAvatar>
            )
        case 'BSC':
            return (
                <StyledAvatar size={size}>
                    <BNB size={size} />
                </StyledAvatar>
            )
        case 'Polygon':
            return (
                <StyledAvatar size={size}>
                    <Polygon size={size} />
                </StyledAvatar>
            )
        case 'PolygonZkevm':
            return (
                <StyledAvatar size={size}>
                    <PolygonZkevm size={size} />
                </StyledAvatar>
            )
        case 'Fantom':
            return (
                <StyledAvatar size={size}>
                    <Fantom size={size} />
                </StyledAvatar>
            )
        case 'Optimism':
            return (
                <StyledAvatar size={size}>
                    <Optimism size={size} />
                </StyledAvatar>
            )
        case 'Base':
            return (
                <StyledAvatar size={size}>
                    <BaseIcon size={size} />
                </StyledAvatar>
            )
        case 'Gnosis':
            return (
                <StyledAvatar size={size}>
                    <Gnosis size={size} />
                </StyledAvatar>
            )
        case 'Celo':
            return (
                <StyledAvatar size={size}>
                    <Celo size={size} />
                </StyledAvatar>
            )
        case 'Avalanche':
            return (
                <StyledAvatar size={size}>
                    <Avalanche size={size} />
                </StyledAvatar>
            )
        case 'Harmony':
            return (
                <StyledAvatar size={size}>
                    <Harmony size={size} />
                </StyledAvatar>
            )
        case 'Moonriver':
            return (
                <StyledAvatar size={size}>
                    <Moonriver size={size} />
                </StyledAvatar>
            )
        case 'Cronos':
            return (
                <StyledAvatar size={size}>
                    <Cronos size={size} />
                </StyledAvatar>
            )

        case 'Aurora':
            return (
                <StyledAvatar size={size}>
                    <Aurora size={size} />
                </StyledAvatar>
            )
        case 'Evmos':
            return (
                <StyledAvatar size={size}>
                    <Evmos size={size} />
                </StyledAvatar>
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
        return <UIAvatar size={size as AvatarSize} src={iconUrl} />
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
