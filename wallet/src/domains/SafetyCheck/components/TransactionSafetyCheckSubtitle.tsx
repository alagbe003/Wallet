import { KnownCurrencies } from '@zeal/domains/Currency'
import { notReachable } from '@zeal/toolkit'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'

import { FormattedMessage } from 'react-intl'

type Props = {
    safetyCheck: TransactionSafetyCheck
    knownCurrencies: KnownCurrencies
}

export const TransactionSafetyCheckSubtitle = ({ safetyCheck }: Props) => {
    switch (safetyCheck.type) {
        case 'TransactionSimulationCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="TransactionSimulationCheck.Failed.subtitle"
                            defaultMessage="Error: {errorMessage}"
                            values={{
                                errorMessage: safetyCheck.message,
                            }}
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="TransactionSimulationCheck.Passed.subtitle"
                            defaultMessage="Simulation done using Tenderly"
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

        case 'NftCollectionCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="NftCollectionCheck.Failed.subtitle"
                            defaultMessage="We checked {source} for verification"
                            values={{
                                source: safetyCheck.source,
                            }}
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="NftCollectionCheck.Passed.subtitle"
                            defaultMessage="We checked {source} for verification"
                            values={{
                                source: safetyCheck.source,
                            }}
                        />
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(safetyCheck)
            }
        case 'P2pReceiverTypeCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="P2pReceiverTypeCheck.Failed.subtitle"
                            defaultMessage="Are you sending to the correct address?"
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="P2pReceiverTypeCheck.Passed.subtitle"
                            defaultMessage="Generally you send assets to other wallets"
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
