import React from 'react'

import { ActionBar as UIActionBar } from '@zeal/uikit/ActionBar'
import { Network } from '@zeal/domains/Network'
import { Account } from '@zeal/domains/Account'
import { Row } from '@zeal/uikit/Row'
import { Avatar as NetworkAvatar } from 'src/domains/Network/components/Avatar'
import { AvatarWithoutBadge as AccountAvatar } from 'src/domains/Account/components/Avatar'
import { format as formatAddress } from '@zeal/domains/Address/helpers/format'
import { Text } from '@zeal/uikit/Text'
import { KeyStore } from '@zeal/domains/KeyStore'

type Props = {
    network: Network | null
    account: Account
    keystore: KeyStore

    left?: React.ReactNode
    right?: React.ReactNode
}

export const ActionBar = ({
    left,
    right,
    account,
    keystore,
    network,
}: Props) => (
    <UIActionBar
        left={left}
        right={right}
        center={
            <Row grow spacing={8}>
                {network && (
                    <NetworkAvatar
                        size={24}
                        currentNetwork={{
                            type: 'specific_network',
                            network,
                        }}
                    />
                )}
                <Row shrink={false} spacing={0}>
                    <AccountAvatar
                        size={24}
                        keystore={keystore}
                        account={account}
                    />
                </Row>
                <Text
                    variant="footnote"
                    color="textSecondary"
                    weight="regular"
                    ellipsis
                >
                    {account.label}
                </Text>
                <Row shrink={false} spacing={0}>
                    <Text
                        variant="footnote"
                        color="textSecondary"
                        weight="regular"
                    >
                        {formatAddress(account.address)}
                    </Text>
                </Row>
            </Row>
        }
    />
)
