import { components } from '@zeal/api/portfolio'
import { FeeForecastRequest } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { BoldTurtle } from 'src/uikit/Icon/BoldTurtle'
import { BoldRabbit } from 'src/uikit/Icon/BoldRabbit'
import { BoldCheetah } from 'src/uikit/Icon/BoldCheetah'
import { BoldSetting } from 'src/uikit/Icon/BoldSetting'
import { notReachable } from '@zeal/toolkit'
import { Row } from '@zeal/uikit/Row'
import { Text2 } from 'src/uikit/Text2'
import { LightDangerTriangle } from 'src/uikit/Icon/LightDangerTriangle'
import { FormattedMessage } from 'react-intl'
import { useReadableDuration } from '@zeal/toolkit/Date/useReadableDuration'

type Props = {
    errored?: boolean

    forecastDuration: components['schemas']['ForecastDuration']
    selectedPreset: FeeForecastRequest['selectedPreset']
}

const Icon = ({ preset }: { preset: FeeForecastRequest['selectedPreset'] }) => {
    switch (preset.type) {
        case 'Slow':
            return <BoldTurtle size={20} color="iconDefault" />

        case 'Normal':
            return <BoldRabbit size={20} color="iconDefault" />

        case 'Fast':
            return <BoldCheetah size={20} color="iconDefault" />

        case 'Custom':
            return <BoldSetting size={20} color="iconDefault" />

        /* istanbul ignore next */
        default:
            return notReachable(preset)
    }
}

export const ForecastTime = ({
    forecastDuration,
    errored,
    selectedPreset,
}: Props) => {
    const formatHumanReadableDuration = useReadableDuration()

    switch (forecastDuration.type) {
        case 'WithinForecast':
            return (
                <Row spacing={4}>
                    <Icon preset={selectedPreset} />
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
