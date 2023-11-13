import { FormattedMessage } from 'react-intl'
import { ListItem } from 'src/domains/DApp/components/ListItem'
import {
    ConnectedToMetaMask,
    Disconnected,
    NotInteracted,
} from 'src/domains/DApp/domains/ConnectionState'
import {
    ConnectionSafetyCheck,
    SuspiciousCharactersCheck,
} from '@zeal/domains/SafetyCheck'
import { ConnectionSafetyChecksResponse } from 'src/domains/SafetyCheck/api/fetchConnectionSafetyChecks'
import { calculateConnectionSafetyChecksResult } from '@zeal/domains/SafetyCheck/helpers/calculateConnectionSafetyChecksResult'
import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { Range } from 'src/toolkit/Range'
import { Button, IconButton } from 'src/uikit'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { BadgeSize } from '@zeal/uikit/Avatar'
import { Column2 } from 'src/uikit/Column2'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { BoldShieldCautionWithBorder } from 'src/uikit/Icon/BoldShieldCautionWithBorder'
import { BoldShieldDoneWithBorder } from 'src/uikit/Icon/BoldShieldDoneWithBorder'
import { CustomMetamask } from '@zeal/uikit/Icon/CustomMetamask'
import { LightArrowDown2 } from 'src/uikit/Icon/LightArrowDown2'
import { Content } from '@zeal/uikit/Content'
import { Screen } from '@zeal/uikit/Screen'
import { ListItemButton } from 'src/uikit/ListItem2/ListItemButton'
import { Text } from '@zeal/uikit/Text'
import { SafetyChecks } from '../SafetyChecks'

type Props = {
    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>
    alternativeProvider: 'metamask'
    connectionState: NotInteracted | Disconnected | ConnectedToMetaMask
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_safety_checks_click'; safetyChecks: ConnectionSafetyCheck[] }
    | { type: 'on_account_selector_click' }
    | { type: 'on_continue_with_meta_mask' }

// TODO: this is duplicated in ZealWalletSelected
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

export const Layout = ({
    alternativeProvider,
    connectionState,
    safetyChecksLoadable,
    onMsg,
}: Props) => {
    return (
        <Screen background="light" padding="form">
            <ActionBar
                right={
                    <IconButton
                        onClick={() => {
                            onMsg({ type: 'close' })
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
                            <InputButton
                                alternativeProvider={alternativeProvider}
                                onClick={() => {
                                    onMsg({ type: 'on_account_selector_click' })
                                }}
                            />
                        </Column2>
                    </Column2>
                </Content>

                <Button
                    size="regular"
                    variant="primary"
                    onClick={() =>
                        onMsg({
                            type: 'on_continue_with_meta_mask',
                        })
                    }
                >
                    <FormattedMessage
                        id="connection_state.connect.cancel"
                        defaultMessage="Continue with MetaMask"
                    />
                </Button>
            </Column2>
        </Screen>
    )
}

const InputButton = ({
    alternativeProvider,
    onClick,
}: {
    alternativeProvider: 'metamask'
    onClick: () => void
}) => {
    return (
        <Column2 spacing={8}>
            <Text variant="paragraph" weight="regular" color="textSecondary">
                <FormattedMessage
                    id="connection_state.connect.connected_wallet"
                    defaultMessage="Connected wallet"
                />
            </Text>
            {(() => {
                switch (alternativeProvider) {
                    case 'metamask':
                        return (
                            <ListItemButton
                                onClick={onClick}
                                avatar={({ size }) => (
                                    <CustomMetamask size={size} />
                                )}
                                primaryText={
                                    <FormattedMessage
                                        id="connection_state.connect.metamask"
                                        defaultMessage="MetaMask"
                                    />
                                }
                                side={{
                                    rightIcon: ({ size }) => (
                                        <LightArrowDown2
                                            size={size}
                                            color="iconDefault"
                                        />
                                    ),
                                }}
                            />
                        )

                    /* istanbul ignore next */
                    default:
                        return notReachable(alternativeProvider)
                }
            })()}
        </Column2>
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
