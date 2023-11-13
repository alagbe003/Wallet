import { KnownCurrencies } from '@zeal/domains/Currency'
import { notReachable } from '@zeal/toolkit'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck/TransactionSafetyCheck'
import { Icon } from './Icon'
import { TransactionSafetyCheckSubtitle } from './TransactionSafetyCheckSubtitle'
import { TransactionSafetyCheckTitle } from './TransactionSafetyCheckTitle'

type Props = {
    safetyCheck: TransactionSafetyCheck
    knownCurrencies: KnownCurrencies
}

export const TransactionItem = ({ safetyCheck, knownCurrencies }: Props) => (
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
            <TransactionSafetyCheckTitle
                safetyCheck={safetyCheck}
                knownCurrencies={knownCurrencies}
            />
        }
        shortText={
            <TransactionSafetyCheckSubtitle
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
