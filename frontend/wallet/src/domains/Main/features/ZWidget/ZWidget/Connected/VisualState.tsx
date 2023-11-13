import { useEffect, useState } from 'react'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { Connected as ConnectedState } from 'src/domains/DApp/domains/ConnectionState'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { InteractionRequest } from '@zeal/domains/RPCRequest'
import { notReachable, useLiveRef } from '@zeal/toolkit'
import { DragAndDropBar } from 'src/uikit/DragAndClickHandler'
import {
    AccessChecker,
    Msg as AccessCheckerMsg,
    State as AccessCheckerState,
} from './AccessChecker'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { PortfolioMap } from '@zeal/domains/Portfolio'

type Props = {
    encryptedPassword: string
    sessionPassword: string | null

    account: Account
    network: Network
    keyStore: KeyStore

    accounts: AccountsMap
    keystores: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    portfolioMap: PortfolioMap

    installationId: string

    interactionRequest: InteractionRequest

    connectionState: ConnectedState

    onMsg: (msg: Msg) => void
}

type State = AccessCheckerState

export type Msg =
    | Extract<
          AccessCheckerMsg,
          {
              type:
                  | 'on_cancel_confirm_transaction_clicked'
                  | 'keystore_added'
                  | 'transaction_submited'
                  | 'cancel_submitted'
                  | 'session_password_decrypted'
                  | 'transaction_cancel_failure_accepted'
                  | 'transaction_cancel_success'
                  | 'on_completed_transaction_close_click'
                  | 'transaction_failure_accepted'
                  | 'transaction_cancelled_accepted'
                  | 'drag'
                  | 'message_signed'
                  | 'cancel_button_click'
                  | 'on_sign_cancel_button_clicked'
                  | 'import_keys_button_clicked'
                  | 'on_transaction_completed_splash_animation_screen_competed'
                  | 'close'
                  | 'on_network_add_clicked'
                  | 'on_predefined_fee_preset_selected'
                  | 'on_transaction_relayed'
          }
      >
    | { type: 'expanded' }
    | { type: 'minimized' }

export const VisualState = ({
    connectionState,
    onMsg,
    account,
    keyStore,
    network,
    sessionPassword,
    encryptedPassword,
    interactionRequest,
    keystores,
    installationId,
    networkMap,
    networkRPCMap,
    feePresetMap,
    accounts,
    portfolioMap,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'maximised' })
    const liveMsg = useLiveRef(onMsg)

    useEffect(() => {
        switch (state.type) {
            case 'minimised':
                liveMsg.current({ type: 'minimized' })
                break
            case 'maximised':
                liveMsg.current({ type: 'expanded' })
                break
            /* istanbul ignore next */
            default:
                return notReachable(state)
        }
    }, [liveMsg, state])

    return (
        <>
            {(() => {
                switch (state.type) {
                    case 'minimised':
                        return null
                    case 'maximised':
                        return <DragAndDropBar onMsg={onMsg} />
                    /* istanbul ignore next */
                    default:
                        return notReachable(state)
                }
            })()}
            <AccessChecker
                portfolioMap={portfolioMap}
                feePresetMap={feePresetMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                installationId={installationId}
                accounts={accounts}
                keystores={keystores}
                encryptedPassword={encryptedPassword}
                sessionPassword={sessionPassword}
                account={account}
                network={network}
                keyStore={keyStore}
                interactionRequest={interactionRequest}
                connectionState={connectionState}
                state={state}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'lock_screen_close_click':
                        case 'on_minimize_click':
                            setState({ type: 'minimised' })
                            break
                        case 'on_expand_request':
                            setState({ type: 'maximised' })
                            break

                        case 'on_cancel_confirm_transaction_clicked':
                        case 'transaction_submited':
                        case 'cancel_submitted':
                        case 'session_password_decrypted':
                        case 'transaction_cancel_failure_accepted':
                        case 'transaction_cancel_success':
                        case 'on_completed_transaction_close_click':
                        case 'transaction_failure_accepted':
                        case 'drag':
                        case 'message_signed':
                        case 'cancel_button_click':
                        case 'on_sign_cancel_button_clicked':
                        case 'import_keys_button_clicked':
                        case 'on_transaction_completed_splash_animation_screen_competed':
                        case 'close':
                        case 'on_network_add_clicked':
                        case 'on_predefined_fee_preset_selected':
                        case 'on_transaction_relayed':
                            onMsg(msg)
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
        </>
    )
}
