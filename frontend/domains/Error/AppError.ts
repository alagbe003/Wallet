import { RPCRequestParseError } from './RPCRequestParseError'

import { UnexpectedResultFailureError } from '@zeal/toolkit/Result'
import { LedgerError } from '@zeal/domains/Error/domains/Ledger'
import { RPCResponseError } from '@zeal/domains/Error/domains/RPCError'
import { TrezorError } from '@zeal/domains/Error/domains/Trezor'
import {
    DecryptIncorrectPassword,
    EncryptedObjectInvalidFormat,
    InvalidEncryptedFileFormat,
} from '@zeal/toolkit/Crypto'
import { FailedToFetchGoogleAuthToken } from '@zeal/domains/GoogleDriveFile'

export class HttpError extends Error {
    isHttpError = true
    type: 'http_error' = 'http_error' as const
    name = 'HttpError' as const

    url: string
    queryParams: unknown
    method: string
    data: unknown
    status: number | null
    trace: string | null

    constructor(
        url: string,
        method: string,
        status: number | null,
        trace: string | null,
        data: unknown,
        queryParams: unknown
    ) {
        super('HttpError')
        this.trace = trace
        this.url = url
        this.method = method
        this.status = status
        this.data = data
        this.queryParams = queryParams
    }
}

export class ImperativeError extends Error {
    isImperativeError = true
    type: 'imperative_error'
    name = 'ImperativeError'

    constructor(message: string) {
        super(message)
        this.type = 'imperative_error'
    }
}

export type UnknownError = {
    type: 'unknown_error'
    error: unknown
}

export type UnexpectedFailureError = {
    type: 'unexpected_failure'
    error: UnexpectedResultFailureError<unknown>
}

export type GoogleApiError = {
    type: 'google_api_error'
    code: number // TODO :: add more union codes here
    message: string
    error: unknown
}

export type UnblockLoginUserDidNotExists = {
    type: 'unblock_login_user_did_not_exists'
}

export class UnknownUnblockError extends Error {
    isUnknownUnblockError = true
    type: 'unknown_unblock_error' = 'unknown_unblock_error' as const
    name: string = 'UnknownUnblockError' as const

    url: string
    method: string
    data: unknown
    status: number | null
    trace: string | null
    errorId: string

    constructor(
        url: string,
        method: string,
        status: number | null,
        trace: string | null,
        errorId: string,
        data: unknown,
        message: string
    ) {
        super(message)
        this.trace = trace
        this.url = url
        this.method = method
        this.status = status
        this.errorId = errorId
        this.data = data
    }
}

export type UnblockUserWithSuchEmailAlreadyExists = {
    type: 'unblock_user_with_such_email_already_exists'
}

export type UnblockAccountNumberAndSortCodeMismatch = {
    type: 'unblock_account_number_and_sort_code_mismatch'
}

export type UnblockUnableToVerifyBVN = { type: 'unblock_unable_to_verify_bvn' }

export type UnblockBvnDoesNotMatch = { type: 'unblock_bvn_does_not_match' }

export type UnblockInvalidIBAN = {
    type: 'unblock_invalid_iban'
}

export type UnblockHardKycFailure = {
    type: 'unblock_hard_kyc_failure'
}

export type UnblockSessionExpired = {
    type: 'unblock_session_expired'
}

export type AppError =
    | UnexpectedFailureError
    | ImperativeError
    | UnknownError
    | RPCRequestParseError
    | RPCResponseError
    | HttpError
    | LedgerError
    | TrezorError
    | GoogleApiError
    | DecryptIncorrectPassword
    | EncryptedObjectInvalidFormat
    | InvalidEncryptedFileFormat
    | FailedToFetchGoogleAuthToken
    | UnblockAccountNumberAndSortCodeMismatch
    | UnblockInvalidIBAN
    | UnblockUnableToVerifyBVN
    | UnblockBvnDoesNotMatch
    | UnblockHardKycFailure
    | UnblockLoginUserDidNotExists
    | UnblockUserWithSuchEmailAlreadyExists
    | UnblockSessionExpired
    | UnknownUnblockError
