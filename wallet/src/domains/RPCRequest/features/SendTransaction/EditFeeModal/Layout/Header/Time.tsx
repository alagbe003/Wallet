import { notReachable } from '@zeal/toolkit'
import { components } from '@zeal/api/portfolio'
import { FormattedMessage } from 'react-intl'
import { Text2 } from 'src/uikit/Text2'
import { useReadableDuration } from '@zeal/toolkit/Date/useReadableDuration'

type Props = {
    duration: components['schemas']['ForecastDuration']
}

export const Time = ({ duration }: Props) => {
    const formatHumanReadableDuration = useReadableDuration()

    switch (duration.type) {
        case 'WithinForecast':
            return (
                <Text2
                    ellipsis
                    variant="paragraph"
                    weight="regular"
                    color="textSecondary"
                >
                    {formatHumanReadableDuration(duration.durationMs)}
                </Text2>
            )

        case 'OutsideOfForecast':
            return (
                <Text2
                    ellipsis
                    variant="paragraph"
                    weight="regular"
                    color="textSecondary"
                >
                    <FormattedMessage
                        id="EditFeeModal.Header.Time.unknown"
                        defaultMessage="Time Unknown"
                    />
                </Text2>
            )

        /* istanbul ignore next */
        default:
            return notReachable(duration)
    }
}
