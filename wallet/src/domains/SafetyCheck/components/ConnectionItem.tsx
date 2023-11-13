import { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import { notReachable } from '@zeal/toolkit'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { ExternalLink } from 'src/uikit/Icon/ExternalLink'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { ConnectionSafetyCheck } from '@zeal/domains/SafetyCheck/ConnectionSafetyCheck'
import { Icon } from './Icon'

type Props = {
    safetyCheck: ConnectionSafetyCheck
}

const Title = ({ safetyCheck }: Props) => {
    switch (safetyCheck.type) {
        case 'SuspiciousCharactersCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="SuspiciousCharactersCheck.Failed.title"
                            defaultMessage="We check for common phishing patterns"
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="SuspiciousCharactersCheck.Passed.title"
                            defaultMessage="Address has no unusual characters"
                        />
                    )

                default:
                    return notReachable(safetyCheck)
            }

        case 'BlacklistCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="BlacklistCheck.Failed.title"
                            defaultMessage="Site is blacklisted"
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="BlacklistCheck.Passed.title"
                            defaultMessage="Site is not blacklisted"
                        />
                    )

                default:
                    return notReachable(safetyCheck)
            }

        case 'DAppVerificationCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="DAppVerificationCheck.Failed.title"
                            defaultMessage="Site wasn’t found in app registries"
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="DAppVerificationCheck.Passed.title"
                            defaultMessage="Site appears in app registries"
                        />
                    )

                default:
                    return notReachable(safetyCheck)
            }

        default:
            return notReachable(safetyCheck)
    }
}

const Subtitle = ({ safetyCheck }: Props) => {
    switch (safetyCheck.type) {
        case 'SuspiciousCharactersCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="SuspiciousCharactersCheck.Failed.subtitle"
                            defaultMessage="This is a common phishing tactic"
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="SuspiciousCharactersCheck.Passed.subtitle"
                            defaultMessage="We check for phishing attemps"
                        />
                    )

                default:
                    return notReachable(safetyCheck)
            }

        case 'BlacklistCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="BlacklistCheck.Failed.subtitle"
                            defaultMessage="Has reports of malicious behaviour"
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="BlacklistCheck.Passed.subtitle"
                            defaultMessage="No reports of malicious behaviour"
                        />
                    )

                default:
                    return notReachable(safetyCheck)
            }

        case 'DAppVerificationCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="DAppVerificationCheck.Failed.subtitle"
                            defaultMessage="Please double check you’re in the right site"
                        />
                    )

                case 'Passed':
                    const verificationUrl = safetyCheck.verificationUrl
                    if (verificationUrl) {
                        return (
                            <FormattedMessage
                                id="DAppVerificationCheck.Passed.subtitle"
                                defaultMessage="Site was verified in <link>{source}</link>"
                                values={{
                                    source: safetyCheck.source,
                                    link: (title: ReactNode) => (
                                        <Tertiary
                                            size="small"
                                            color="on_light"
                                            inline
                                            onClick={() =>
                                                window.open(verificationUrl)
                                            }
                                        >
                                            {title}
                                            <ExternalLink size={14} />
                                        </Tertiary>
                                    ),
                                }}
                            />
                        )
                    } else {
                        return (
                            <FormattedMessage
                                id="DAppVerificationCheck.Passed.subtitle"
                                defaultMessage="Site was verified in {source}"
                                values={{
                                    source: safetyCheck.source,
                                }}
                            />
                        )
                    }

                default:
                    return notReachable(safetyCheck)
            }

        default:
            return notReachable(safetyCheck)
    }
}

export const ConnectionItem = ({ safetyCheck }: Props) => (
    <ListItem2
        aria-selected={false}
        size="regular"
        variant={(() => {
            switch (safetyCheck.state) {
                case 'Failed':
                    switch (safetyCheck.severity) {
                        case 'Caution':
                            return 'warning'

                        case 'Danger':
                            return 'critical'

                        default:
                            return notReachable(safetyCheck.severity)
                    }

                case 'Passed':
                    return 'solid'

                /* istanbul ignore next */
                default:
                    return notReachable(safetyCheck)
            }
        })()}
        primaryText={<Title safetyCheck={safetyCheck} />}
        shortText={<Subtitle safetyCheck={safetyCheck} />}
        side={{
            rightIcon: ({ size }) => (
                <Icon size={size} safetyCheck={safetyCheck} />
            ),
        }}
    />
)
