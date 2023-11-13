import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { NotSigned } from '@zeal/domains/TransactionRequest'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

import { isEditNetworkFeeEnabled } from './helpers/isEditFeeEnabled'
import { EditEnabled } from './EditEnabled'
import { EditDisabled } from './EditDisabled'
import { KeyStore } from '@zeal/domains/KeyStore'

type Props = {
    pollableData: PollableData<FeeForecastResponse, FeeForecastRequest>
    simulateTransactionResponse: SimulationResult
    nonce: number
    gasEstimate: string
    transactionRequest: NotSigned
    pollingInterval: number
    pollingStartedAt: number
    keystore: KeyStore
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_forecast_fee_click' }
    | { type: 'on_forecast_fee_error_reload_click' }
    | {
          type: 'on_forecast_subsequent_failed_reload_click'
          data: FeeForecastResponse
      }

export const FeeForecastWidget = ({
    pollableData,
    simulateTransactionResponse,
    nonce,
    transactionRequest,
    pollingInterval,
    pollingStartedAt,
    gasEstimate,
    keystore,
    onMsg,
}: Props) => {
    return isEditNetworkFeeEnabled(pollableData.params.network) ? (
        <EditEnabled
            keystore={keystore}
            nonce={nonce}
            gasEstimate={gasEstimate}
            pollableData={pollableData}
            simulateTransactionResponse={simulateTransactionResponse}
            transactionRequest={transactionRequest}
            pollingInterval={pollingInterval}
            pollingStartedAt={pollingStartedAt}
            onMsg={onMsg}
        />
    ) : (
        <EditDisabled
            keystore={keystore}
            nonce={nonce}
            gasEstimate={gasEstimate}
            pollableData={pollableData}
            simulateTransactionResponse={simulateTransactionResponse}
            transactionRequest={transactionRequest}
            pollingInterval={pollingInterval}
            pollingStartedAt={pollingStartedAt}
            onMsg={onMsg}
        />
    )
}
