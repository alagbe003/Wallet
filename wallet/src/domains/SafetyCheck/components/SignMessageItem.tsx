import { KnownCurrencies } from '@zeal/domains/Currency'
import { SignMessageSafetyCheck } from '@zeal/domains/SafetyCheck'
import { notReachable } from '@zeal/toolkit'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Icon } from './Icon'
import { SignMessageSafetyCheckSubtitle } from './SignMessageSafetyCheckSubtitle'
import { SignMessageSafetyCheckTitle } from './SignMessageSafetyCheckTitle'

type Props = {
    safetyCheck: SignMessageSafetyCheck
    knownCurrencies: KnownCurrencies
}

export const SignMessageItem = ({ safetyCheck, knownCurrencies }: Props) => (
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
        primaryText={
            <SignMessageSafetyCheckTitle
                safetyCheck={safetyCheck}
                knownCurrencies={knownCurrencies}
            />
        }
        shortText={
            <SignMessageSafetyCheckSubtitle
                safetyCheck={safetyCheck}
                knownCurrencies={knownCurrencies}
            />
        }
        side={{
            rightIcon: ({ size }) => (
                <Icon size={size} safetyCheck={safetyCheck} />
            ),
        }}
    />
)
