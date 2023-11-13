import { Address } from '@zeal/domains/Address'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { ListItem } from '@zeal/uikit/ListItem'
import { Avatar } from 'src/domains/Account/components/Avatar'
import { Avatar as UIAvatar } from '@zeal/uikit/Avatar'
import { QuestionCircle } from '@zeal/uikit/Icon/QuestionCircle'
import { FormattedMessage } from 'react-intl'
import { CopyAddress } from '@zeal/domains/Address/components/CopyAddress'
import React from 'react'
import { LightArrowDown2 } from '@zeal/uikit/Icon/LightArrowDown2'

type Props = {
    address: Address
    keyStoreMap: KeyStoreMap
    accountsMap: AccountsMap
    onClick: () => void
}

export const ToAddress = ({
    address,
    accountsMap,
    keyStoreMap,
    onClick,
}: Props) => {
    const account: Account | null = accountsMap[address]
    const keyStore = getKeyStore({
        keyStoreMap: keyStoreMap,
        address,
    })

    return account ? (
        <ListItem
            size="large"
            onClick={onClick}
            avatar={({ size }) => (
                <Avatar account={account} keystore={keyStore} size={size} />
            )}
            primaryText={account.label}
            shortText={
                <CopyAddress
                    size="small"
                    color="on_light"
                    address={account.address}
                />
            }
            aria-selected={false}
            side={{
                rightIcon: ({ size }) => (
                    <LightArrowDown2 size={size} color="iconDefault" />
                ),
            }}
        />
    ) : (
        <ListItem
            size="large"
            onClick={onClick}
            avatar={({ size }) => (
                <UIAvatar size={size}>
                    <QuestionCircle size={size} color="iconDefault" />
                </UIAvatar>
            )}
            primaryText={
                <FormattedMessage
                    id="send_token.form.unlabelled-wallet"
                    defaultMessage="Unlabelled wallet"
                />
            }
            shortText={
                <CopyAddress
                    address={address}
                    color="on_light"
                    size="regular"
                />
            }
            aria-selected={false}
            side={{
                rightIcon: ({ size }) => (
                    <LightArrowDown2 size={size} color="iconDefault" />
                ),
            }}
        />
    )
}
