import { KnownCurrencies } from '@zeal/domains/Currency'
import { notReachable } from '@zeal/toolkit'

import { FormattedMessage } from 'react-intl'
import { SignMessageSafetyCheck } from '@zeal/domains/SafetyCheck'

type Props = {
    safetyCheck: SignMessageSafetyCheck
    knownCurrencies: KnownCurrencies
}

export const SignMessageSafetyCheckSubtitle = ({ safetyCheck }: Props) => {
    switch (safetyCheck.type) {
        case 'ApprovalExpirationLimitCheck':
            switch (safetyCheck.state) {
                case 'Passed':
                    return (
                        <FormattedMessage
                            id="PermitExpirationCheck.Passed.subtitle"
                            defaultMessage="How long an app can use your tokens for"
                        />
                    )
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="PermitExpirationCheck.Failed.subtitle"
                            defaultMessage="Keep short and only as long as you need"
                        />
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(safetyCheck)
            }

        case 'TokenVerificationCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="TokenVerificationCheck.Failed.subtitle"
                            defaultMessage="Make sure this is the correct token"
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="TokenVerificationCheck.Passed.subtitle"
                            defaultMessage="Token is listed on CoinGecko"
                        />
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(safetyCheck)
            }

        case 'SmartContractBlacklistCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="SmartContractBlacklistCheck.Failed.subtitle"
                            defaultMessage="Has reports of malicious behaviour"
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="SmartContractBlacklistCheck.Passed.subtitle"
                            defaultMessage="No reports of malicious behaviour"
                        />
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(safetyCheck)
            }

        case 'ApprovalSpenderTypeCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="ApprovalSpenderTypeCheck.Failed.subtitle"
                            defaultMessage="Likely a scam: spenders should be contracts"
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="ApprovalSpenderTypeCheck.Passed.subtitle"
                            defaultMessage="Generally you approve assets to contracts"
                        />
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(safetyCheck)
            }

        /* istanbul ignore next */
        default:
            return notReachable(safetyCheck)
    }
}
