import React, { useState } from 'react'
import { Address } from '@zeal/domains/Address'
import { FormattedMessage } from 'react-intl'
import { Account, AccountsMap } from '@zeal/domains/Account'
import {
    CurrentNetwork,
    CustomNetwork,
    NetworkMap,
    NetworkRPCMap,
    TestNetwork,
} from '@zeal/domains/Network'
import { notReachable } from '@zeal/toolkit'
import { Tokens } from 'src/uikit/Icon/Empty'
import { TransactionList } from 'src/domains/Transactions/components/TransactionList'

import {
    List as TransactionRequestList,
    Msg as TransactionRequestListMsg,
} from 'src/domains/TransactionRequest/features/List'
import { Submited } from '@zeal/domains/TransactionRequest'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'
import { EmptyStateWidget } from 'src/uikit/EmptyStateWidget'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { ExternalLink } from 'src/uikit/Icon/ExternalLink'
import { BridgeWidget } from 'src/domains/Currency/features/BridgeWidget'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import {
    BridgeSubmitted,
    SubmitedBridgesMap,
} from '@zeal/domains/Currency/domains/Bridge'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { Row } from '@zeal/uikit/Row'
import { Name } from '@zeal/domains/Network/components/Name'
import { Filter2 } from 'src/uikit/Icon/Filter2'
import { IconButton } from 'src/uikit'
import { Spam } from 'src/uikit/Icon/Spam'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Screen } from '@zeal/uikit/Screen'
import { Column } from '@zeal/uikit/Column'
import { Text } from '@zeal/uikit/Text'

type Props = {
    transactionRequests: Record<Address, Submited[]>
    networkMap: NetworkMap
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    account: Account
    selectedNetwork: CurrentNetwork
    networkRPCMap: NetworkRPCMap
    submitedBridgesMap: SubmitedBridgesMap
    keystore: KeyStore
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'network_filter_click' | 'on_hidden_activity_icon_click' }
    | TransactionRequestListMsg
    | MsgOf<typeof BridgeWidget>
    | MsgOf<typeof TransactionList>

export const Layout = ({
    account,
    selectedNetwork,
    networkRPCMap,
    transactionRequests,
    accountsMap,
    keystore,
    keyStoreMap,
    onMsg,
    submitedBridgesMap,
    networkMap,
}: Props) => {
    // Capture array so it won't change only after remount
    const [cachedTransactionRequests] = useState<Submited[]>(
        transactionRequests[account.address] || []
    )
    const [bridges] = useState<BridgeSubmitted[]>(
        submitedBridgesMap[account.address] || []
    )

    return (
        <Screen padding="form" background="light">
            <ActionBar
                account={account}
                keystore={keystore}
                network={null}
                right={
                    <Row shrink={false} spacing={0}>
                        <Tertiary
                            size="small"
                            color="on_light"
                            onClick={() => {
                                onMsg({ type: 'network_filter_click' })
                            }}
                        >
                            <Name currentNetwork={selectedNetwork} />
                            <Filter2 size={14} />
                        </Tertiary>
                    </Row>
                }
            />
            <Column spacing={12} shrink>
                <Row spacing={0}>
                    <Text
                        id="activity-title"
                        variant="title3"
                        weight="semi_bold"
                        color="textPrimary"
                    >
                        <FormattedMessage
                            id="transactions.page.title"
                            defaultMessage="Activity"
                        />
                    </Text>
                    <Spacer2 />
                    {(() => {
                        switch (selectedNetwork.type) {
                            case 'all_networks':
                                return (
                                    <IconButton
                                        onClick={() =>
                                            onMsg({
                                                type: 'on_hidden_activity_icon_click',
                                            })
                                        }
                                    >
                                        <Spam size={20} />
                                    </IconButton>
                                )
                            case 'specific_network':
                                const net = selectedNetwork.network
                                switch (net.type) {
                                    case 'predefined':
                                        return (
                                            <IconButton
                                                onClick={() =>
                                                    onMsg({
                                                        type: 'on_hidden_activity_icon_click',
                                                    })
                                                }
                                            >
                                                <Spam size={20} />
                                            </IconButton>
                                        )

                                    case 'custom':
                                    case 'testnet':
                                        return null

                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(net)
                                }
                            /* istanbul ignore next */
                            default:
                                return notReachable(selectedNetwork)
                        }
                    })()}
                </Row>

                {bridges.length > 0 && (
                    <Column spacing={8}>
                        {bridges.map((bridge) => (
                            <BridgeWidget
                                key={bridge.sourceTransactionHash}
                                bridgeSubmitted={bridge}
                                onMsg={onMsg}
                            />
                        ))}
                    </Column>
                )}

                {cachedTransactionRequests.length > 0 && (
                    <TransactionRequestList
                        accountsMap={accountsMap}
                        keyStoreMap={keyStoreMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        transactionRequests={cachedTransactionRequests}
                        onMsg={onMsg}
                    />
                )}

                {(() => {
                    switch (selectedNetwork.type) {
                        case 'all_networks':
                            return (
                                <TransactionList
                                    scam={false}
                                    onMsg={onMsg}
                                    account={account}
                                    accountsMap={accountsMap}
                                    networkMap={networkMap}
                                    selectedNetwork={selectedNetwork}
                                />
                            )
                        case 'specific_network':
                            const net = selectedNetwork.network
                            switch (net.type) {
                                case 'predefined':
                                    return (
                                        <TransactionList
                                            scam={false}
                                            onMsg={onMsg}
                                            account={account}
                                            accountsMap={accountsMap}
                                            networkMap={networkMap}
                                            selectedNetwork={selectedNetwork}
                                        />
                                    )

                                case 'custom':
                                case 'testnet':
                                    return <TestNetworkStub testNetwork={net} />

                                /* istanbul ignore next */
                                default:
                                    return notReachable(net)
                            }
                        /* istanbul ignore next */
                        default:
                            return notReachable(selectedNetwork)
                    }
                })()}
            </Column>
        </Screen>
    )
}

const TestNetworkStub = ({
    testNetwork,
}: {
    testNetwork: TestNetwork | CustomNetwork
}) => (
    <EmptyStateWidget
        size="regular"
        icon={({ size }) => <Tokens size={size} color="backgroundLight" />}
        title={
            <FormattedMessage
                id="transactions.viewTRXHistory.noTxHistoryForTestNets"
                defaultMessage="Activity not supported for testnets{br}<link>Go to block explorer</link>"
                values={{
                    br: <br />,
                    link: (msg) => (
                        <Tertiary
                            inline
                            size="regular"
                            color="on_light"
                            onClick={() =>
                                window.open(testNetwork.blockExplorerUrl)
                            }
                        >
                            {msg}
                            <ExternalLink size={14} />
                        </Tertiary>
                    ),
                }}
            />
        }
    />
)
