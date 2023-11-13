import { TransactionToken } from '@zeal/domains/Transactions'
import { notReachable } from '@zeal/toolkit'

export const getSign = (
    direction: TransactionToken['direction']
): '-' | '+' => {
    switch (direction) {
        case 'Send':
            return '-'
        case 'Receive':
            return '+'
        /* istanbul ignore next */
        default:
            return notReachable(direction)
    }
}
