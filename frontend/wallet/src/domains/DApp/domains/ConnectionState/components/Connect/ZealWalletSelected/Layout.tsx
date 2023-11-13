import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { InputButton as AccountInputButton } from 'src/domains/Account/components/InputButton'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { ListItem } from 'src/domains/DApp/components/ListItem'
import { KeyStore } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { InputButton as NetworkInputButton } from 'src/domains/Network/components/InputButton'
import { Portfolio } from '@zeal/domains/Portfolio'
import { SuspiciousCharactersCheck } from '@zeal/domains/SafetyCheck'
import { ConnectionSafetyChecksResponse } from 'src/domains/SafetyCheck/api/fetchConnectionSafetyChecks'
import { calculateConnectionSafetyChecksResult } from '@zeal/domains/SafetyCheck/helpers/calculateConnectionSafetyChecksResult'
import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { Range } from 'src/toolkit/Range'
import { IconButton } from 'src/uikit'
import { BadgeSize } from 'src/uikit/Avatar'
import { Column2 } from 'src/uikit/Column2'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { BoldShieldCautionWithBorder } from 'src/uikit/Icon/BoldShieldCautionWithBorder'
import { BoldShieldDoneWithBorder } from 'src/uikit/Icon/BoldShieldDoneWithBorder'
import { Content } from '@zeal/uikit/Content'
import { Screen } from '@zeal/uikit/Screen'
import { Text2 } from 'src/uikit/Text2'
import {
    ConnectedToMetaMask,
    Disconnected as DisconnectedState,
    NotInteracted as NotInteractedState,
} from '../../..'
import { SafetyChecks } from '../SafetyChecks'
import { Actions, Msg as ActionsMsg } from './Actions'

type Props = {
    connectionState:
        | DisconnectedState
        | NotInteractedState
        | ConnectedToMetaMask
    selectedNetwork: Network
    selectedAccount: Account
    portfolio: Portfolio | null

    keystore: KeyStore
    currencyHiddenMap: CurrencyHiddenMap

    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>

    onMsg: (msg: Msg) => void
}

const getHighlighting = (
    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>
): Range | null => {
    switch (safetyChecksLoadable.type) {
        case 'loaded': {
            const suspiciousCharactersCheck =
                safetyChecksLoadable.data.checks.find(
                    (check): check is SuspiciousCharactersCheck => {
                        switch (check.type) {
                            case 'SuspiciousCharactersCheck':
                                return true
                            case 'BlacklistCheck':
                            case 'DAppVerificationCheck':
                                return false

                            /* istanbul ignore next */
                            default:
                                return notReachable(check)
                        }
                    }
                )

            if (!suspiciousCharactersCheck) {
                return null
            }

            switch (suspiciousCharactersCheck.state) {
                case 'Failed':
                    return suspiciousCharactersCheck.suspiciousPart

                case 'Passed':
                    return null

                /* istanbul ignore next */
                default:
                    return notReachable(suspiciousCharactersCheck)
            }
        }

        case 'loading':
        case 'error':
            return null

        /* istanbul ignore next */
        default:
            return notReachable(safetyChecksLoadable)
    }
}

export type Msg =
    | { type: 'account_selector_click' }
    | { type: 'network_selector_click' }
    | { type: 'on_minimize_click' }
    | ActionsMsg

export const Layout = ({
    connectionState,
    selectedNetwork,
    selectedAccount,
    safetyChecksLoadable,
    portfolio,
    keystore,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    return (
        <Screen background="light" padding="form">
            <ActionBar
                keystore={keystore}
                right={
                    <IconButton
                        onClick={() => {
                            onMsg({ type: 'on_minimize_click' })
                        }}
                    >
                        <CloseCross size={24} />
                    </IconButton>
                }
                network={selectedNetwork}
                account={selectedAccount}
            />
            <Column2 spacing={12} style={{ flex: '1' }}>
                <Content
                    header={
                        <Content.Header
                            title={
                                <FormattedMessage
                                    id="connection_state.connect.expanded.title"
                                    defaultMessage="Connect"
                                />
                            }
                        />
                    }
                    footer={
                        <SafetyChecks
                            safetyChecksLoadable={safetyChecksLoadable}
                            onMsg={onMsg}
                        />
                    }
                >
                    <Column2 spacing={20}>
                        <ListItem
                            variant="regular"
                            highlightHostName={getHighlighting(
                                safetyChecksLoadable
                            )}
                            dApp={connectionState.dApp}
                            avatarBadge={({ size }) => (
                                <Badge
                                    size={size}
                                    safetyChecksLoadable={safetyChecksLoadable}
                                />
                            )}
                        />
                        <Column2 spacing={24}>
                            <AccountInputButton
                                currencyHiddenMap={currencyHiddenMap}
                                keystore={keystore}
                                account={selectedAccount}
                                onClick={() => {
                                    onMsg({ type: 'account_selector_click' })
                                }}
                                portfolio={portfolio}
                            />
                            <NetworkInputButton
                                network={selectedNetwork}
                                onClick={() => {
                                    onMsg({ type: 'network_selector_click' })
                                }}
                            />
                        </Column2>
                        <Text2
                            variant="footnote"
                            weight="regular"
                            color="textSecondary"
                        >
                            <FormattedMessage
                                id="connection_state.connect.expanded.disclaimer"
                                defaultMessage="Connecting an app will allow it to see your balance and ask you to confirm transactions"
                            />
                        </Text2>
                    </Column2>
                </Content>

                <Actions
                    safetyChecksLoadable={safetyChecksLoadable}
                    selectedAccount={selectedAccount}
                    selectedNetwork={selectedNetwork}
                    onMsg={onMsg}
                />
            </Column2>
        </Screen>
    )
}

const Badge = ({
    safetyChecksLoadable,
    size,
}: {
    size: BadgeSize
    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>
}) => {
    switch (safetyChecksLoadable.type) {
        case 'loaded': {
            const safetyCheckResult = calculateConnectionSafetyChecksResult(
                safetyChecksLoadable.data.checks
            )

            switch (safetyCheckResult.type) {
                case 'Failure':
                    return (
                        <BoldShieldCautionWithBorder
                            size={size}
                            color="statusWarning"
                        />
                    )
                case 'Success':
                    return (
                        <BoldShieldDoneWithBorder
                            size={size}
                            color="statusSuccess"
                        />
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(safetyCheckResult)
            }
        }

        case 'loading':
        case 'error':
            return null

        /* istanbul ignore next */
        default:
            return notReachable(safetyChecksLoadable)
    }
}
