import React from 'react'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { Header } from './Header'
import { SelectPreset, Msg as SelectPresetMsg } from './SelectPreset'
import { NotSigned } from '@zeal/domains/TransactionRequest'
import { Custom, Msg as EditCustomPresetMsg } from './Custom'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { IconButton } from 'src/uikit'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { Column2 } from 'src/uikit/Column2'
import { useIntl } from 'react-intl'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { MsgOf } from '@zeal/toolkit/MsgOf'

type Props = {
    pollableData: PollableData<FeeForecastResponse, FeeForecastRequest>
    pollingInterval: number
    pollingStartedAt: number
    simulateTransactionResponse: SimulationResult
    nonce: number
    gasEstimate: string
    transactionRequest: NotSigned
    keystoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | SelectPresetMsg
    | EditCustomPresetMsg
    | MsgOf<typeof Header>

export const Layout = ({
    pollableData,
    transactionRequest,
    simulateTransactionResponse,
    nonce,
    gasEstimate,
    onMsg,
    pollingInterval,
    pollingStartedAt,
    keystoreMap,
}: Props) => {
    const { formatMessage } = useIntl()

    return (
        <Layout2
            background="light"
            padding="form"
            aria-label={formatMessage({
                id: 'EditFeeModal.ariaLabel',
                defaultMessage: 'Edit network fee',
            })}
        >
            <ActionBar
                left={
                    <IconButton
                        onClick={() => onMsg({ type: 'close' })}
                        aria-label={formatMessage({
                            id: 'actions.back',
                            defaultMessage: 'Back',
                        })}
                    >
                        <BackIcon size={24} />
                    </IconButton>
                }
            />

            <Column2 spacing={16}>
                <Header
                    pollableData={pollableData}
                    pollingInterval={pollingInterval}
                    pollingStartedAt={pollingStartedAt}
                    transactionRequest={transactionRequest}
                    onMsg={onMsg}
                />

                <SelectPreset
                    onMsg={onMsg}
                    transactionRequest={transactionRequest}
                    pollableData={pollableData}
                />

                <Custom
                    keyStoreMap={keystoreMap}
                    nonce={nonce}
                    gasEstimate={gasEstimate}
                    transactionRequest={transactionRequest}
                    simulateTransactionResponse={simulateTransactionResponse}
                    pollableData={pollableData}
                    onMsg={onMsg}
                />
            </Column2>
        </Layout2>
    )
}
