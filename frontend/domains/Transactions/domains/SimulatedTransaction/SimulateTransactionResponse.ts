import { SimulatedTransaction } from './SimulatedTransaction'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'

export type SimulateTransactionResponse = {
    transaction: SimulatedTransaction
    currencies: KnownCurrencies
    checks: TransactionSafetyCheck[]
}
