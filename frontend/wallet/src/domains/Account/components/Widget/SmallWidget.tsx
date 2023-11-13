import React from 'react'
import { Account } from '@zeal/domains/Account'
import { Avatar } from 'src/domains/Account/components/Avatar'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStore } from '@zeal/domains/KeyStore'
import { CurrentNetwork } from '@zeal/domains/Network'
import { Name } from 'src/domains/Network/components/Name'
import { Portfolio } from '@zeal/domains/Portfolio'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { Column2 } from 'src/uikit/Column2'
import { CompressableContainer } from '@zeal/uikit/CompressableContainer'
import { Filter } from 'src/uikit/Icon/Filter'
import { ArrowDown } from 'src/uikit/Icon/Navigation/ArrowDown'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from 'src/uikit/Skeleton'
import { Text2 } from 'src/uikit/Text2'
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

                    <Column2 spacing={0} alignX="start">
                        <Row spacing={6} alignY="center">
                            <Text2 ellipsis>{currentAccount.label}</Text2>
                            <ArrowDown size={16} />
                        </Row>
                        <Text2>{children}</Text2>
                    </Column2>
                </Tertiary>
                <Column2 spacing={0} alignX="end">
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
                </Column2>
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
