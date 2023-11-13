import { FormattedMessage } from 'react-intl'
import { components } from '@zeal/api/portfolio'
import { notReachable } from '@zeal/toolkit'
import { Text2 } from 'src/uikit/Text2'
import { LightDangerTriangle } from 'src/uikit/Icon/LightDangerTriangle'
import { Row } from '@zeal/uikit/Row'
import { SolidLightning } from 'src/uikit/Icon/SolidLightning'
import { useReadableDuration } from 'src/toolkit/Date/useReadableDuration'

type Props = {
    errored?: boolean

    forecastDuration: components['schemas']['ForecastDuration']
}

export const Time = ({ forecastDuration, errored }: Props) => {
    const formatHumanReadableDuration = useReadableDuration()

    switch (forecastDuration.type) {
        case 'WithinForecast':
            return (
                <Row spacing={4}>
                    <SolidLightning size={20} color="iconDefault" />
                    <Text2
                        variant="paragraph"
                        weight="regular"
                        color="textPrimary"
                    >
                        {formatHumanReadableDuration(
                            forecastDuration.durationMs
                        )}
                    </Text2>
                </Row>
            )

        case 'OutsideOfForecast':
            return (
                <Row spacing={4}>
                    <LightDangerTriangle
                        size={20}
                        color={errored ? 'iconStatusCritical' : 'iconDefault'}
                    />

                    <Text2
                        variant="paragraph"
                        weight="regular"
                        color="textPrimary"
                    >
                        <FormattedMessage
                            id="FeeForecastWiget.unknownDuration"
                            defaultMessage="Unknown"
                        />
                    </Text2>
                </Row>
            )

        /* istanbul ignore next */
        default:
            return notReachable(forecastDuration)
    }
}
