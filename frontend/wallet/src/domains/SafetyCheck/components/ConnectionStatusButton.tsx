import { FormattedMessage } from 'react-intl'
import { ConnectionSafetyCheckResult } from '@zeal/domains/SafetyCheck'
import { notReachable } from '@zeal/toolkit'

import { ResultIcon } from './ResultIcon'
import { Progress2 } from 'src/uikit/Progress/Progress2'
import { ArrowDown } from 'src/uikit/Icon/Navigation/ArrowDown'

type Props = {
    safetyCheckResult: ConnectionSafetyCheckResult
    onClick: () => void
}

const Label = ({
    safetyCheckResult,
}: {
    safetyCheckResult: ConnectionSafetyCheckResult
}) => {
    switch (safetyCheckResult.type) {
        case 'Failure': {
            const safetyCheck = safetyCheckResult.reason.failedChecks[0]
            switch (safetyCheck.type) {
                case 'SuspiciousCharactersCheck':
                    return (
                        <FormattedMessage
                            id="SuspiciousCharactersCheck.failed.statusButton.label"
                            defaultMessage="Address has unusual characters "
                        />
                    )

                case 'BlacklistCheck':
                    return (
                        <FormattedMessage
                            id="SuspiciousCharactersCheck.failed.statusButton.label"
                            defaultMessage="Site has been reported"
                        />
                    )

                case 'DAppVerificationCheck':
                    return (
                        <FormattedMessage
                            id="DAppVerificationCheck.failed.statusButton.label"
                            defaultMessage="Site wasn’t found in app registries"
                        />
                    )

                default:
                    return notReachable(safetyCheck)
            }
        }

        case 'Success':
            return (
                <FormattedMessage
                    id="ConnectionSafetyCheckResult.passed"
                    defaultMessage="Safety Check passed"
                />
            )

        default:
            return notReachable(safetyCheckResult)
    }
}

const getVariant = (safetyCheckResult: ConnectionSafetyCheckResult) => {
    switch (safetyCheckResult.type) {
        case 'Failure': {
            const safetyCheck = safetyCheckResult.reason.failedChecks[0]
            switch (safetyCheck.severity) {
                case 'Caution':
                    return 'warning'

                case 'Danger':
                    return 'critical'

                default:
                    return notReachable(safetyCheck.severity)
            }
        }
        case 'Success':
            return 'success'

        default:
            return notReachable(safetyCheckResult)
    }
}

export const ConnectionStatusButton = ({
    safetyCheckResult,
    onClick,
}: Props) => (
    <Progress2
        progress={100}
        initialProgress={100}
        variant={getVariant(safetyCheckResult)}
        title={<Label safetyCheckResult={safetyCheckResult} />}
        right={
            <>
                <ResultIcon size={20} safetyCheckResult={safetyCheckResult} />
                <ArrowDown size={20} color="iconDefault" />
            </>
        }
        onClick={onClick}
    />
)
