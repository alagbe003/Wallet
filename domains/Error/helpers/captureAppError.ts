import * as Sentry from '@sentry/react'
import { notReachable } from '@zeal/toolkit'
import { getEnvironment } from '@zeal/toolkit/Environment/getEnvironment'
import { replaceUUID } from '@zeal/toolkit/replaceUUID'
import { string } from '@zeal/toolkit/Result'

import { AppError } from '../AppError'

type Params = {
    source:
        | 'manually_captured'
        | 'app_error_popup'
        | 'error_boundary'
        | 'app_error_list_item'
    extra?: Record<string, unknown>
}

/**
 * We need to strip UUIDs and non-UUID specific params from URL to improve tagging in sentry and reduce duplication
 */
const cleanupUrl = (url: string) => {
    const noQueryString = url.split('?')[0]
    const noUUID = replaceUUID(noQueryString, 'uuid')
    const noSpecificParams = noUUID
        .replace(
            /\/wallet\/rate\/default\/[a-zA-Z]+\/0x[0-9a-fA-F]+\//gim,
            '/wallet/rate/default/:network/:address/'
        )
        .replace(
            /\/wallet\/transaction\/history\/0x[0-9a-fA-F]+\//gim,
            '/wallet/transaction/history/:address/'
        )
        .replace(
            /\/wallet\/transaction\/0x[0-9a-fA-F]+\/result/gim,
            '/wallet/transaction/:trx_hash/result'
        )

    return noSpecificParams
}

/**
 * TODO :: delete this function; why we need separate function to switch over error type if captureAppError already switch over type?
 */

const calculateTags = (
    error: AppError,
    { source }: Params
): Record<string, string | number | null> => {
    switch (error.type) {
        case 'unblock_account_number_and_sort_code_mismatch':
        case 'unblock_invalid_iban':
        case 'unblock_bvn_does_not_match':
        case 'unblock_unable_to_verify_bvn':
        case 'unblock_hard_kyc_failure':
        case 'unblock_login_user_did_not_exists':
        case 'unblock_user_with_such_email_already_exists':
        case 'unblock_session_expired':
            return {
                errorType: error.type,
                source,
            }

        case 'decrypt_incorrect_password':
        case 'encrypted_object_invalid_format':
        case 'invalid_encrypted_file_format':
        case 'google_api_error':
        case 'hardware_wallet_failed_to_open_device':
        case 'imperative_error':
        case 'ledger_blind_sign_not_enabled_or_running_non_eth_app':
        case 'ledger_is_locked':
        case 'ledger_not_running_any_app':
        case 'ledger_running_non_eth_app':
        case 'trezor_action_cancelled':
        case 'trezor_connection_already_initialized':
        case 'trezor_device_used_elsewhere':
        case 'trezor_method_cancelled':
        case 'trezor_permissions_not_granted':
        case 'trezor_pin_cancelled':
        case 'trezor_popup_closed':
        case 'unexpected_failure':
        case 'unknown_error':
        case 'user_trx_denied_by_user':
        case 'failed_to_fetch_google_auth_token':
            return {
                errorType: error.type,
                source,
            }

        case 'rpc_request_parse_error':
            return {
                errorType: error.type,
                rpcMethod: string(error.rpcMethod).getSuccessResult() || null,
                source,
            }

        case 'rpc_error_cannot_query_unfinalized_data':
        case 'rpc_error_execution_reverted':
        case 'rpc_error_gas_price_is_less_than_minimum':
        case 'rpc_error_gas_required_exceeds_allowance':
        case 'rpc_error_insufficient_balance_for_transfer':
        case 'rpc_error_insufficient_funds_for_gas_and_value':
        case 'rpc_error_invalid_argument':
        case 'rpc_error_max_fee_per_gas_less_than_block_base_fee':
        case 'rpc_error_nounce_is_too_low':
        case 'rpc_error_replacement_transaction_underpriced':
        case 'rpc_error_transaction_underpriced':
        case 'rpc_error_tx_pool_disabled':
            return { type: error.type }

        case 'unknown_unblock_error':
        case 'http_error':
            return {
                url: cleanupUrl(error.url),
                method: error.method,
                status: error.status,
            }

        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}

/**
 * @deprecated This helper is for domain internal use. Do not export and use it outside of Error domain
 */
export const captureAppError = (error: AppError, params: Params) => {
    const { extra } = params
    const tags = calculateTags(error, params)

    switch (error.type) {
        case 'unknown_unblock_error':
            report(error, tags, {
                message: error.message,
                errorId: error.errorId,
                url: error.url,
                method: error.method,
                ...extra,
            })
            break

        case 'unblock_account_number_and_sort_code_mismatch':
        case 'unblock_invalid_iban':
        case 'unblock_bvn_does_not_match':
        case 'unblock_unable_to_verify_bvn':
        case 'unblock_hard_kyc_failure':
        case 'unblock_login_user_did_not_exists':
        case 'unblock_session_expired':
        case 'unblock_user_with_such_email_already_exists':
            report(error, tags, extra)
            break

        case 'unexpected_failure':
            report(error.error, tags, {
                reason: JSON.stringify(error.error.reason, null, 2),
                ...extra,
            })
            break

        case 'unknown_error':
            report(error.error, tags, {
                extra: {
                    ...extra,
                    stringifyError: JSON.stringify(error.error, null, 4),
                },
            })
            break

        case 'rpc_request_parse_error':
            report(error, tags, {
                reason: JSON.stringify(error.reason, null, 2),
                ...extra,
            })
            break

        case 'http_error':
            report(error, tags, { ...extra, trace: error.trace })
            break

        case 'imperative_error':
            report(error, tags, extra)
            break

        case 'rpc_error_cannot_query_unfinalized_data':
        case 'rpc_error_execution_reverted':
        case 'rpc_error_gas_price_is_less_than_minimum':
        case 'rpc_error_gas_required_exceeds_allowance':
        case 'rpc_error_insufficient_balance_for_transfer':
        case 'rpc_error_insufficient_funds_for_gas_and_value':
        case 'rpc_error_invalid_argument':
        case 'rpc_error_max_fee_per_gas_less_than_block_base_fee':
        case 'rpc_error_nounce_is_too_low':
        case 'rpc_error_replacement_transaction_underpriced':
        case 'rpc_error_transaction_underpriced':
        case 'rpc_error_tx_pool_disabled':
            report(error, tags, extra)
            break

        case 'decrypt_incorrect_password':
        case 'encrypted_object_invalid_format':
        case 'failed_to_fetch_google_auth_token':
        case 'google_api_error':
        case 'hardware_wallet_failed_to_open_device':
        case 'invalid_encrypted_file_format':
        case 'ledger_blind_sign_not_enabled_or_running_non_eth_app':
        case 'ledger_is_locked':
        case 'ledger_not_running_any_app':
        case 'ledger_running_non_eth_app':
        case 'trezor_action_cancelled':
        case 'trezor_connection_already_initialized':
        case 'trezor_device_used_elsewhere':
        case 'trezor_method_cancelled':
        case 'trezor_permissions_not_granted':
        case 'trezor_pin_cancelled':
        case 'trezor_popup_closed':
        case 'user_trx_denied_by_user':
            report(error, tags, extra)
            break

        default:
            notReachable(error)
    }
}

const report = (
    error: unknown,
    tags: Record<string, string | number | null>,
    extra?: Record<string, unknown>
): void => {
    const env = getEnvironment()

    const alertError = (input: unknown) => {
        const string = [
            typeof input === 'object' && input instanceof Error
                ? input.stack
                : null,
            JSON.stringify(input, undefined, 4),
        ]
            .filter(Boolean)
            .join('\n\n')

        alert(string)
    }

    switch (env) {
        case 'local':
            console.error('💥💥💥 LOCAL mode error', error, { tags, extra }) // eslint-disable-line no-console
            alertError(error)
            break

        case 'development':
            console.error('💥💥💥 DEV mode error', error, { tags, extra }) // eslint-disable-line no-console
            alertError(error)
            Sentry.captureException(error, { tags, extra })
            break

        case 'production':
            Sentry.captureException(error, { tags, extra })
            break

        default:
            notReachable(env)
    }
}
