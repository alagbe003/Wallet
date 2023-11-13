import { notReachable } from '@zeal/toolkit'
import { BoldShieldCaution } from 'src/uikit/Icon/BoldShieldCaution'
import { ShieldDone } from 'src/uikit/Icon/ShieldDone'
import { ShieldFail } from 'src/uikit/Icon/ShieldFail'
import { DefaultTheme } from 'styled-components'

import { SafetyCheck } from '@zeal/domains/SafetyCheck'

type Props = {
    safetyCheck: SafetyCheck
    size: number
}

export const getColor = (
    safetyCheck: SafetyCheck
): keyof DefaultTheme['colors'] => {
    switch (safetyCheck.state) {
        case 'Failed':
            switch (safetyCheck.severity) {
                case 'Caution':
                    return 'statusWarning'

                case 'Danger':
                    return 'statusCritical'

                default:
                    return notReachable(safetyCheck.severity)
            }

        case 'Passed':
            return 'statusSuccess'

        default:
            return notReachable(safetyCheck)
    }
}

export const Icon = ({ safetyCheck, size }: Props) => {
    const color = getColor(safetyCheck)

    switch (safetyCheck.state) {
        case 'Failed':
            switch (safetyCheck.severity) {
                case 'Caution':
                    return <BoldShieldCaution size={size} color={color} />

                case 'Danger':
                    return <ShieldFail size={size} color={color} />

                default:
                    return notReachable(safetyCheck.severity)
            }

        case 'Passed':
            return <ShieldDone size={size} color={color} />

        default:
            return notReachable(safetyCheck)
    }
}
