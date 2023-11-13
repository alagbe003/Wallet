import { Account } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStore } from '@zeal/domains/KeyStore'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { sumPortfolio } from '@zeal/domains/Portfolio/helpers/sum'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Row } from '@zeal/uikit/Row'
import { AvatarWithoutBadge } from 'src/domains/Account/components/Avatar'
import { CopyAddress } from 'src/domains/Address/components/CopyAddress'
import { IconButton } from '@zeal/uikit/IconButton'
import { Column } from '@zeal/uikit/Column'
import { LightEdit } from 'src/uikit/Icon/LightEdit'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { OutlineQRCode } from 'src/uikit/Icon/OutlineQRCode'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'
import { Actions } from './Actions'
import { AddressPredictions } from './AddressPredictions'
import { KeyStoreTag } from './KeystoreTag'

type Props = {
    account: Account
    portfolio: Portfolio | null
    keystore: KeyStore
    currencyHiddenMap: CurrencyHiddenMap
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_edit_label_click' }
    | { type: 'on_see_qr_code_click'; keystore: KeyStore }
    | MsgOf<typeof Actions>

export const Layout = ({
    portfolio,
    keystore,
    currencyHiddenMap,
    account,
    networkRPCMap,
    sessionPassword,
    onMsg,
}: Props) => {
    const sum = portfolio && sumPortfolio(portfolio, currencyHiddenMap)

    return (
        <Screen padding="form" background="light">
            <ActionBar
                left={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <BackIcon size={24} />
                    </IconButton>
                }
                right={
                    keystore && (
                        <IconButton
                            onClick={() =>
                                onMsg({
                                    type: 'on_see_qr_code_click',
                                    keystore,
                                })
                            }
                        >
                            <OutlineQRCode size={24} />
                        </IconButton>
                    )
                }
            />

            <Column alignX="center" spacing={24}>
                <Column alignX="center" spacing={16}>
                    <AvatarWithoutBadge
                        size={80}
                        keystore={keystore}
                        account={account}
                    />

                    <Column alignX="center" spacing={4}>
                        <Row spacing={8} alignX="center">
                            <Text
                                ellipsis
                                variant="title2"
                                weight="bold"
                                color="textPrimary"
                            >
                                {account.label}
                            </Text>

                            <IconButton
                                onClick={() => {
                                    onMsg({ type: 'on_edit_label_click' })
                                }}
                            >
                                <LightEdit size={16} />
                            </IconButton>
                        </Row>

                        {sum && (
                            <Text
                                variant="title1"
                                weight="bold"
                                color="textPrimary"
                                align="center"
                            >
                                <FormattedTokenBalanceInDefaultCurrency
                                    money={sum}
                                    knownCurrencies={portfolio.currencies}
                                />
                            </Text>
                        )}

                        <Row spacing={16}>
                            <KeyStoreTag keystore={keystore} />
                            <CopyAddress
                                size="small"
                                color="on_light"
                                address={account.address}
                            />
                        </Row>
                    </Column>
                </Column>

                <Actions account={account} keystore={keystore} onMsg={onMsg} />

                <AddressPredictions
                    account={account}
                    keyStore={keystore}
                    networkRPCMap={networkRPCMap}
                    sessionPassword={sessionPassword}
                />
            </Column>
        </Screen>
    )
}
