import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import {
    CryptoCurrency,
    CurrencyHiddenMap,
    CurrencyId,
    CurrencyPinMap,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { Portfolio } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { Token } from '@zeal/domains/Token'
import { ListItem } from 'src/domains/Token/components/ListItem'
import { notReachable } from '@zeal/toolkit'
import { IconButton } from 'src/uikit'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column2 } from 'src/uikit/Column2'
import { Group } from 'src/uikit/Group'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { ArrowLeftSquared } from 'src/uikit/Icon/ArrowLeftSquared'
import { ArrowRightSquared } from 'src/uikit/Icon/ArrowRightSquared'
import { BoldGeneralBank } from 'src/uikit/Icon/BoldGeneralBank'
import { BoldStar } from 'src/uikit/Icon/BoldStar'
import { BoldSwap } from 'src/uikit/Icon/BoldSwap'
import { Bridge as BridgeIcon } from 'src/uikit/Icon/Bridge'
import { ForwardIcon } from 'src/uikit/Icon/Navigation/ForwardIcon'
import { Setting } from 'src/uikit/Icon/Setting'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Row } from '@zeal/uikit/Row'
import { HideUnHideButton } from './HideUnHideButton'

type Props = {
    currencyId: CurrencyId | null
    fromAccount: Account
    portfolio: Portfolio
    networkMap: NetworkMap
    customCurrencyMap: CustomCurrencyMap
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'on_send_clicked'
          fromAddress: Address
          currencyId: CurrencyId | null
      }
    | {
          type: 'on_swap_clicked'
          fromAddress: Address
          currencyId: CurrencyId | null
      }
    | {
          type: 'on_bridge_clicked'
          fromAddress: Address
          currencyId: CurrencyId | null
      }
    | { type: 'on_receive_selected' }
    | { type: 'on_bank_transfer_selected' }
    | {
          type: 'on_token_settings_click'
          currency: CryptoCurrency
      }
    | { type: 'on_token_pin_click'; currency: CryptoCurrency }
    | { type: 'on_token_un_pin_click'; currency: CryptoCurrency }
    | { type: 'on_token_hide_click'; token: Token }
    | { type: 'on_token_un_hide_click'; token: Token }

type State =
    | { type: 'no_currency_selected' }
    | {
          type: 'currency_selected'
          currency: CryptoCurrency
          network: Network
          portfolioToken: Token | null
      }

const calculateState = ({
    currencyId,
    knownCurrencies,
    networkMap,
    portfolio,
}: {
    currencyId: CurrencyId | null
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
    portfolio: Portfolio
}): State => {
    if (!currencyId) {
        return { type: 'no_currency_selected' }
    }

    const currency = (currencyId && knownCurrencies[currencyId]) || null

    if (!currency) {
        return { type: 'no_currency_selected' }
    }

    switch (currency.type) {
        case 'FiatCurrency':
            return { type: 'no_currency_selected' }

        case 'CryptoCurrency':
            return {
                type: 'currency_selected',
                currency,
                network: findNetworkByHexChainId(
                    currency.networkHexChainId,
                    networkMap
                ),
                portfolioToken:
                    portfolio.tokens.find(
                        (portfolioToken) =>
                            portfolioToken.balance.currencyId === currencyId
                    ) || null,
            }

        default:
            return notReachable(currency)
    }
}

export const Actions = ({
    currencyId,
    portfolio,
    fromAccount,
    networkMap,
    customCurrencyMap,
    currencyHiddenMap,
    currencyPinMap,
    onMsg,
}: Props) => {
    const knownCurrencies = portfolio.currencies

    const state = calculateState({
        currencyId,
        knownCurrencies,
        networkMap,
        portfolio,
    })

    switch (state.type) {
        case 'no_currency_selected':
            return (
                <Column2
                    spacing={12}
                    style={{ flex: '1 1 auto', overflowY: 'auto' }}
                >
                    <BankTransfer
                        onClick={() =>
                            onMsg({ type: 'on_bank_transfer_selected' })
                        }
                    />

                    <Send
                        onClick={() =>
                            onMsg({
                                type: 'on_send_clicked',
                                fromAddress: fromAccount.address,
                                currencyId: null,
                            })
                        }
                    />

                    <Receive
                        onClick={() => onMsg({ type: 'on_receive_selected' })}
                    />

                    <Swap
                        onClick={() =>
                            onMsg({
                                type: 'on_swap_clicked',
                                fromAddress: fromAccount.address,
                                currencyId: null,
                            })
                        }
                    />

                    <Bridge
                        onClick={() =>
                            onMsg({
                                type: 'on_bridge_clicked',
                                fromAddress: fromAccount.address,
                                currencyId: null,
                            })
                        }
                    />
                </Column2>
            )

        case 'currency_selected':
            return (
                <Column2
                    spacing={12}
                    style={{ flex: '1 1 auto', overflowY: 'auto' }}
                >
                    <Column2 spacing={0}>
                        <ActionBar
                            right={
                                <Row spacing={8}>
                                    {currencyPinMap[state.currency.id] ? (
                                        <span
                                            style={{
                                                cursor: 'pointer',
                                                boxSizing: 'border-box',
                                                display: 'flex',
                                            }}
                                            onClick={() => {
                                                onMsg({
                                                    type: 'on_token_un_pin_click',
                                                    currency: state.currency,
                                                })
                                            }}
                                        >
                                            <BoldStar
                                                color="iconStatusWarning"
                                                size={20}
                                            />
                                        </span>
                                    ) : (
                                        <IconButton
                                            onClick={() => {
                                                onMsg({
                                                    type: 'on_token_pin_click',
                                                    currency: state.currency,
                                                })
                                            }}
                                        >
                                            <BoldStar size={20} />
                                        </IconButton>
                                    )}
                                    {state.portfolioToken && (
                                        <HideUnHideButton
                                            token={state.portfolioToken}
                                            currencyHiddenMap={
                                                currencyHiddenMap
                                            }
                                            onMsg={onMsg}
                                        />
                                    )}
                                    <IconButton
                                        onClick={() => {
                                            onMsg({ type: 'close' })
                                        }}
                                    >
                                        <CloseCross size={20} />
                                    </IconButton>
                                </Row>
                            }
                        />
                        {state.portfolioToken && (
                            <Group
                                variant="default"
                                style={{ flexShrink: '0' }}
                            >
                                <ListItem
                                    currencyHiddenMap={currencyHiddenMap}
                                    currencyPinMap={currencyPinMap}
                                    networkMap={networkMap}
                                    aria-selected={false}
                                    token={state.portfolioToken}
                                    knownCurrencies={knownCurrencies}
                                />
                            </Group>
                        )}
                    </Column2>

                    <Send
                        onClick={() =>
                            onMsg({
                                type: 'on_send_clicked',
                                fromAddress: fromAccount.address,
                                currencyId: state.currency.id,
                            })
                        }
                    />

                    <Receive
                        onClick={() => onMsg({ type: 'on_receive_selected' })}
                    />

                    {(() => {
                        switch (state.network.type) {
                            case 'predefined':
                                return (
                                    <>
                                        <Swap
                                            onClick={() =>
                                                onMsg({
                                                    type: 'on_swap_clicked',
                                                    fromAddress:
                                                        fromAccount.address,
                                                    currencyId:
                                                        state.currency.id,
                                                })
                                            }
                                        />

                                        <Bridge
                                            onClick={() =>
                                                onMsg({
                                                    type: 'on_bridge_clicked',
                                                    fromAddress:
                                                        fromAccount.address,
                                                    currencyId:
                                                        state.currency.id,
                                                })
                                            }
                                        />
                                    </>
                                )

                            case 'custom':
                            case 'testnet':
                                return (
                                    <>
                                        {customCurrencyMap[
                                            state.currency.id
                                        ] && (
                                            <Group
                                                variant="default"
                                                style={{ flexShrink: '0' }}
                                            >
                                                <ListItem2
                                                    size="regular"
                                                    aria-selected={false}
                                                    onClick={() =>
                                                        onMsg({
                                                            type: 'on_token_settings_click',
                                                            currency:
                                                                state.currency,
                                                        })
                                                    }
                                                    avatar={({ size }) => (
                                                        <Setting
                                                            color="iconAccent2"
                                                            size={size}
                                                        />
                                                    )}
                                                    primaryText={
                                                        <FormattedMessage
                                                            id="rpc.send_token.send_or_receive.settings"
                                                            defaultMessage="Settings"
                                                        />
                                                    }
                                                    side={{
                                                        rightIcon: ({
                                                            size,
                                                        }) => (
                                                            <ForwardIcon
                                                                size={size}
                                                                color="iconDefault"
                                                            />
                                                        ),
                                                    }}
                                                />
                                            </Group>
                                        )}
                                    </>
                                )
                            /* istanbul ignore next */
                            default:
                                return notReachable(state.network)
                        }
                    })()}
                </Column2>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}

const BankTransfer = ({ onClick }: { onClick: () => void }) => (
    <Group variant="default" style={{ flexShrink: '0' }}>
        <ListItem2
            size="regular"
            aria-selected={false}
            onClick={onClick}
            avatar={({ size }) => (
                <BoldGeneralBank color="iconAccent2" size={size} />
            )}
            primaryText={
                <FormattedMessage
                    id="SendOrReceive.bankTransfer.primaryText"
                    defaultMessage="Bank Transfer"
                />
            }
            shortText={
                <FormattedMessage
                    id="SendOrReceive.bankTransfer.shortText"
                    defaultMessage="Free, instant on-ramp and off-ramp"
                />
            }
        />
    </Group>
)

const Send = ({ onClick }: { onClick: () => void }) => (
    <Group variant="default" style={{ flexShrink: '0' }}>
        <ListItem2
            size="regular"
            aria-selected={false}
            onClick={onClick}
            avatar={({ size }) => (
                <ArrowLeftSquared color="iconAccent2" size={size} />
            )}
            primaryText={
                <FormattedMessage
                    id="SendOrReceive.send.primaryText"
                    defaultMessage="Send"
                />
            }
            shortText={
                <FormattedMessage
                    id="SendOrReceive.send.shortText"
                    defaultMessage="Send tokens or NFTs to any address"
                />
            }
        />
    </Group>
)

const Receive = ({ onClick }: { onClick: () => void }) => (
    <Group variant="default" style={{ flexShrink: '0' }}>
        <ListItem2
            size="regular"
            aria-selected={false}
            onClick={onClick}
            avatar={({ size }) => (
                <ArrowRightSquared color="iconAccent2" size={size} />
            )}
            primaryText={
                <FormattedMessage
                    id="SendOrReceive.receive.primaryText"
                    defaultMessage="Receive"
                />
            }
            shortText={
                <FormattedMessage
                    id="SendOrReceive.receive.shortText"
                    defaultMessage="Receive tokens or NFTs"
                />
            }
        />
    </Group>
)

const Swap = ({ onClick }: { onClick: () => void }) => (
    <Group variant="default" style={{ flexShrink: '0' }}>
        <ListItem2
            size="regular"
            aria-selected={false}
            onClick={onClick}
            avatar={({ size }) => <BoldSwap color="iconAccent2" size={size} />}
            primaryText={
                <FormattedMessage
                    id="SendOrReceive.swap.primaryText"
                    defaultMessage="Swap"
                />
            }
            shortText={
                <FormattedMessage
                    id="SendOrReceive.swap.shortText"
                    defaultMessage="Swap between tokens"
                />
            }
        />
    </Group>
)

const Bridge = ({ onClick }: { onClick: () => void }) => (
    <Group variant="default" style={{ flexShrink: '0' }}>
        <ListItem2
            size="regular"
            aria-selected={false}
            onClick={onClick}
            avatar={({ size }) => (
                <BridgeIcon color="iconAccent2" size={size} />
            )}
            primaryText={
                <FormattedMessage
                    id="SendOrReceive.bridge.primaryText"
                    defaultMessage="Bridge"
                />
            }
            shortText={
                <FormattedMessage
                    id="SendOrReceive.bridge.shortText"
                    defaultMessage="Swap between networks or tokens"
                />
            }
        />
    </Group>
)
