import { FormattedMessage } from 'react-intl'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { Avatar as AccountAvatar } from 'src/domains/Account/components/Avatar'
import { CopyAddress } from 'src/domains/Address/components/CopyAddress'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { NetworkMap } from '@zeal/domains/Network'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import {
    P2PNFTTransaction,
    P2PTransaction,
} from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { notReachable } from '@zeal/toolkit'
import { Avatar as UIAvatar } from 'src/uikit/Avatar'
import { Column2 } from 'src/uikit/Column2'
import { QuestionCircle } from 'src/uikit/Icon/QuestionCircle'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Text2 } from 'src/uikit/Text2'
import { Nft } from './Unknown/Nft'
import { Token } from './Unknown/Token'

type Props = {
    transaction: P2PTransaction | P2PNFTTransaction
    dApp: DAppSiteInfo | null
    knownCurrencies: KnownCurrencies
    checks: TransactionSafetyCheck[]
    accounts: AccountsMap
    keystores: KeyStoreMap
    networkMap: NetworkMap
}

export type Msg = { type: 'close' }

export const P2PTransactionView = ({
    checks,
    transaction,
    knownCurrencies,
    accounts,
    keystores,
    networkMap,
}: Props) => {
    const account: Account | null = accounts[transaction.toAddress]
    const keystore = getKeyStore({
        keyStoreMap: keystores,
        address: transaction.toAddress,
    })

    return (
        <Column2 spacing={24}>
            <Column2 spacing={0}>
                {(() => {
                    switch (transaction.type) {
                        case 'P2PTransaction':
                            return (
                                <Token
                                    networkMap={networkMap}
                                    safetyChecks={checks}
                                    key={transaction.token.amount.currencyId}
                                    knownCurrencies={knownCurrencies}
                                    token={transaction.token}
                                />
                            )
                        case 'P2PNftTransaction':
                            return (
                                <Nft
                                    networkMap={networkMap}
                                    checks={checks}
                                    key={transaction.nft.nft.tokenId}
                                    transactionNft={transaction.nft}
                                />
                            )
                        /* istanbul ignore next */
                        default:
                            return notReachable(transaction)
                    }
                })()}
            </Column2>

            <Column2 spacing={12} aria-labelledby="receive-section-label">
                <Text2
                    id="receive-section-label"
                    variant="paragraph"
                    weight="regular"
                    color="textSecondary"
                >
                    <FormattedMessage
                        id="simulatedTransaction.p2p.info.account"
                        defaultMessage="To"
                    />
                </Text2>
                {account ? (
                    <ListItem2
                        size="large"
                        avatar={({ size }) => (
                            <AccountAvatar
                                account={account}
                                keystore={keystore}
                                size={size}
                            />
                        )}
                        primaryText={account.label}
                        shortText={
                            <CopyAddress
                                address={account.address}
                                color="on_light"
                                size="regular"
                            />
                        }
                        aria-selected={false}
                    />
                ) : (
                    <ListItem2
                        size="large"
                        avatar={({ size }) => (
                            <UIAvatar
                                size={size}
                                icon={
                                    <QuestionCircle
                                        size={size}
                                        color="iconDefault"
                                    />
                                }
                            />
                        )}
                        primaryText={
                            <FormattedMessage
                                id="simulatedTransaction.p2p.info.unlabelledAccount"
                                defaultMessage="Unlabelled wallet"
                            />
                        }
                        shortText={
                            <CopyAddress
                                address={transaction.toAddress}
                                color="on_light"
                                size="regular"
                            />
                        }
                        aria-selected={false}
                    />
                )}
            </Column2>
        </Column2>
    )
}
