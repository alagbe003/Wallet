import { parseUnexpectedFailureError } from '@zeal/domains/Error/parsers/parseUnexpectedFailureError'
import { values } from '@zeal/toolkit/Object'
import {
    Result,
    failure,
    match,
    object,
    oneOf,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import {
    CannotQueryUnfinalizedData,
    ExecutionReverted,
    GasPriceIsLessThanMinimum,
    GasRequiredExceedsAllowance,
    InsufficientBalanceForTransfer,
    InsufficientFundsForGasAndValue,
    InvalidArgument,
    MaxFeePerGasLessThanBlockBaseFee,
    NounceIsTooLow,
    RPCError,
    RPCResponseError,
    ReplacementTransactionUnderpriced,
    TransactionUnderpriced,
    TxPoolDisabled,
} from '../RPCError'

const startsWith = (
    input: string,
    shouldStartWith: string
): Result<
    {
        type: 'does_not_start_with_correct_string'
        required: string
        actual: string
    },
    string
> =>
    input.toLowerCase().startsWith(shouldStartWith.toLowerCase())
        ? success(input)
        : failure({
              type: 'does_not_start_with_correct_string',
              actual: input,
              required: shouldStartWith,
          })

const stringStartsWith = (
    input: unknown,
    shouldStartWith: string
): Result<unknown, string> =>
    string(input).andThen((str) => startsWith(str, shouldStartWith))

const parseReplacementTransactionUnderpriced = (
    input: unknown
): Result<unknown, ReplacementTransactionUnderpriced> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: match(obj.code, -32000),
                message: stringStartsWith(
                    obj.message,
                    'replacement transaction underpriced'
                ),
            })
        )
        .map((payload) => ({
            type: 'rpc_error_replacement_transaction_underpriced',
            payload,
        }))

const parseNounceIsTooLow = (input: unknown): Result<unknown, NounceIsTooLow> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: match(obj.code, -32000),
                message: stringStartsWith(obj.message, 'nonce too low'),
            })
        )
        .map((payload) => ({ type: 'rpc_error_nounce_is_too_low', payload }))

const parseCannotQueryUnfinalizedData = (
    input: unknown
): Result<unknown, CannotQueryUnfinalizedData> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: match(obj.code, -32000),
                message: stringStartsWith(
                    obj.message,
                    'cannot query unfinalized data'
                ),
            })
        )
        .map((payload) => ({
            type: 'rpc_error_cannot_query_unfinalized_data',
            payload,
        }))

const parseExecutionReverted = (
    input: unknown
): Result<unknown, ExecutionReverted> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: oneOf([match(obj.code, -32000), match(obj.code, 3)]),
                message: stringStartsWith(obj.message, 'execution reverted'),
            })
        )
        .map((payload) => ({ type: 'rpc_error_execution_reverted', payload }))

const parseGasPriceIsLessThanMinimum = (
    input: unknown
): Result<unknown, GasPriceIsLessThanMinimum> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: match(obj.code, -32000),
                message: stringStartsWith(
                    obj.message,
                    'gasprice is less than gas price minimum floor'
                ),
            })
        )
        .map((payload) => ({
            type: 'rpc_error_gas_price_is_less_than_minimum',
            payload,
        }))

const praseGasRequiredExceedsAllowance = (
    input: unknown
): Result<unknown, GasRequiredExceedsAllowance> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: match(obj.code, -32000),
                message: stringStartsWith(
                    obj.message,
                    'gas required exceeds allowance'
                ),
            })
        )
        .map((payload) => ({
            type: 'rpc_error_gas_required_exceeds_allowance',
            payload,
        }))

const praseInsufficientBalanceForTransfer = (
    input: unknown
): Result<unknown, InsufficientBalanceForTransfer> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: match(obj.code, -32000),
                message: oneOf([
                    stringStartsWith(
                        obj.message,
                        'insufficient balance for transfer'
                    ),
                    stringStartsWith(
                        obj.message,
                        'insufficient funds for transfer'
                    ),
                ]),
            })
        )
        .map((payload) => ({
            type: 'rpc_error_insufficient_balance_for_transfer',
            payload,
        }))

const parseInsufficientFundsForGasAndValue = (
    input: unknown
): Result<unknown, InsufficientFundsForGasAndValue> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: match(obj.code, -32000),
                message: string(obj.message).andThen((msg) =>
                    msg
                        .toLowerCase()
                        .includes('insufficient funds for gas * price + value')
                        ? success(msg)
                        : failure(
                              'no_pattern_insufficient_funds_for_gas_price_value'
                          )
                ),
            })
        )
        .map((payload) => ({
            type: 'rpc_error_insufficient_funds_for_gas_and_value',
            payload,
        }))

const parseMaxFeePerGasLessThanBlockBaseFee = (
    input: unknown
): Result<unknown, MaxFeePerGasLessThanBlockBaseFee> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: match(obj.code, -32000),
                message: stringStartsWith(
                    obj.message,
                    'max fee per gas less than block base fee'
                ),
            })
        )
        .map((payload) => ({
            type: 'rpc_error_max_fee_per_gas_less_than_block_base_fee',
            payload,
        }))

const parseTransactionUnderpriced = (
    input: unknown
): Result<unknown, TransactionUnderpriced> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: match(obj.code, -32000),
                message: stringStartsWith(
                    obj.message,
                    'transaction underpriced'
                ),
            })
        )
        .map((payload) => ({
            type: 'rpc_error_transaction_underpriced',
            payload,
        }))

const parseTxPoolDisabled = (input: unknown): Result<unknown, TxPoolDisabled> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: match(obj.code, -32000),
                message: stringStartsWith(obj.message, 'TxPool Disabled'),
            })
        )
        .map((payload) => ({
            type: 'rpc_error_tx_pool_disabled',
            payload,
        }))

const parseInvalidArgument = (
    input: unknown
): Result<unknown, InvalidArgument> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: match(obj.code, -32602),
                message: stringStartsWith(obj.message, 'invalid argument'),
            })
        )
        .map((payload) => ({
            type: 'rpc_error_invalid_argument',
            payload,
        }))

// TODO This type allows all permuations as key & value, so how to do 1to1 mapping?
const parsers: Record<
    RPCError['type'],
    (
        input: unknown
    ) => Result<unknown, Extract<RPCError, { type: RPCError['type'] }>>
> = {
    rpc_error_replacement_transaction_underpriced:
        parseReplacementTransactionUnderpriced,
    rpc_error_nounce_is_too_low: parseNounceIsTooLow,
    rpc_error_cannot_query_unfinalized_data: parseCannotQueryUnfinalizedData,
    rpc_error_execution_reverted: parseExecutionReverted,
    rpc_error_gas_price_is_less_than_minimum: parseGasPriceIsLessThanMinimum,
    rpc_error_gas_required_exceeds_allowance: praseGasRequiredExceedsAllowance,
    rpc_error_insufficient_balance_for_transfer:
        praseInsufficientBalanceForTransfer,
    rpc_error_insufficient_funds_for_gas_and_value:
        parseInsufficientFundsForGasAndValue,
    rpc_error_max_fee_per_gas_less_than_block_base_fee:
        parseMaxFeePerGasLessThanBlockBaseFee,
    rpc_error_transaction_underpriced: parseTransactionUnderpriced,
    rpc_error_tx_pool_disabled: parseTxPoolDisabled,
    rpc_error_invalid_argument: parseInvalidArgument,
}

const parseRPCErrorPayload = (input: unknown): Result<unknown, RPCError> =>
    // TODO how to fix this one?
    // @ts-expect-error
    oneOf(values(parsers).map((parser) => parser(input)))

export const parseRPCError = (input: unknown) =>
    parseUnexpectedFailureError(input).andThen((error) =>
        parseRPCErrorPayload(error.error.reason).map(
            (reason) => new RPCResponseError(reason)
        )
    )
