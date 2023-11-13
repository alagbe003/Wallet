import { FormattedMessage } from 'react-intl'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { ListItem } from 'src/domains/DApp/components/ListItem'
import {
    ConnectionSafetyCheck,
    ConnectionSafetyCheckResult,
    SuspiciousCharactersCheck,
} from '@zeal/domains/SafetyCheck'
import { ConnectionItem } from 'src/domains/SafetyCheck/components/ConnectionItem'
import { ResultIcon } from 'src/domains/SafetyCheck/components/ResultIcon'
import { calculateConnectionSafetyChecksResult } from '@zeal/domains/SafetyCheck/helpers/calculateConnectionSafetyChecksResult'
import { notReachable } from '@zeal/toolkit'
import { Range } from '@zeal/toolkit/Range'
import { BadgeSize } from 'src/uikit/Avatar'
import { Base } from 'src/uikit/Base'
import { Column2 } from 'src/uikit/Column2'
import { Header } from 'src/uikit/Header'
import { Popup } from 'src/uikit/Popup'
import { Row } from '@zeal/uikit/Row'
import { Tag as UITag } from '@zeal/uikit/Tag'
import { Text } from '@zeal/uikit/Text'
import { BoldShieldCautionWithBorder } from 'src/uikit/Icon/BoldShieldCautionWithBorder'
import { BoldShieldDoneWithBorder } from 'src/uikit/Icon/BoldShieldDoneWithBorder'

type Props = {
    safetyChecks: ConnectionSafetyCheck[]
    dAppSiteInfo: DAppSiteInfo
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const SafetyChecksPopup = ({
    safetyChecks,
    dAppSiteInfo,
    onMsg,
}: Props) => {
    const result = calculateConnectionSafetyChecksResult(safetyChecks)

    return (
        <Popup.Layout onMsg={onMsg} background="surfaceDefault">
            <Header
                icon={({ size }) => (
                    <ResultIcon size={size} safetyCheckResult={result} />
                )}
                title={
                    <FormattedMessage
                        id="safetyChecksPopup.title"
                        defaultMessage="Site Safety Checks"
                    />
                }
            />
            <Popup.Content>
                <Column2 spacing={24}>
                    <Row alignX="center" spacing={12}>
                        <Base
                            style={{
                                minWidth: 0,
                                overflow: 'hidden',
                            }}
                        >
                            <ListItem
                                variant="small"
                                highlightHostName={getHighlighting(
                                    safetyChecks
                                )}
                                dApp={dAppSiteInfo}
                                avatarBadge={({ size }) => (
                                    <Badge
                                        size={size}
                                        safetyCheckResult={result}
                                    />
                                )}
                            />
                        </Base>
                        <Base style={{ marginLeft: 'auto' }}>
                            <Tag safetyCheckResult={result} />
                        </Base>
                    </Row>

                    <Column2 spacing={12}>
                        {safetyChecks.map((check) => (
                            <ConnectionItem
                                key={check.type}
                                safetyCheck={check}
                            />
                        ))}
                    </Column2>
                </Column2>
            </Popup.Content>
        </Popup.Layout>
    )
}

const getHighlighting = (checks: ConnectionSafetyCheck[]): Range | null => {
    const suspiciousCharactersCheck = checks.find(
        (check): check is SuspiciousCharactersCheck => {
            switch (check.type) {
                case 'SuspiciousCharactersCheck':
                    return true

                case 'DAppVerificationCheck':
                case 'BlacklistCheck':
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

const Tag = ({
    safetyCheckResult,
}: {
    safetyCheckResult: ConnectionSafetyCheckResult
}) => {
    switch (safetyCheckResult.type) {
        case 'Failure':
            const safetyCheck = safetyCheckResult.reason.failedChecks[0]
            switch (safetyCheck.severity) {
                case 'Caution':
                    return (
                        <UITag bg="statusWarning">
                            <Text
                                variant="caption1"
                                weight="regular"
                                color="textOnDarkPrimary"
                            >
                                <FormattedMessage
                                    id="connectionSafetyCheck.tag.caution"
                                    defaultMessage="Caution"
                                />
                            </Text>
                        </UITag>
                    )

                case 'Danger':
                    return (
                        <UITag bg="statusCritical">
                            <Text
                                variant="caption1"
                                weight="regular"
                                color="textOnDarkPrimary"
                            >
                                <FormattedMessage
                                    id="connectionSafetyCheck.tag.danger"
                                    defaultMessage="Danger"
                                />
                            </Text>
                        </UITag>
                    )

                default:
                    return notReachable(safetyCheck.severity)
            }
        case 'Success':
            return (
                <UITag bg="statusSuccess">
                    <Text
                        variant="caption1"
                        weight="regular"
                        color="textOnDarkPrimary"
                    >
                        <FormattedMessage
                            id="connectionSafetyCheck.tag.passed"
                            defaultMessage="Passed"
                        />
                    </Text>
                </UITag>
            )

        /* istanbul ignore next */
        default:
            return notReachable(safetyCheckResult)
    }
}

const Badge = ({
    safetyCheckResult,
    size,
}: {
    safetyCheckResult: ConnectionSafetyCheckResult
    size: BadgeSize
}) => {
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
                <BoldShieldDoneWithBorder size={size} color="statusSuccess" />
            )

        /* istanbul ignore next */
        default:
            return notReachable(safetyCheckResult)
    }
}
