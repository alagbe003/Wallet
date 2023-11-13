import { Account } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { GAS_ABSTRACTION_GAS_TOKEN_ADDRESSES } from '@zeal/domains/Currency/constants'
import { KeyStore, SafeV0 } from '@zeal/domains/KeyStore'
import { Network, NetworkHexId, NetworkRPCMap } from '@zeal/domains/Network'
import { PREDEFINED_AND_TEST_NETWORKS } from '@zeal/domains/Network/constants'
import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { keys } from '@zeal/toolkit/Object'
import { Group } from '@zeal/uikit/Group'
import { Text } from '@zeal/uikit/Text'
import { useEffect } from 'react'
import { getPredictedSafeInstance } from 'src/domains/KeyStore/helpers/getPredictedSafeInstance'

type Props = {
    keyStore: KeyStore
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
    account: Account
}

export const AddressPredictions = ({
    keyStore,
    account,
    networkRPCMap,
    sessionPassword,
}: Props) => {
    switch (keyStore.type) {
        case 'safe_v0': // FIXME @resetko-zeal - Safe implementation
            return (
                <Predictor
                    keyStore={keyStore}
                    networkRPCMap={networkRPCMap}
                    sessionPassword={sessionPassword}
                />
            )

        case 'track_only':
        case 'private_key_store':
        case 'ledger':
        case 'secret_phrase_key':
        case 'trezor':
            return null

        /* istanbul ignore next */
        default:
            return notReachable(keyStore)
    }
}

const predictOne = async ({
    keyStore,
    network,
    networkRPCMap,
    sessionPassword,
}: {
    keyStore: SafeV0
    network: Network
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
}): Promise<{ network: Network; address: Address }> => {
    const safe = await getPredictedSafeInstance({
        safeDeplymentConfig: keyStore.safeDeplymentConfig,
        network,
        networkRPCMap,
        sessionPassword,
    })
    const address = await safe.getAddress()

    return {
        address,
        network,
    }
}

const predictAllNetworks = async ({
    keyStore,
    networkRPCMap,
    sessionPassword,
}: {
    keyStore: SafeV0
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
}) => {
    const set = new Set<NetworkHexId>(keys(GAS_ABSTRACTION_GAS_TOKEN_ADDRESSES))
    const networks: Network[] = PREDEFINED_AND_TEST_NETWORKS.filter((net) =>
        set.has(net.hexChainId)
    )!

    const out: { network: Network; address: Address }[] = []

    for (let i = 0; i < networks.length; i++) {
        const network = networks[i]
        const res = await predictOne({
            keyStore,
            network,
            networkRPCMap,
            sessionPassword,
        })
        out.push(res)
    }

    return out
}

const Predictor = ({
    keyStore,
    networkRPCMap,
    sessionPassword,
}: {
    keyStore: SafeV0
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
}) => {
    const [loadable] = useLoadableData(predictAllNetworks, {
        type: 'loading',
        params: {
            keyStore,
            networkRPCMap,
            sessionPassword,
        },
    })

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
            case 'loaded':
                break
            case 'error':
                // FIXME @resetko-zeal
                // eslint-disable-next-line no-console
                console.log(loadable.error)
                break

            default:
                notReachable(loadable)
        }
    }, [loadable])

    return (
        <Group variant="default" scroll>
            {loadable.type === 'loaded' ? (
                loadable.data.map(({ address, network }) => (
                    <Text
                        variant="caption1"
                        key={network.name}
                    >{`${network.name} ${address}`}</Text>
                ))
            ) : (
                <Text variant="caption1">Loading...</Text>
            )}
        </Group>
    )
}
