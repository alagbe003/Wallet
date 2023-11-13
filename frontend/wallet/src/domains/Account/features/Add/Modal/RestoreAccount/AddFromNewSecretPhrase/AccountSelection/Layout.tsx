import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { generateAccountsLabels } from '@zeal/domains/Account/helpers/generateAccountsLabel'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { noop, notReachable } from '@zeal/toolkit'
import { ReloadableData } from '@zeal/toolkit/LoadableData/ReloadableData'
import { Button, IconButton } from 'src/uikit'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { ListItemSkeleton } from 'src/uikit/ListItem2/ListItemSkeleton'
import { Item } from './Item'
import { Screen } from '@zeal/uikit/Screen'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { Group, GroupHeader, Section } from '@zeal/uikit/Group'
import { Spacer2 } from 'src/uikit/Spacer2'
import { FlatList } from 'react-native'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { AppErrorPopup } from 'src/domains/Error/components/AppErrorPopup'
import { MsgOf } from '@zeal/toolkit/MsgOf'

type Props = {
    reloadable: ReloadableData<
        { address: Address; path: string }[],
        unknown,
        unknown
    >
    selected: Address[]
    accounts: Account[]
    keystoreMap: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    customCurrencies: CustomCurrencyMap
    encryptedPhrase: string
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'header_info_icon_click' }
    | { type: 'on_item_click'; address: Address }
    | {
          type: 'on_scroll_marker_reached'
          currentData: { address: Address; path: string }[]
      }
    | {
          type: 'on_account_create_request'
          accountsWithKeystores: {
              account: Account
              keystore: SecretPhrase
          }[]
      }
    | MsgOf<typeof AppErrorPopup>

export const Layout = ({
    accounts,
    encryptedPhrase,
    customCurrencies,
    keystoreMap,
    reloadable,
    selected,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    return (
        <Screen background="light" padding="form">
            <ActionBar
                left={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <BackIcon size={24} />
                    </IconButton>
                }
            />

            <Column spacing={24}>
                <Header
                    title={
                        <FormattedMessage
                            id="AddFromNewSecretPhrase.WalletSelection.title"
                            defaultMessage="Import wallets"
                        />
                    }
                    onInfoIconClick={() =>
                        onMsg({ type: 'header_info_icon_click' })
                    }
                    subtitle={
                        <FormattedMessage
                            id="AddFromNewSecretPhrase.WalletSelection.title"
                            defaultMessage="Select the wallets you want to import"
                        />
                    }
                />

                <Section>
                    <GroupHeader
                        left={
                            <FormattedMessage
                                id="AddFromNewSecretPhrase.wallets"
                                defaultMessage="Wallets"
                            />
                        }
                        right={null}
                    />
                    <Group variant="default">
                        {(() => {
                            switch (reloadable.type) {
                                case 'loading':
                                    return <ListItemSkeleton avatar shortText />
                                case 'loaded':
                                    return (
                                        <FlatList
                                            data={reloadable.data}
                                            renderItem={({ item, index }) => (
                                                <Item
                                                    currencyHiddenMap={
                                                        currencyHiddenMap
                                                    }
                                                    networkMap={networkMap}
                                                    networkRPCMap={
                                                        networkRPCMap
                                                    }
                                                    customCurrencies={
                                                        customCurrencies
                                                    }
                                                    accounts={accounts}
                                                    address={item.address}
                                                    index={index}
                                                    isSelected={
                                                        !!selected.find(
                                                            (sel) =>
                                                                sel ===
                                                                item.address
                                                        )
                                                    }
                                                    keystoreMap={keystoreMap}
                                                    key={item.address}
                                                    onClick={() =>
                                                        onMsg({
                                                            type: 'on_item_click',
                                                            address:
                                                                item.address,
                                                        })
                                                    }
                                                />
                                            )}
                                            onEndReached={() =>
                                                onMsg({
                                                    type: 'on_scroll_marker_reached',
                                                    currentData:
                                                        reloadable.data,
                                                })
                                            }
                                        />
                                    )
                                case 'reloading':
                                    return (
                                        <FlatList
                                            data={reloadable.data}
                                            renderItem={({ item, index }) => (
                                                <Item
                                                    currencyHiddenMap={
                                                        currencyHiddenMap
                                                    }
                                                    networkMap={networkMap}
                                                    networkRPCMap={
                                                        networkRPCMap
                                                    }
                                                    customCurrencies={
                                                        customCurrencies
                                                    }
                                                    accounts={accounts}
                                                    address={item.address}
                                                    index={index}
                                                    isSelected={
                                                        !!selected.find(
                                                            (sel) =>
                                                                sel ===
                                                                item.address
                                                        )
                                                    }
                                                    keystoreMap={keystoreMap}
                                                    key={item.address}
                                                    onClick={() =>
                                                        onMsg({
                                                            type: 'on_item_click',
                                                            address:
                                                                item.address,
                                                        })
                                                    }
                                                />
                                            )}
                                            ListFooterComponent={
                                                <ListItemSkeleton
                                                    avatar
                                                    shortText
                                                />
                                            }
                                        />
                                    )
                                case 'subsequent_failed':
                                    return (
                                        <>
                                            <FlatList
                                                data={reloadable.data}
                                                renderItem={({
                                                    item,
                                                    index,
                                                }) => (
                                                    <Item
                                                        currencyHiddenMap={
                                                            currencyHiddenMap
                                                        }
                                                        networkMap={networkMap}
                                                        networkRPCMap={
                                                            networkRPCMap
                                                        }
                                                        customCurrencies={
                                                            customCurrencies
                                                        }
                                                        accounts={accounts}
                                                        address={item.address}
                                                        index={index}
                                                        isSelected={
                                                            !!selected.find(
                                                                (sel) =>
                                                                    sel ===
                                                                    item.address
                                                            )
                                                        }
                                                        keystoreMap={
                                                            keystoreMap
                                                        }
                                                        key={item.address}
                                                        onClick={() =>
                                                            onMsg({
                                                                type: 'on_item_click',
                                                                address:
                                                                    item.address,
                                                            })
                                                        }
                                                    />
                                                )}
                                                ListFooterComponent={
                                                    <ListItemSkeleton
                                                        avatar
                                                        shortText
                                                    />
                                                }
                                            />
                                            <AppErrorPopup
                                                error={parseAppError(
                                                    reloadable.error
                                                )}
                                                onMsg={onMsg}
                                            />
                                        </>
                                    )
                                case 'error':
                                    return (
                                        <AppErrorPopup
                                            error={parseAppError(
                                                reloadable.error
                                            )}
                                            onMsg={onMsg}
                                        />
                                    )

                                default:
                                    return notReachable(reloadable)
                            }
                        })()}
                    </Group>
                </Section>

                <Spacer2 />

                {(() => {
                    switch (reloadable.type) {
                        case 'loaded':
                        case 'reloading':
                        case 'subsequent_failed':
                            return (
                                <Button
                                    size="regular"
                                    variant="primary"
                                    disabled={!selected.length}
                                    onClick={() => {
                                        const selectedSet = new Set<Address>(
                                            selected
                                        )

                                        const labels = generateAccountsLabels(
                                            accounts,
                                            'Wallet',
                                            selected.length
                                        )

                                        onMsg({
                                            type: 'on_account_create_request',
                                            accountsWithKeystores:
                                                reloadable.data
                                                    .filter((item) =>
                                                        selectedSet.has(
                                                            item.address
                                                        )
                                                    )
                                                    .map((item, index) => {
                                                        const acc =
                                                            accounts.find(
                                                                (a) =>
                                                                    a.address ===
                                                                    item.address
                                                            )
                                                        return {
                                                            account: {
                                                                address:
                                                                    item.address,
                                                                label:
                                                                    acc?.label ||
                                                                    labels[
                                                                        index
                                                                    ],
                                                                avatarSrc:
                                                                    acc?.avatarSrc ||
                                                                    null,
                                                            },
                                                            keystore: {
                                                                type: 'secret_phrase_key',
                                                                bip44Path:
                                                                    item.path,
                                                                encryptedPhrase,
                                                                confirmed: true,
                                                                googleDriveFile:
                                                                    null,
                                                            },
                                                        }
                                                    }),
                                        })
                                    }}
                                >
                                    <FormattedMessage
                                        id="AddFromSecretPhrase.importWallets"
                                        defaultMessage={`{count, plural,
                                            =0 {No wallets selected}
                                            one {Import wallet}
                                            other {Import {count} wallets}}`}
                                        values={{
                                            count: selected.length,
                                        }}
                                    />
                                </Button>
                            )

                        case 'loading':
                        case 'error':
                            return (
                                <Button
                                    size="regular"
                                    variant="primary"
                                    disabled
                                    onClick={noop}
                                >
                                    <FormattedMessage
                                        id="AddFromSecretPhrase.importWallets"
                                        defaultMessage={`{count, plural,
                                            =0 {No wallets selected}
                                            one {Import wallet}
                                            other {Import {count} wallets}}`}
                                        values={{
                                            count: selected.length,
                                        }}
                                    />
                                </Button>
                            )

                        default:
                            return notReachable(reloadable)
                    }
                })()}
            </Column>
        </Screen>
    )
}
