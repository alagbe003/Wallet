import { Account } from '@zeal/domains/Account'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStore } from '@zeal/domains/KeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { SignMessageRequest } from '@zeal/domains/RPCRequest'
import { SignMessageSimulationResponse } from 'src/domains/RPCRequest/domains/SignMessageSimulation'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { IconButton } from 'src/uikit'
import { Column2 } from 'src/uikit/Column2'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { Content as LayoutContent } from 'src/uikit/Layout/Content'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { ActionButtons } from './ActionButtons'
import { Content } from './Content'
import { Footer } from './Footer'
import { Header } from './Header'

type Props = {
    simulationResponse: SignMessageSimulationResponse
    account: Account
    keyStore: KeyStore
    isLoading: boolean
    dApp: DAppSiteInfo
    request: SignMessageRequest
    networkMap: NetworkMap
    network: Network
    nowTimestampMs: number
    onMsg: (msg: Msg) => void
}

type Msg =
    | MsgOf<typeof Header>
    | MsgOf<typeof Content>
    | MsgOf<typeof Footer>
    | MsgOf<typeof ActionButtons>
    | { type: 'on_minimize_click' }

export const Layout = ({
    dApp,
    onMsg,
    keyStore,
    isLoading,
    request,
    networkMap,
    network,
    account,
    simulationResponse,
    nowTimestampMs,
}: Props) => {
    return (
        <Layout2 background="light" padding="form">
            <ActionBar
                keystore={keyStore}
                account={account}
                network={network}
                right={
                    <IconButton
                        onClick={() => onMsg({ type: 'on_minimize_click' })}
                    >
                        <CloseCross size={24} />
                    </IconButton>
                }
            />
            <Column2 spacing={12} style={{ flex: '1' }}>
                <LayoutContent
                    header={
                        <Header
                            dApp={dApp}
                            onMsg={onMsg}
                            simulatedSignMessage={simulationResponse.message}
                        />
                    }
                    footer={
                        <Footer
                            networkMap={networkMap}
                            knownCurrencies={simulationResponse.currencies}
                            safetyChecks={simulationResponse.checks}
                            simulatedSignMessage={simulationResponse.message}
                            onMsg={onMsg}
                        />
                    }
                >
                    <Content
                        nowTimestampMs={nowTimestampMs}
                        request={request}
                        knownCurrencies={simulationResponse.currencies}
                        safetyChecks={simulationResponse.checks}
                        simulatedSignMessage={simulationResponse.message}
                        onMsg={onMsg}
                    />
                </LayoutContent>

                <ActionButtons
                    request={request}
                    isLoading={isLoading}
                    keyStore={keyStore}
                    safetyChecks={simulationResponse.checks}
                    onMsg={onMsg}
                />
            </Column2>
        </Layout2>
    )
}
