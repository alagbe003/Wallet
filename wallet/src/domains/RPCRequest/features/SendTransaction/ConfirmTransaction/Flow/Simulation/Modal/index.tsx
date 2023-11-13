import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { KnownCurrencies } from '@zeal/domains/Currency'

import { SafetyChecks } from './SafetyChecks'
import { UserConfirmationRequired } from '../helpers/validation'
import {
    UserConfirmationPopup,
    Msg as UserConfirmationPopupMsg,
} from './UserConfirmationPopup'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { NotSigned } from '@zeal/domains/TransactionRequest'

import { EditFeeModal, Msg as EditFeeModalMsg } from '../../../../EditFeeModal'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { ApprovalInfo } from 'src/domains/Transactions/domains/SimulatedTransaction/components/ApprovalInfo'

type Props = {
    state: State
    knownCurrencies: KnownCurrencies
    pollingStartedAt: number

    pollable: PollableData<FeeForecastResponse, FeeForecastRequest>
    pollingInterval: number
    simulateTransactionResponse: SimulateTransactionResponse
    nonce: number
    gasEstimate: string
    transactionRequest: NotSigned
    keystoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

export type State =
    | { type: 'closed' }
    | { type: 'safety_checks' }
    | { type: 'user_confirmation_required'; reason: UserConfirmationRequired }
    | { type: 'edit_fee_modal' }
    | { type: 'approval_info' }

export type Msg = { type: 'close' } | UserConfirmationPopupMsg | EditFeeModalMsg

export const Modal = ({
    state,
    pollingStartedAt,
    knownCurrencies,
    simulateTransactionResponse,
    nonce,
    gasEstimate,
    transactionRequest,
    pollingInterval,
    pollable,
    keystoreMap,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'approval_info':
            return <ApprovalInfo onMsg={onMsg} />

        case 'edit_fee_modal':
            return (
                <UIModal>
                    <EditFeeModal
                        keystoreMap={keystoreMap}
                        gasEstimate={gasEstimate}
                        nonce={nonce}
                        pollable={pollable}
                        pollingInterval={pollingInterval}
                        pollingStartedAt={pollingStartedAt}
                        simulateTransactionResponse={{
                            type: 'simulated',
                            simulation: simulateTransactionResponse,
                        }}
                        transactionRequest={transactionRequest}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'user_confirmation_required':
            return <UserConfirmationPopup onMsg={onMsg} reason={state.reason} />

        case 'safety_checks':
            return (
                <SafetyChecks
                    knownCurrencies={knownCurrencies}
                    simulateTransactionResponse={simulateTransactionResponse}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
