import Safe, {
    ContractNetworksConfig,
    PredictedSafeProps,
} from '@safe-global/protocol-kit'
import {
    getCreateCallDeployment,
    getMultiSendCallOnlyDeployment,
    getMultiSendDeployment,
    getSignMessageLibDeployment,
    getSimulateTxAccessorDeployment,
} from '@safe-global/safe-deployments'

import { ImperativeError } from '@zeal/domains/Error'
import { SafeV0 } from '@zeal/domains/KeyStore'
import { generateSecretPhraseAddressOnPath } from '@zeal/domains/KeyStore/helpers/generateSecretPhraseAddress'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { createZealSafeCompatibleEthAdapter } from '@zeal/domains/RPCRequest/helpers/createZealSafeCompatibleEthAdapter'

const SAFE_VERSION = '1.3.0'

const getSafeL2ContractNetworksConfig = ({
    network,
}: {
    network: Network
}): ContractNetworksConfig => {
    const deploymentConfig = {
        version: SAFE_VERSION,
        released: true,
    }

    const networkDecimalId = BigInt(network.hexChainId).toString(10)

    /**
     * Those contracts are not affecting address predictions,
     * but their correct selection is crucial for deployment and transactions,
     * so we select them automatically based on recommendation
     */
    const contracts = {
        createCallAddress:
            getCreateCallDeployment(deploymentConfig)?.networkAddresses[
                networkDecimalId
            ],
        multiSendAddress:
            getMultiSendDeployment(deploymentConfig)?.networkAddresses[
                networkDecimalId
            ],
        signMessageLibAddress:
            getSignMessageLibDeployment(deploymentConfig)?.networkAddresses[
                networkDecimalId
            ],
        simulateTxAccessorAddress:
            getSimulateTxAccessorDeployment(deploymentConfig)?.networkAddresses[
                networkDecimalId
            ],
        multiSendCallOnlyAddress:
            getMultiSendCallOnlyDeployment(deploymentConfig)?.networkAddresses[
                networkDecimalId
            ],
    }

    if (!contracts.createCallAddress) {
        throw new ImperativeError(
            `Failed to find createCallAddress for ${network.name}`
        )
    }

    if (!contracts.multiSendAddress) {
        throw new ImperativeError(
            `Failed to find multiSendAddress for ${network.name}`
        )
    }

    if (!contracts.signMessageLibAddress) {
        throw new ImperativeError(
            `Failed to find signMessageLibAddress for ${network.name}`
        )
    }

    if (!contracts.simulateTxAccessorAddress) {
        throw new ImperativeError(
            `Failed to find simulateTxAccessorAddress for ${network.name}`
        )
    }

    if (!contracts.multiSendCallOnlyAddress) {
        throw new ImperativeError(
            `Failed to find multiSendCallOnlyAddress for ${network.name}`
        )
    }

    return {
        [networkDecimalId]: {
            safeMasterCopyAddress: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
            safeProxyFactoryAddress:
                '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
            fallbackHandlerAddress:
                '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',

            multiSendAddress: contracts.multiSendAddress,
            multiSendCallOnlyAddress: contracts.multiSendCallOnlyAddress,
            createCallAddress: contracts.createCallAddress,
            signMessageLibAddress: contracts.signMessageLibAddress,
            simulateTxAccessorAddress: contracts.simulateTxAccessorAddress,
        },
    }
}

export const getPredictedSafeInstance = async ({
    safeDeplymentConfig,
    network,
    networkRPCMap,
    sessionPassword,
}: {
    safeDeplymentConfig: SafeV0['safeDeplymentConfig']
    network: Network
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
}): Promise<Safe> => {
    const ownerKeyStore = safeDeplymentConfig.ownerKeyStore
    const secretPhraseAddress = await generateSecretPhraseAddressOnPath({
        encryptedPhrase: ownerKeyStore.encryptedPhrase,
        path: ownerKeyStore.bip44Path,
        sessionPassword,
    })

    const ethAdapter = createZealSafeCompatibleEthAdapter({
        network,
        networkRPCMap,
    })

    const predictedSafe: PredictedSafeProps = {
        safeDeploymentConfig: {
            saltNonce: safeDeplymentConfig.saltNonce,
            safeVersion: SAFE_VERSION,
        },
        safeAccountConfig: {
            owners: [secretPhraseAddress.address],
            threshold: safeDeplymentConfig.threshold,
        },
    }

    const contractNetworks = getSafeL2ContractNetworksConfig({ network })

    const predictedSafeInstance = await Safe.create({
        ethAdapter,
        predictedSafe,
        contractNetworks,
    })

    if (await predictedSafeInstance.isSafeDeployed()) {
        return Safe.create({
            ethAdapter,
            safeAddress: await predictedSafeInstance.getAddress(),
            contractNetworks,
        })
    } else {
        return predictedSafeInstance
    }
}
