import React from 'react'
import { Account } from '@zeal/domains/Account'
import { Avatar } from 'src/domains/Account/components/Avatar'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStore } from '@zeal/domains/KeyStore'
import { CurrentNetwork } from '@zeal/domains/Network'
import { Name } from '@zeal/domains/Network/components/Name'
import { Portfolio } from '@zeal/domains/Portfolio'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Column } from '@zeal/uikit/Column'
import { CompressableContainer } from '@zeal/uikit/CompressableContainer'
import { Filter } from 'src/uikit/Icon/Filter'
import { ArrowDown } from 'src/uikit/Icon/Navigation/ArrowDown'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { Text } from '@zeal/uikit/Text'
import { ShowBalance } from './ShowBalance'

type Props = {
    currentAccount: Account
    currentNetwork: CurrentNetwork
    keystore: KeyStore
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'account_filter_click' } | { type: 'network_filter_click' }

const Container = ({
    onMsg,
    currentNetwork,
    currentAccount,
    keystore,
    children,
}: Props & { children: React.ReactNode }) => {
    return (
        <CompressableContainer variant="compressed">
            <Row spacing={0} alignX="stretch">
                <Tertiary
                    size="regular"
                    color="on_dark"
                    onClick={() => {
                        onMsg({ type: 'account_filter_click' })
                    }}
                >
                    <Avatar
                        account={currentAccount}
                        size={28}
                        keystore={keystore}
                    />

                    <Column spacing={0} alignX="start">
                        <Row spacing={6} alignY="center">
                            <Text ellipsis>{currentAccount.label}</Text>
                            <ArrowDown size={16} />
                        </Row>
                        <Text>{children}</Text>
                    </Column>
                </Tertiary>
                <Row spacing={0} alignX="end">
                    <Tertiary
                        size="small"
                        color="on_dark"
                        onClick={() => {
                            onMsg({ type: 'network_filter_click' })
                        }}
                    >
                        <Filter size={14} />
                        <Name currentNetwork={currentNetwork} />
                        <ArrowDown size={14} />
                    </Tertiary>
                </Row>
            </Row>
        </CompressableContainer>
    )
}

export const SmallWidget = ({
    portfolio,
    currentAccount,
    currentNetwork,
    keystore,
    currencyHiddenMap,
    onMsg,
}: Props & { portfolio: Portfolio }) => {
    return (
        <Container
            currencyHiddenMap={currencyHiddenMap}
            keystore={keystore}
            currentAccount={currentAccount}
            currentNetwork={currentNetwork}
            onMsg={onMsg}
        >
            <ShowBalance
                currencyHiddenMap={currencyHiddenMap}
                portfolio={portfolio}
                currentNetwork={currentNetwork}
            />
        </Container>
    )
}

export const SmallWidgetSkeleton = ({
    currentNetwork,
    currentAccount,
    keystore,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    return (
        <Container
            currencyHiddenMap={currencyHiddenMap}
            keystore={keystore}
            currentAccount={currentAccount}
            currentNetwork={currentNetwork}
            onMsg={onMsg}
        >
            <Skeleton variant="transparent" width="100%" height={18} />
        </Container>
    )
}

export const SmallWidgetError = ({
    currentNetwork,
    currentAccount,
    keystore,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    return (
        <Container
            currencyHiddenMap={currencyHiddenMap}
            keystore={keystore}
            currentAccount={currentAccount}
            currentNetwork={currentNetwork}
            onMsg={onMsg}
        >
            &nbsp;
        </Container>
    )
}
