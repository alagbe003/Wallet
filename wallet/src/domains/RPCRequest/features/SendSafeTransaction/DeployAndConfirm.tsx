import { EthSafeSignature } from '@safe-global/protocol-kit'
import { GelatoRelayPack } from '@safe-global/relay-kit'
import {
    MetaTransactionData,
    RelayTransaction,
} from '@safe-global/safe-core-sdk-types'
import { generateSignTypedMessageV4 } from '@zeal/domains/Account/helpers/generateSignTypedMessageV4'
import { CryptoCurrency } from '@zeal/domains/Currency'
import { ImperativeError } from '@zeal/domains/Error'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { SafeV0 } from '@zeal/domains/KeyStore'
import { generateSecretPhraseAddressOnPath } from '@zeal/domains/KeyStore/helpers/generateSecretPhraseAddress'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'
import { signMessage } from '@zeal/domains/RPCRequest/helpers/signMessage'
import { notReachable } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { bigint } from '@zeal/toolkit/Result'
import { useEffect } from 'react'
import { AppErrorPopup } from 'src/domains/Error/components/AppErrorPopup'
import { getPredictedSafeInstance } from 'src/domains/KeyStore/helpers/getPredictedSafeInstance'
import { Button } from 'src/uikit'
import { Column2 } from 'src/uikit/Column2'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { LoadingLayout } from 'src/uikit/LoadingLayout'
import { SuccessLayout } from 'src/uikit/SuccessLayout'
import { getRelayedTransactionHash } from './getRelayedTransactionHash'

type Props = {
    keyStore: SafeV0
    gasCurrency: CryptoCurrency
    network: Network
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
    rpcRequestToBundle: EthSendTransaction
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_sign_cancel_button_clicked' }
    | { type: 'on_transaction_relayed'; transactionHash: string }

const isNativeToken = ({
    cryptoCurrency,
    network,
}: {
    cryptoCurrency: CryptoCurrency
    network: Network
}): boolean => {
    switch (network.type) {
        case 'predefined':
            return cryptoCurrency.address === network.gasTokenAddress

        case 'custom':
        case 'testnet':
            return cryptoCurrency.address === network.nativeCurrency.address

        default:
            return notReachable(network)
    }
}

const createSafeDeploymentBundle = async ({
    keyStore,
    networkRPCMap,
    network,
    sessionPassword,
    rpcRequestToBundle,
    gasCurrency,
}: {
    network: Network
    keyStore: SafeV0
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
    rpcRequestToBundle: EthSendTransaction
    gasCurrency: CryptoCurrency
}): Promise<string> => {
    const ownerKeyStore = keyStore.safeDeplymentConfig.ownerKeyStore
    const secretPhraseAddress = await generateSecretPhraseAddressOnPath({
        encryptedPhrase: ownerKeyStore.encryptedPhrase,
        path: ownerKeyStore.bip44Path,
        sessionPassword,
    })

    const safe = await getPredictedSafeInstance({
        safeDeplymentConfig: keyStore.safeDeplymentConfig,
        network,
        networkRPCMap,
        sessionPassword,
    })

    const safeAddress = await safe.getAddress()

    if (safeAddress !== keyStore.address) {
        throw new ImperativeError(
            `Safe address mismatch ${safeAddress} vs keystore ${keyStore.address}`
        )
    }

    const requestData = rpcRequestToBundle.params[0]

    if (!requestData.to) {
        throw new ImperativeError(
            'Cannot bundle transaction without `to` address'
        )
    }

    const metaTransactionData: MetaTransactionData = {
        data: requestData.data,
        to: requestData.to,
        value: requestData.value || '0x0',
    }

    const relayPack = new GelatoRelayPack()

    const safeTrx = await relayPack.createRelayedTransaction({
        safe,
        transactions: [metaTransactionData],
        options: {
            gasToken: isNativeToken({ cryptoCurrency: gasCurrency, network })
                ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' // Gelato expects this address for native tokens
                : gasCurrency.address,
        },
    })

    const safeTrxSignMessageRequest = await generateSignTypedMessageV4({
        safe,
        safeTransaction: safeTrx,
        signer: secretPhraseAddress.address,
    })

    safeTrx.addSignature(
        new EthSafeSignature(
            secretPhraseAddress.address,
            await signMessage({
                request: safeTrxSignMessageRequest,
                keyStore: ownerKeyStore,
                sessionPassword,
                network,
            })
        )
    )

    const deployWithResetkoTransaction: MetaTransactionData =
        await safe.wrapSafeTransactionIntoDeploymentBatch(
            safeTrx,
            {},
            keyStore.safeDeplymentConfig.saltNonce
        )

    // eslint-disable-next-line no-console
    console.log('transaction before relaying', deployWithResetkoTransaction)

    const estimate =
        (await fetchRPCResponse({
            network,
            networkRPCMap,
            request: {
                id: generateRandomNumber(),
                jsonrpc: '2.0',
                method: 'eth_estimateGas',
                params: [
                    {
                        from: secretPhraseAddress.address,
                        to: deployWithResetkoTransaction.to,
                        data: deployWithResetkoTransaction.data,
                    },
                ],
            },
        }).then((response) =>
            bigint(response).getSuccessResultOrThrow(
                'failed to parse gas estimate'
            )
        )) + 150_000n

    const gasLimit = estimate

    const estimatedFee = await relayPack.getEstimateFee(
        Number(network.hexChainId),
        `0x${gasLimit.toString(16)}`,
        gasCurrency.address
    )

    // eslint-disable-next-line no-console
    console.log('relay transaction gas limit', gasLimit, 'fee', estimatedFee)

    const relayedTxn: RelayTransaction = {
        target: deployWithResetkoTransaction.to,
        encodedTransaction: deployWithResetkoTransaction.data,
        chainId: Number(network.hexChainId),
        options: {
            gasToken: isNativeToken({ cryptoCurrency: gasCurrency, network })
                ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' // Gelato expects this address for native tokens
                : gasCurrency.address,
        },
    }

    const relayResult = await relayPack.relayTransaction(relayedTxn)

    return getRelayedTransactionHash(relayResult.taskId)
}

export const DeployAndConfirm = ({
    onMsg,
    keyStore,
    networkRPCMap,
    sessionPassword,
    rpcRequestToBundle,
    network,
    gasCurrency,
}: Props) => {
    const [loadable, setLoadable] = useLazyLoadableData(
        createSafeDeploymentBundle,
        { type: 'not_asked' }
    )

    useEffect(() => {
        switch (loadable.type) {
            case 'not_asked':
            case 'loading':
                break
            case 'error':
                // console.error(loadable.error)
                break
            case 'loaded':
                // console.log(`Safe deployed at ${loadable.data}`)
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [loadable])

    switch (loadable.type) {
        case 'not_asked':
            return (
                <Layout2 padding="main" background="light">
                    <Column2 spacing={16}>
                        <Button
                            size="regular"
                            variant="primary"
                            onClick={() =>
                                setLoadable({
                                    type: 'loading',
                                    params: {
                                        gasCurrency,
                                        keyStore,
                                        networkRPCMap,
                                        network,
                                        sessionPassword,
                                        rpcRequestToBundle,
                                    },
                                })
                            }
                        >
                            Deploy and confirm
                        </Button>
                        <Button
                            size="regular"
                            variant="primary"
                            onClick={() =>
                                onMsg({ type: 'on_sign_cancel_button_clicked' })
                            }
                        >
                            BACK
                        </Button>
                    </Column2>
                </Layout2>
            )

        case 'loading':
            return <LoadingLayout actionBar={null} />
        case 'loaded':
            return (
                <SuccessLayout
                    title="Safe deploy with trx sent to relayer"
                    onAnimationComplete={() =>
                        onMsg({
                            type: 'on_transaction_relayed',
                            transactionHash: loadable.data,
                        })
                    }
                />
            )

        case 'error':
            return (
                <AppErrorPopup
                    error={parseAppError(loadable.error)}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg({ type: 'on_sign_cancel_button_clicked' })
                                break

                            case 'try_again_clicked':
                                setLoadable({
                                    type: 'loading',
                                    params: loadable.params,
                                })
                                break

                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
