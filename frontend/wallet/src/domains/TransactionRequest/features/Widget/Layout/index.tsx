import { Submited } from '@zeal/domains/TransactionRequest'
import { Title } from './Title'
import { Progress } from './Progress'
import { Label } from './Label'
import { Text2 } from 'src/uikit/Text2'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { NetworkMap } from '@zeal/domains/Network'
import { Column2 } from 'src/uikit/Column2'
import { Row } from '@zeal/uikit/Row'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Group } from 'src/uikit/Group'
import { Avatar } from './Avatar'
import { Subtitle } from './Subtitle'
import { AccountsMap } from '@zeal/domains/Account'
import { useState } from 'react'
import { useCurrentTimestamp } from 'src/toolkit/Date/useCurrentTimestamp'
import { Timing } from './Timing'
import { KeyStoreMap, SigningKeyStore } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { notReachable } from '@zeal/toolkit'

type Props = {
    transactionRequest: Submited
    networkMap: NetworkMap
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'on_transaction_request_widget_click'
    transactionRequest: Submited
    keyStore: SigningKeyStore
}

export const Layout = ({
    transactionRequest,
    networkMap,
    keyStoreMap,
    onMsg,
    accountsMap,
}: Props) => {
    const { account } = transactionRequest
    const keyStore = getKeyStore({ address: account.address, keyStoreMap })

    switch (keyStore.type) {
        case 'track_only':
            return (
                <WidgetLayout
                    transactionRequest={transactionRequest}
                    networkMap={networkMap}
                    accountsMap={accountsMap}
                />
            )
        case 'private_key_store':
        case 'ledger':
        case 'secret_phrase_key':
        case 'trezor':
        case 'safe_v0':
            return (
                <div
                    role="button"
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                        onMsg({
                            type: 'on_transaction_request_widget_click',
                            transactionRequest,
                            keyStore,
                        })
                    }
                >
                    <WidgetLayout
                        transactionRequest={transactionRequest}
                        networkMap={networkMap}
                        accountsMap={accountsMap}
                    />
                </div>
            )
        /* istanbul ignore next */
        default:
            return notReachable(keyStore)
    }
}

const WidgetLayout = ({
    transactionRequest,
    networkMap,
    accountsMap,
}: {
    transactionRequest: Submited
    networkMap: NetworkMap
    accountsMap: AccountsMap
}) => {
    const [labelId] = useState(crypto.randomUUID())
    const nowTimestampMs = useCurrentTimestamp({ refreshIntervalMs: 1000 })
    const network = findNetworkByHexChainId(
        transactionRequest.networkHexId,
        networkMap
    )
    const { submitedTransaction, simulation } = transactionRequest

    return (
        <Group variant="default" aria-labelledby={labelId}>
            <Column2 spacing={12}>
                <Row spacing={12}>
                    <Avatar
                        network={network}
                        simulatedTransaction={simulation}
                    />
                    <Column2 spacing={4}>
                        <Text2
                            id={labelId}
                            ellipsis
                            variant="paragraph"
                            weight="medium"
                            color="textPrimary"
                        >
                            <Title simulationResult={simulation} />
                        </Text2>

                        <Row spacing={8}>
                            <Text2
                                variant="footnote"
                                ellipsis
                                weight="regular"
                                color="textSecondary"
                            >
                                <Subtitle
                                    transactionRequest={transactionRequest}
                                    accountsMap={accountsMap}
                                />
                            </Text2>

                            <Spacer2 />

                            <Label
                                submitedTransaction={submitedTransaction}
                                network={network}
                            />
                            <Timing
                                nowTimestampMs={nowTimestampMs}
                                submittedTransaction={submitedTransaction}
                            />
                        </Row>
                    </Column2>
                </Row>
                <Progress submitedTransaction={submitedTransaction} />
            </Column2>
        </Group>
    )
}
