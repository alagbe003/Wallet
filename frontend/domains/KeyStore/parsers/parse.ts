import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'
import { parseIndexKey } from '@zeal/domains/Address/helpers/parseIndexKey'
import {
    KeyStoreMap,
    LEDGER,
    PrivateKey,
    SafeV0,
    SecretPhrase,
    Trezor,
} from '@zeal/domains/KeyStore'
import {
    Result,
    boolean,
    match,
    number,
    object,
    oneOf,
    recordStrict,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

export const parse = (input: unknown): Result<unknown, KeyStoreMap> =>
    object(input)
        .andThen(parseIndexKey)
        .andThen((obj) =>
            recordStrict(obj, {
                keyParser: parseAddress,
                valueParser: (o) =>
                    oneOf([
                        parsePrivateKey(o),
                        parseLedger(o),
                        parseSecretPhrase(o),
                        parseTrezor(o),
                        parseSafeV0(o),
                        success({ type: 'track_only' } as const),
                    ]),
            })
        )

const parseTrezor = (input: unknown): Result<unknown, Trezor> => {
    return object(input).andThen((obj) => {
        return shape({
            type: match(obj.type, 'trezor' as const),
            address: string(obj.address),
            path: string(obj.path),
        })
    })
}

const parseLedger = (input: unknown): Result<unknown, LEDGER> => {
    return object(input).andThen((obj) => {
        return shape({
            type: match(obj.type, 'ledger' as const),
            address: string(obj.address),
            path: string(obj.path),
        })
    })
}

const parseSecretPhrase = (input: unknown): Result<unknown, SecretPhrase> =>
    object(input).andThen((obj) =>
        shape({
            type: match(obj.type, 'secret_phrase_key' as const),
            bip44Path: string(obj.bip44Path),
            encryptedPhrase: string(obj.encryptedPhrase),
            confirmed: oneOf([boolean(obj.confirmed), success(true)]),
            googleDriveFile: oneOf([
                object(obj.googleDriveFile).andThen((file) =>
                    shape({
                        id: string(file.id),
                        modifiedTime: number(file.modifiedTime),
                    })
                ),
                success(null),
            ]),
        })
    )

const parsePrivateKey = (input: unknown): Result<unknown, PrivateKey> => {
    return object(input).andThen((obj) =>
        shape({
            type: match(obj.type, 'private_key_store' as const),
            address: string(obj.address),
            encryptedPrivateKey: string(obj.encryptedPrivateKey),
        })
    )
}

const parseSafeV0 = (input: unknown): Result<unknown, SafeV0> => {
    return object(input).andThen((obj) =>
        shape({
            type: match(obj.type, 'safe_v0' as const),
            address: string(obj.address),

            safeDeplymentConfig: object(obj.safeDeplymentConfig).andThen(
                (config) =>
                    shape({
                        threshold: number(config.threshold),
                        saltNonce: string(config.saltNonce),
                        ownerKeyStore: parseSecretPhrase(config.ownerKeyStore),
                    })
            ),
        })
    )
}
