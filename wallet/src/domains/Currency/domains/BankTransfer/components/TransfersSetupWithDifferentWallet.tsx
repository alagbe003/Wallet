import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { UnlockedListItem } from 'src/domains/Account/components/UnlockedListItem'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { notReachable } from '@zeal/toolkit'
import { Button } from 'src/uikit'
import { Group } from 'src/uikit/Group'
import { Header } from 'src/uikit/Header'
import { Popup } from 'src/uikit/Popup'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

type Props = {
    bankTransferAccount: Account
    keyStoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_continue_to_bank_transfer_clicked'; account: Account }

export const TransfersSetupWithDifferentWallet = ({
    bankTransferAccount: account,
    keyStoreMap,
    portfolioMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                title={
                    <FormattedMessage
                        id="transfer_setup_with_different_wallet.title"
                        defaultMessage="Switch wallet"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="transfer_setup_with_different_wallet.subtitle"
                        defaultMessage="Bank transfers are setup with a different wallet. You can only have one wallet connected to transfers."
                        values={{ br: <br /> }}
                    />
                }
            />

            <Group variant="default" style={{ overflow: 'auto' }}>
                <UnlockedListItem
                    currencyHiddenMap={currencyHiddenMap}
                    selectionVariant="default"
                    selected={false}
                    account={account}
                    keyStore={getKeyStore({
                        keyStoreMap,
                        address: account.address,
                    })}
                    portfolio={portfolioMap[account.address]}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'account_item_clicked':
                                onMsg({
                                    type: 'on_continue_to_bank_transfer_clicked',
                                    account,
                                })
                                break

                            default:
                                return notReachable(msg.type)
                        }
                    }}
                />
            </Group>

            <Button
                variant="primary"
                size="regular"
                onClick={() =>
                    onMsg({
                        type: 'on_continue_to_bank_transfer_clicked',
                        account,
                    })
                }
            >
                <FormattedMessage
                    id="transfer_setup_with_different_wallet.swtich_and_continue"
                    defaultMessage="Switch and continue"
                />
            </Button>
        </Popup.Layout>
    )
}
