import { FormattedMessage } from 'react-intl'
import { KnownCurrencies } from '@zeal/domains/Currency'
import {
    SignMessageSafetyCheck,
    SignMessageSafetyCheckResult,
} from '@zeal/domains/SafetyCheck'
import { notReachable } from '@zeal/toolkit'
import { ArrowDown } from 'src/uikit/Icon/Navigation/ArrowDown'
import { Progress2 } from 'src/uikit/Progress/Progress2'

import { ResultIcon } from './ResultIcon'
import { SignMessageSafetyCheckSubtitle } from './SignMessageSafetyCheckSubtitle'
import { SignMessageSafetyCheckTitle } from './SignMessageSafetyCheckTitle'

type Props = {
    safetyCheckResult: SignMessageSafetyCheckResult
    knownCurrencies: KnownCurrencies
    onClick: () => void
}

const getVariant = (safetyCheck: SignMessageSafetyCheck) => {
    switch (safetyCheck.severity) {
        case 'Caution':
            return 'warning'

        case 'Danger':
            return 'critical'

        default:
            return notReachable(safetyCheck.severity)
    }
}

export const SignMessageStatusButton = ({
    knownCurrencies,
    onClick,
    safetyCheckResult,
}: Props) => {
    const rightIcon = (
        <>
            <ResultIcon size={20} safetyCheckResult={safetyCheckResult} />
            <ArrowDown size={24} color="iconDefault" />
        </>
    )

    switch (safetyCheckResult.type) {
        case 'Failure': {
            const safetyCheck = safetyCheckResult.reason.failedChecks[0]

            return (
                <Progress2
                    onClick={onClick}
                    variant={getVariant(safetyCheck)}
                    progress={100}
                    initialProgress={100}
                    title={
                        <SignMessageSafetyCheckTitle
                            knownCurrencies={knownCurrencies}
                            safetyCheck={safetyCheck}
                        />
                    }
                    subtitle={
                        <SignMessageSafetyCheckSubtitle
                            knownCurrencies={knownCurrencies}
                            safetyCheck={safetyCheck}
                        />
                    }
                    right={rightIcon}
                />
            )
        }

        case 'Success':
            return (
                <Progress2
                    onClick={onClick}
                    variant="success"
                    progress={100}
                    initialProgress={100}
                    title={
                        <FormattedMessage
                            id="SignMessageSafetyCheckResult.passed"
                            defaultMessage="Safety Checks Passed"
                        />
                    }
                    right={rightIcon}
                />
            )

        default:
            return notReachable(safetyCheckResult)
    }
}
