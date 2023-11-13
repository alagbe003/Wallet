import { Account, AccountsMap } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'
import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { failure, Result, success } from '@zeal/toolkit/Result'

import { Flow } from './Flow'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'

type Props = {
    address: Address
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    encryptedPassword: string
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof Flow>

const checkParams = ({
    accountsMap,
    keyStoreMap,
    address,
}: {
    address: Address
    keyStoreMap: KeyStoreMap
    accountsMap: AccountsMap
}): Result<unknown, { account: Account; keystore: SecretPhrase }> => {
    const account = accountsMap[address] || null

    if (!account) {
        return failure('account_not_found')
    }

    const keystore = getKeyStore({ keyStoreMap, address })

    switch (keystore.type) {
        case 'private_key_store':
        case 'ledger':
        case 'trezor':
        case 'track_only':
        case 'safe_v0':
            return failure('wrong_keystore_type')
        case 'secret_phrase_key':
            return success({ account, keystore })

        /* istanbul ignore next */
        default:
            return notReachable(keystore)
    }
}

export const SetupRecoveryKit = ({
    accountsMap,
    address,
    keystoreMap,
    encryptedPassword,
    onMsg,
}: Props) => {
    const { account, keystore } = checkParams({
        accountsMap,
        keyStoreMap: keystoreMap,
        address,
    }).getSuccessResultOrThrow(
        'Failed to parse params for SetupRecoveryKit flow on page'
    )

    return (
        <Flow
            account={account}
            accounts={accountsMap}
            encryptedPassword={encryptedPassword}
            keystore={keystore}
            keystoreMap={keystoreMap}
            onMsg={onMsg}
        />
    )
}
