import { AppError, GoogleApiError } from '@zeal/domains/Error'
import { notReachable } from '@zeal/toolkit'
import { Result, failure, oneOf } from '@zeal/toolkit/Result'

import { parseUnblockAccountNumberAndSortCodeMismatch } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseUnblockAccountNumberAndSortCodeMismatch'
import { parseUnblockHardKycFailure } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseUnblockHardKycFailure'
import { parseUnblockInvalidIBAN } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseUnblockInvalidIBAN'
import { parseUnblockLoginError } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseUnblockLoginError'
import { parseUnblockSessionExpired } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseUnblockSessionExpired'
import { parseUnknownUnblockError } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseUnblockUnknownError'
import { parseUserWithSuchEmailAlreadyExists } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseUserWithSuchEmailAlreadyExists'
import { parseLedgerError } from '@zeal/domains/Error/domains/Ledger/parsers/parsers'
import { parseRPCError } from '@zeal/domains/Error/domains/RPCError/parsers/parseRPCError'
import { parseTrezorError } from '@zeal/domains/Error/domains/Trezor/parsers/parseTrezorError'
import { parseHttpError } from '@zeal/domains/Error/parsers/parseHttpError'
import { parseRPCRequestParseError } from '@zeal/domains/Error/parsers/parseRPCRequestParseError'
import { parseFailedToFetchGoogleAuthToken } from '@zeal/domains/GoogleDriveFile'
import {
    parseDecryptIncorrectPassword,
    parseEncryptedObjectInvalidFormat,
    parseInvalidEncryptedFileFormat,
} from '@zeal/toolkit/Crypto'
import { parseImperativeError } from './parseImperativeError'
import { parseUnexpectedFailureError } from './parseUnexpectedFailureError'
import { parseUnblockUnableToVerifyBVN } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseUnblockUnableToVerifyBVN'
import { parseUnblockBvnDoesNotMatch } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseUnblockBvnDoesNotMatch'

const parseGoogleAPIError = (
    error: unknown
): Result<unknown, GoogleApiError> => {
    return failure(error) // parser when needed
}

export const parseAppError = (error: unknown): AppError => {
    const parseResult = oneOf([
        oneOf([
            parseGoogleAPIError(error),
            parseFailedToFetchGoogleAuthToken(error),
            parseUnblockLoginError(error),
            parseUserWithSuchEmailAlreadyExists(error),
            parseUnblockSessionExpired(error),
            parseUnblockInvalidIBAN(error),
            parseUnblockUnableToVerifyBVN(error),
            parseUnblockBvnDoesNotMatch(error),
            parseUnblockAccountNumberAndSortCodeMismatch(error),
            parseUnblockHardKycFailure(error),
            parseUnknownUnblockError(error), // make sure all known unblock error is above this
        ]),
        parseRPCError(error),
        parseUnexpectedFailureError(error),
        parseImperativeError(error),
        parseRPCRequestParseError(error),
        parseLedgerError(error),
        parseTrezorError(error),
        parseDecryptIncorrectPassword(error),
        parseEncryptedObjectInvalidFormat(error),
        parseInvalidEncryptedFileFormat(error),
        parseHttpError(error), // This is more generic error, we would like to keep it at the end
    ])

    switch (parseResult.type) {
        case 'Failure':
            return { type: 'unknown_error', error }

        case 'Success':
            return parseResult.data

        /* istanbul ignore next */
        default:
            return notReachable(parseResult)
    }
}
