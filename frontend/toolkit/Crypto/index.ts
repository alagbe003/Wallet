import {
    encrypt as mmEncrypt,
    decrypt as mmDecrypt,
} from '@metamask/browser-passworder'
import { failure, object, Result, shape, string, success } from '../Result'
import { parse as parseJSON } from '../JSON'

export const encrypt = async <R>(
    password: string,
    toEncrypt: R
): Promise<string> => {
    return mmEncrypt(password, toEncrypt)
}

export const decrypt = async <T>(
    password: string,
    encryptedString: string,
    parser: (input: unknown) => Result<unknown, T>
): Promise<T> => {
    try {
        const parsed = parseEncryptedString(
            encryptedString
        ).getSuccessResultOrThrow('encrypted string is invalid')

        const decoded = await mmDecrypt(password, parsed)
        return parser(decoded).getSuccessResultOrThrow(
            'cannot parse encrypted object'
        )
    } catch (e) {
        if (e instanceof Error) {
            if (e.message === 'Incorrect password') {
                throw new DecryptIncorrectPassword()
            }
            if (e.message === 'encrypted string is invalid') {
                throw new InvalidEncryptedFileFormat(e)
            }
            if (e.message === 'cannot parse encrypted object') {
                throw new EncryptedObjectInvalidFormat(e)
            }
        }

        throw e
    }
}

const parseEncryptedString = (input: unknown): Result<unknown, string> =>
    string(input).andThen((s) =>
        parseJSON(s)
            .andThen(object)
            .andThen((obj) =>
                shape({
                    data: string(obj.data),
                    iv: string(obj.iv),
                    salt: string(obj.salt),
                })
            )
            .map(() => s)
    )

export class DecryptIncorrectPassword extends Error {
    isDecryptIncorrectPassword = true
    type: 'decrypt_incorrect_password'
    name: string = 'DecryptIncorrectPassword'

    constructor() {
        super('Incorrect password')
        this.type = 'decrypt_incorrect_password'
    }
}

export const parseDecryptIncorrectPassword = (
    e: unknown
): Result<unknown, DecryptIncorrectPassword> =>
    e instanceof DecryptIncorrectPassword &&
    e.type === 'decrypt_incorrect_password'
        ? success(e)
        : failure('not correct instance')

export class InvalidEncryptedFileFormat extends Error {
    isInvalidEncryptedFileFormat = true
    type: 'invalid_encrypted_file_format'
    name: string = 'DecryptIncorrectPassword'
    parsingError: unknown

    constructor(parsingError: unknown) {
        super('Invalid encrypted file format')
        this.type = 'invalid_encrypted_file_format'
        this.parsingError = parsingError
    }
}

export const parseInvalidEncryptedFileFormat = (
    e: unknown
): Result<unknown, InvalidEncryptedFileFormat> =>
    e instanceof InvalidEncryptedFileFormat &&
    e.type === 'invalid_encrypted_file_format'
        ? success(e)
        : failure('not correct instance')

export class EncryptedObjectInvalidFormat extends Error {
    isEncryptedObjectInvalidFormat = true
    type: 'encrypted_object_invalid_format'
    name: string = 'DecryptIncorrectPassword'
    parsingError: unknown

    constructor(parsingError: unknown) {
        super('Decrypt incorrect password')
        this.type = 'encrypted_object_invalid_format'
        this.parsingError = parsingError
    }
}

export const parseEncryptedObjectInvalidFormat = (
    e: unknown
): Result<unknown, EncryptedObjectInvalidFormat> =>
    e instanceof EncryptedObjectInvalidFormat &&
    e.type === 'encrypted_object_invalid_format'
        ? success(e)
        : failure('not correct instance')
