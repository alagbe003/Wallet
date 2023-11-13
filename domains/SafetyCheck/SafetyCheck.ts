import { SignMessageSafetyCheck } from './SignMessageSafetyCheck'
import { ConnectionSafetyCheck } from './ConnectionSafetyCheck'
import { TransactionSafetyCheck } from './TransactionSafetyCheck'

export type SafetyCheck =
    | ConnectionSafetyCheck
    | TransactionSafetyCheck
    | SignMessageSafetyCheck
