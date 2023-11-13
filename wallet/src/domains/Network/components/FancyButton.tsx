import { Network } from '@zeal/domains/Network'
import { Avatar } from 'src/domains/Network/components/Avatar'
import { Name } from '@zeal/domains/Network/components/Name'
import { notReachable } from '@zeal/toolkit'
import { FancyButton as UIFancyButton } from '@zeal/uikit/FancyButton'
import { LightArrowDown2 } from 'src/uikit/Icon/LightArrowDown2'
import { Row } from '@zeal/uikit/Row'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    network: Network
    rounded: boolean
    onClick: null | (() => void)
}

// TODO Check with Chris if we can kill this and use TagButton instead with some special variants

const getFancyButtonColor = (
    network: Network
): React.ComponentProps<typeof UIFancyButton>['color'] => {
    switch (network.type) {
        case 'predefined':
            switch (network.name) {
                case 'Ethereum':
                case 'Arbitrum':
                case 'zkSync':
                case 'BSC':
                case 'Polygon':
                case 'PolygonZkevm':
                case 'Fantom':
                case 'Optimism':
                case 'Base':
                case 'Gnosis':
                case 'Avalanche':
                case 'Aurora':
                    return network.name
                case 'Celo':
                case 'Harmony':
                case 'Moonriver':
                case 'Cronos':
                case 'Evmos':
                    return 'Ethereum'

                /* istanbul ignore next */
                default:
                    return notReachable(network)
            }
        case 'custom':
        case 'testnet':
            return 'Ethereum'

        default:
            return notReachable(network)
    }
}

export const FancyButton = ({ network, rounded, onClick }: Props) => {
    const currentNetwork = { type: 'specific_network' as const, network }

    return (
        <UIFancyButton
            rounded={rounded}
            color={getFancyButtonColor(network)}
            left={
                <Row spacing={4}>
                    <Avatar currentNetwork={currentNetwork} size={12} />

                    <Text2>
                        <Name currentNetwork={currentNetwork} />
                    </Text2>
                </Row>
            }
            right={onClick && <LightArrowDown2 size={16} />}
            onClick={onClick}
        />
    )
}
