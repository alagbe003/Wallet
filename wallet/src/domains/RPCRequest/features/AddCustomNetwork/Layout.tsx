import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'
import { Avatar } from 'src/domains/Currency/components/Avatar'
import { initCustomCurrency } from '@zeal/domains/Currency/helpers/initCustomCurrency'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStore } from '@zeal/domains/KeyStore'
import { CustomNetwork, Network } from '@zeal/domains/Network'
import { KNOWN_NETWORKS_MAP } from '@zeal/domains/Network/constants'
import { parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'
import { WalletAddEthereumChain } from '@zeal/domains/RPCRequest'
import { Button, IconButton } from 'src/uikit'
import { Column2 } from 'src/uikit/Column2'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { Content } from 'src/uikit/Layout/Content'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Row } from '@zeal/uikit/Row'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    request: WalletAddEthereumChain
    account: Account
    dApp: DAppSiteInfo
    network: Network
    keyStore: KeyStore

    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_minimize_click' }
    | { type: 'close' }
    | { type: 'on_network_add_clicked'; customNetwork: CustomNetwork }

export const Layout = ({
    keyStore,
    request,
    account,
    dApp,
    network,
    onMsg,
}: Props) => {
    const customNetwork = customNetworkFromRequest(request)

    return (
        <Layout2 background="light" padding="form">
            <ActionBar
                keystore={keyStore}
                network={network}
                account={account}
                right={
                    <IconButton
                        onClick={() => {
                            onMsg({ type: 'on_minimize_click' })
                        }}
                    >
                        <CloseCross size={24} />
                    </IconButton>
                }
            />
            <Column2 spacing={12} style={{ flex: '1' }}>
                <Content
                    header={
                        <Content.Header
                            title={
                                <FormattedMessage
                                    id="rpc.addCustomNetwork.title"
                                    defaultMessage="Add network"
                                />
                            }
                            subtitle={
                                <FormattedMessage
                                    id="rpc.addCustomNetwork.subtitle"
                                    defaultMessage="Using {name}"
                                    values={{
                                        name: dApp.title || dApp.hostname,
                                    }}
                                />
                            }
                        />
                    }
                >
                    <Column2 spacing={24}>
                        <Column2 spacing={16}>
                            <Column2 spacing={8}>
                                <Text2
                                    variant="footnote"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="rpc.addCustomNetwork.networkName"
                                        defaultMessage="Network name"
                                    />
                                </Text2>

                                <Text2
                                    variant="callout"
                                    weight="medium"
                                    color="textPrimary"
                                >
                                    {customNetwork.name}
                                </Text2>
                            </Column2>

                            <Column2 spacing={8}>
                                <Text2
                                    variant="footnote"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="rpc.addCustomNetwork.chainId"
                                        defaultMessage="Chain ID"
                                    />
                                </Text2>

                                <Text2
                                    variant="callout"
                                    weight="medium"
                                    color="textPrimary"
                                >
                                    {customNetwork.hexChainId}
                                </Text2>
                            </Column2>

                            <Column2 spacing={8}>
                                <Text2
                                    variant="footnote"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="rpc.addCustomNetwork.rpcUrl"
                                        defaultMessage="RPC URL"
                                    />
                                </Text2>

                                <Text2
                                    variant="callout"
                                    weight="medium"
                                    color="textPrimary"
                                >
                                    {customNetwork.rpcUrl}
                                </Text2>
                            </Column2>

                            <Column2 spacing={8}>
                                <Text2
                                    variant="footnote"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="rpc.addCustomNetwork.nativeToken"
                                        defaultMessage="Native token"
                                    />
                                </Text2>

                                <Row spacing={12}>
                                    <Avatar
                                        currency={customNetwork.nativeCurrency}
                                        size={32}
                                    />

                                    <Text2
                                        variant="callout"
                                        weight="medium"
                                        color="textPrimary"
                                    >
                                        {customNetwork.nativeCurrency.symbol}
                                    </Text2>
                                </Row>
                            </Column2>
                        </Column2>

                        <Text2
                            variant="footnote"
                            weight="regular"
                            color="textSecondary"
                        >
                            <FormattedMessage
                                id="rpc.addCustomNetwork.operationDescription"
                                defaultMessage="Allows this website to add a network to your wallet. Zeal cannot check the safety of custom networks, make sure you understand the risks."
                            />
                        </Text2>
                    </Column2>
                </Content>

                <Row spacing={8}>
                    <Button
                        variant="secondary"
                        size="regular"
                        onClick={() => {
                            onMsg({
                                type: 'close',
                            })
                        }}
                    >
                        <FormattedMessage
                            id="action.cancel"
                            defaultMessage="Cancel"
                        />
                    </Button>

                    <Button
                        variant="primary"
                        size="regular"
                        onClick={() => {
                            onMsg({
                                type: 'on_network_add_clicked',
                                customNetwork,
                            })
                        }}
                    >
                        <FormattedMessage
                            id="rpc.addCustomNetwork.addNetwork"
                            defaultMessage="Add network"
                        />
                    </Button>
                </Row>
            </Column2>
        </Layout2>
    )
}

const customNetworkFromRequest = (
    request: WalletAddEthereumChain
): CustomNetwork => {
    const requestData = request.params[0]
    const chainId = parseNetworkHexId(
        requestData.chainId.toLowerCase()
    ).getSuccessResultOrThrow(
        'Impossible state: chainId is null adding custom network'
    )

    const rpcUrl = requestData.rpcUrls[0]
    return {
        type: 'custom',
        hexChainId: chainId,
        blockExplorerUrl: requestData.blockExplorerUrls[0],
        defaultRpcUrl: rpcUrl,
        rpcUrl,
        isSimulationSupported: false,
        isZealRPCSupported: false,
        name: requestData.chainName,
        nativeCurrency: initCustomCurrency({
            address: parseAddress(
                '0x0000000000000000000000000000000000000000'
            ).getSuccessResultOrThrow('parse const address'),
            id: `${chainId}+ETH+Native`,
            fraction: requestData.nativeCurrency.decimals,
            icon:
                iconUrlFromKnownNetworks(chainId) ||
                requestData.iconUrls?.at(0) ||
                null,
            networkHexChainId: chainId,
            symbol: requestData.nativeCurrency.symbol,
        }),
        trxType: 'legacy',
    }
}

const iconUrlFromKnownNetworks = (chainId: string): string | null => {
    const chain = KNOWN_NETWORKS_MAP[chainId]

    if (!chain || !chain.icon) {
        return null
    }

    return `/chain-icons/${chain.icon}.png`
}
