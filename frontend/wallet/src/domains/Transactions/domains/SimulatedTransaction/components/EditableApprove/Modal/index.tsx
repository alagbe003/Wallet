import { notReachable } from '@zeal/toolkit'
import { Form } from './Form'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { ApprovalTransaction } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { SpendLimitInfo } from '../../SpendLimitInfo'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { HighSpendLimitInfo } from 'src/domains/Transactions/domains/SimulatedTransaction/components/HighSpendLimitInfo'

type Props = {
    state: State
    originalEthSendTransaction: EthSendTransaction
    knownCurrencies: KnownCurrencies
    transaction: ApprovalTransaction
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof Form>

export type State =
    | { type: 'closed' }
    | { type: 'form' }
    | { type: 'spend_limit_info' }
    | { type: 'high_spend_limit_warning' }

export const Modal = ({
    onMsg,
    state,
    originalEthSendTransaction,
    knownCurrencies,
    transaction,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'form':
            return (
                <Form
                    knownCurrencies={knownCurrencies}
                    originalEthSendTransaction={originalEthSendTransaction}
                    transaction={transaction}
                    onMsg={onMsg}
                />
            )
        case 'spend_limit_info':
            return <SpendLimitInfo onMsg={onMsg} />
        case 'high_spend_limit_warning':
            return <HighSpendLimitInfo onMsg={onMsg} />
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
