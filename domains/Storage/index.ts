import { AccountsMap } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { CountryISOCode } from '@zeal/domains/Country'
import {
    CryptoCurrency,
    CurrencyHiddenMap,
    CurrencyId,
    CurrencyPinMap,
} from '@zeal/domains/Currency'
import {
    SubmittedOfframpTransaction,
    UnblockLoginSignature,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { SubmitedBridgesMap } from '@zeal/domains/Currency/domains/Bridge'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { CustomNetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { DAppConnectionState } from '@zeal/domains/Storage/domains/DAppConnectionState'
import { Submited } from '@zeal/domains/TransactionRequest'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

// !!! :: storage should intentionally be separated from domains types to allow migrations in future

export type Storage = {
    selectedAddress: Address | null
    fetchedAt: Date
    accounts: AccountsMap
    portfolios: PortfolioMap
    keystoreMap: KeyStoreMap
    // encrypted session password with user password
    encryptedPassword: string
    customCurrencies: CustomCurrencyMap
    dApps: Record<string, DAppConnectionState>
    transactionRequests: Record<Address, Submited[]>
    submitedBridges: SubmitedBridgesMap
    submittedOffRampTransactions: SubmittedOfframpTransaction[]
    swapSlippagePercent: number | null
    customNetworkMap: CustomNetworkMap
    networkRPCMap: NetworkRPCMap
    bankTransferInfo: BankTransferInfo
    isOnboardingStorySeen: boolean
    feePresetMap: FeePresetMap
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
}

// TODO :: maybe to move to BankTranfer domain?
export type BankTransferInfo =
    | BankTransferSetupNotStarted
    | BankTransferUnblockUserCreated

export type SumSubAccessToken = string //  This is an access token to use with the SumSub document verification SDK (during KYC process)

export type BankTransferSetupNotStarted = {
    type: 'not_started'
}

export type BankTransferUnblockUserCreated = {
    type: 'unblock_user_created'
    unblockUserId: string
    countryCode: CountryISOCode | null
    connectedWalletAddress: Address
    unblockLoginSignature: UnblockLoginSignature
    sumSubAccessToken: SumSubAccessToken | null
}

export type CustomCurrencyMap = Record<CurrencyId, CryptoCurrency>

// TODO Think if this should be moved to some other domain
export type StorageState =
    | { type: 'no_storage' }
    | { type: 'locked'; storage: Storage }
    | { type: 'unlocked'; sessionPassword: string; storage: Storage }
