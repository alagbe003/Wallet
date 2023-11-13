import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { shouldWeConfirmSafetyCheck } from '../../helpers'
import { Network } from '@zeal/domains/Network'
import { ConnectionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { ConnectionSafetyChecksResponse } from 'src/domains/SafetyCheck/api/fetchConnectionSafetyChecks'
import { calculateConnectionSafetyChecksResult } from '@zeal/domains/SafetyCheck/helpers/calculateConnectionSafetyChecksResult'
import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { Button } from '@zeal/uikit/Button'
import { Actions } from '@zeal/uikit/Actions'

type Props = {
    selectedNetwork: Network
    selectedAccount: Account
    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>

    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_safety_checks_click'; safetyChecks: ConnectionSafetyCheck[] }
    | { type: 'reject_connection_button_click' }
    | { type: 'connect_button_click'; account: Account; network: Network }
    | {
          type: 'connect_confirmation_requested'
          safetyChecks: ConnectionSafetyCheck[]
      }

export const Layout = ({
    safetyChecksLoadable,
    selectedAccount,
    selectedNetwork,
    onMsg,
}: Props) => {
    switch (safetyChecksLoadable.type) {
        case 'loading':
            return (
                <Actions>
                    <Button
                        size="regular"
                        variant="secondary"
                        onClick={() =>
                            onMsg({
                                type: 'reject_connection_button_click',
                            })
                        }
                    >
                        <FormattedMessage
                            id="connection_state.connect.cancel"
                            defaultMessage="Cancel"
                        />
                    </Button>
                    <Button
                        size="regular"
                        variant="primary"
                        onClick={() =>
                            onMsg({
                                type: 'connect_button_click',
                                account: selectedAccount,
                                network: selectedNetwork,
                            })
                        }
                    >
                        <FormattedMessage
                            id="connection_state.connect.connect_button"
                            defaultMessage="Connect"
                        />
                    </Button>
                </Actions>
            )

        case 'loaded':
            const checkResult = calculateConnectionSafetyChecksResult(
                safetyChecksLoadable.data.checks
            )
            return (
                <Actions>
                    <Button
                        size="regular"
                        variant="secondary"
                        onClick={() =>
                            onMsg({
                                type: 'reject_connection_button_click',
                            })
                        }
                    >
                        <FormattedMessage
                            id="connection_state.connect.cancel"
                            defaultMessage="Cancel"
                        />
                    </Button>
                    <Button
                        size="regular"
                        variant="primary"
                        onClick={() => {
                            switch (checkResult.type) {
                                case 'Failure': {
                                    shouldWeConfirmSafetyCheck(
                                        checkResult.reason.failedChecks
                                    )
                                        ? onMsg({
                                              type: 'connect_confirmation_requested',
                                              safetyChecks:
                                                  safetyChecksLoadable.data
                                                      .checks,
                                          })
                                        : onMsg({
                                              type: 'connect_button_click',
                                              account: selectedAccount,
                                              network: selectedNetwork,
                                          })

                                    break
                                }
                                case 'Success':
                                    onMsg({
                                        type: 'connect_button_click',
                                        account: selectedAccount,
                                        network: selectedNetwork,
                                    })
                                    break

                                default:
                                    notReachable(checkResult)
                            }
                        }}
                    >
                        <FormattedMessage
                            id="connection_state.connect.connect_button"
                            defaultMessage="Connect"
                        />
                    </Button>
                </Actions>
            )

        case 'error':
            return (
                <Actions>
                    <Button
                        size="regular"
                        variant="secondary"
                        onClick={() =>
                            onMsg({
                                type: 'reject_connection_button_click',
                            })
                        }
                    >
                        <FormattedMessage
                            id="connection_state.connect.cancel"
                            defaultMessage="Cancel"
                        />
                    </Button>
                    <Button
                        size="regular"
                        variant="primary"
                        onClick={() =>
                            onMsg({
                                type: 'connect_button_click',
                                account: selectedAccount,
                                network: selectedNetwork,
                            })
                        }
                    >
                        <FormattedMessage
                            id="connection_state.connect.connect_button"
                            defaultMessage="Connect"
                        />
                    </Button>
                </Actions>
            )

        /* istanbul ignore next */
        default:
            return notReachable(safetyChecksLoadable)
    }
}
