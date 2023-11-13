import { parse as parseCurrency } from '@zeal/domains/Currency/helpers/parse'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import {
    array,
    combine,
    object,
    oneOf,
    record,
    Result,
    match,
    shape,
} from '@zeal/toolkit/Result'

import { parseSimulatedTransaction } from './parseSimulatedTransaction'

import { parseTransactionSafetyCheck } from '@zeal/domains/SafetyCheck/parsers/parseTransactionSafetyCheck'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { SimulationResult } from '../api/fetchSimulation'

const parseSafetyChecks = (
    input: unknown
): Result<unknown, TransactionSafetyCheck[]> =>
    array(input).andThen((checks) =>
        combine(checks.map(parseTransactionSafetyCheck))
    )

export const parseSimulationResult = (
    input: unknown
): Result<unknown, SimulationResult> =>
    object(input).andThen((dto) =>
        oneOf([
            shape({ type: match(dto.type, 'failed' as const) }),
            shape({ type: match(dto.type, 'not_supported' as const) }),
            shape({
                type: match(dto.type, 'simulated' as const),
                simulation: parseSimulateTransactionResponse(dto.simulation),
            }),
        ])
    )

export const parseSimulateTransactionResponse = (
    input: unknown
): Result<unknown, SimulateTransactionResponse> =>
    object(input).andThen((dto) =>
        shape({
            transaction: parseSimulatedTransaction(dto.transaction),
            currencies: object(dto.currencies).andThen((curriencies) =>
                record(curriencies, parseCurrency)
            ),
            checks: parseSafetyChecks(dto.checks),
        })
    )
