import {
    match,
    nullableOf,
    object,
    oneOf,
    Result,
    shape,
    string,
    ValidObject,
} from '@zeal/toolkit/Result'
import {
    AddAccount,
    AddFromHardwareWallet,
    BankTransfer,
    Bridge,
    CreateContact,
    EntryPoint,
    Extension,
    KycProcess,
    Onboarding,
    SendERC20Token,
    SendNFT,
    SetupRecoveryKit,
    Swap,
    ZWidget,
} from '@zeal/domains/Main'
import { fromString as parseAddressFromString } from '@zeal/domains/Address/helpers/fromString'
import { parse as parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'

export const parseEntrypoint = (input: unknown): Result<unknown, EntryPoint> =>
    object(input).andThen((obj) =>
        oneOf([
            oneOf([
                parseExtension(obj),
                parseZwidget(obj),
                parseAddAccount(obj),
                parseSendNFT(obj),
                parseSendErc20Token(obj),
                parseSetupRecoveryKit(obj),
                parseOnboarding(obj),
                parseCreateContact(obj),
                parseSwap(obj),
                parseBridge(obj),
            ]),
            oneOf([
                parseBankTransfer(obj),
                parseAddFromHardwareWallet(obj),
                parseKycProcess(obj),
            ]),
        ])
    )

const parseBankTransfer = (input: ValidObject): Result<unknown, BankTransfer> =>
    shape({
        type: match(input.type, 'bank_transfer' as const),
    })

const parseKycProcess = (input: ValidObject): Result<unknown, KycProcess> =>
    shape({
        type: match(input.type, 'kyc_process' as const),
    })

const parseBridge = (input: ValidObject): Result<unknown, Bridge> =>
    shape({
        type: match(input.type, 'bridge' as const),
        fromCurrencyId: nullableOf(input.fromCurrencyId, string),
        fromNetworkHexId: nullableOf(input.fromNetworkHexId, parseNetworkHexId),
        fromAddress: string(input.fromAddress).andThen(parseAddressFromString),
    })

const parseSwap = (input: ValidObject): Result<unknown, Swap> =>
    shape({
        type: match(input.type, 'swap' as const),
        fromCurrencyId: nullableOf(input.fromCurrencyId, string),
        fromAddress: string(input.fromAddress).andThen(parseAddressFromString),
    })

const parseOnboarding = (input: ValidObject): Result<unknown, Onboarding> =>
    shape({
        type: match(input.type, 'onboarding' as const),
    })

const parseCreateContact = (
    input: ValidObject
): Result<unknown, CreateContact> =>
    shape({
        type: match(input.type, 'create_contact' as const),
    })

const parseAddFromHardwareWallet = (
    input: ValidObject
): Result<unknown, AddFromHardwareWallet> =>
    shape({
        type: match(input.type, 'add_from_hardware_wallet' as const),
    })

const parseSetupRecoveryKit = (
    input: ValidObject
): Result<unknown, SetupRecoveryKit> =>
    shape({
        type: match(input.type, 'setup_recovery_kit' as const),
        address: string(input.address),
    })

const parseExtension = (input: ValidObject): Result<unknown, Extension> =>
    shape({
        type: match(input.type, 'extension' as const),
    })

const parseAddAccount = (input: ValidObject): Result<unknown, AddAccount> =>
    shape({
        type: match(input.type, 'add_account' as const),
    })

const parseZwidget = (input: ValidObject): Result<unknown, ZWidget> =>
    shape({
        type: match(input.type, 'zwidget' as const),
        dAppUrl: string(input.dAppUrl),
    })

const parseSendErc20Token = (
    input: ValidObject
): Result<unknown, SendERC20Token> =>
    shape({
        type: match(input.type, 'send_erc20_token' as const),
        tokenCurrencyId: nullableOf(input.tokenCurrencyId, string),
        fromAddress: string(input.fromAddress),
    })

const parseSendNFT = (input: ValidObject): Result<unknown, SendNFT> =>
    shape({
        type: match(input.type, 'send_nft' as const),
        fromAddress: string(input.fromAddress),
        nftId: string(input.nftId),
        mintAddress: string(input.mintAddress),
        networkHexId: oneOf([
            parseNetworkHexId(input.network),
            parseNetworkHexId(input.networkHexId),
        ]),
    })
