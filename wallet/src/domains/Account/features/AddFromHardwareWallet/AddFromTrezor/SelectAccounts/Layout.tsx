import { hdkey } from 'ethereumjs-wallet'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { generateAccountsLabels } from '@zeal/domains/Account/helpers/generateAccountsLabel'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { AppErrorPopup } from 'src/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap, Trezor } from '@zeal/domains/KeyStore'
import { TREZOR_EXTENDED_PUBLIC_KEY_PATH } from '@zeal/domains/KeyStore/constants'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { noop, notReachable } from '@zeal/toolkit'
import { useReloadableData } from '@zeal/toolkit/LoadableData/ReloadableData'
import { Button } from '@zeal/uikit/Button'
import { IconButton } from '@zeal/uikit/IconButton'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Group, GroupHeader, Section } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { ListItemSkeleton } from '@zeal/uikit/ListItem'
import { Item } from './Item'
import { Screen } from '@zeal/uikit/Screen'
import { Column } from '@zeal/uikit/Column'
import { FlatList } from 'react-native'
import { Spacer } from '@zeal/uikit/Spacer'

type Props = {
    extendedPublicKey: string
    accounts: Account[]
    keystoreMap: KeyStoreMap
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'header_info_icon_click' }
    | {
          type: 'on_account_create_request'
          accountsWithKeystores: {
              account: Account
              keystore: Trezor
          }[]
      }

const ADDRESS_FETCH_COUNT = 10

const fetch = async ({
    offset,
    extendedPublicKey,
}: {
    offset: number
    extendedPublicKey: string
}): Promise<{ address: Address; path: string }[]> =>
    new Array(ADDRESS_FETCH_COUNT).fill(true).map((_, index) => ({
        path: `${TREZOR_EXTENDED_PUBLIC_KEY_PATH}/${offset + index}`,
        address: hdkey
            .fromExtendedKey(extendedPublicKey)
            .deriveChild(offset + index)
            .getWallet()
            .getChecksumAddressString(),
    }))

const toggleSelected = (selected: Address[], address: Address): Address[] =>
    selected.find((item) => item === address)
        ? selected.filter((item) => item !== address)
        : [...selected, address]

export const Layout = ({
    accounts,
    extendedPublicKey,
    customCurrencies,
    keystoreMap,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const [selected, setSelected] = useState<Address[]>([])
    const [reloadable, setReloadable] = useReloadableData<
        { address: Address; path: string }[],
        { offset: number; extendedPublicKey: string }
    >(
        fetch,
        {
            type: 'loading',
            params: { offset: 0, extendedPublicKey },
        },
        {
            accumulate: (newData, prevData) => {
                return [...prevData, ...newData]
            },
        }
    )

    useEffect(() => {
        switch (reloadable.type) {
            case 'loading':
                setSelected([])
                break
            case 'loaded':
            case 'reloading':
            case 'subsequent_failed':
            case 'error':
                break
            /* istanbul ignore next */
            default:
                return notReachable(reloadable)
        }
    }, [reloadable])

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
                            id="AddFromTrezor.AccountSelection.title"
                            defaultMessage="Import Trezor accounts"
                        />
                    }
                    onInfoIconClick={() =>
                        onMsg({ type: 'header_info_icon_click' })
                    }
                />

                <Section>
                    <GroupHeader
                        left={
                            <FormattedMessage
                                id="AddFromNewSecretPhrase.accounts"
                                defaultMessage="Accounts"
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
                                                        setSelected(
                                                            toggleSelected(
                                                                selected,
                                                                item.address
                                                            )
                                                        )
                                                    }
                                                />
                                            )}
                                            onEndReached={() =>
                                                setReloadable({
                                                    type: 'reloading',
                                                    data: reloadable.data,
                                                    params: {
                                                        offset:
                                                            reloadable.params
                                                                .offset +
                                                            ADDRESS_FETCH_COUNT,
                                                        extendedPublicKey:
                                                            reloadable.params
                                                                .extendedPublicKey,
                                                    },
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
                                                        setSelected(
                                                            toggleSelected(
                                                                selected,
                                                                item.address
                                                            )
                                                        )
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
                                                            setSelected(
                                                                toggleSelected(
                                                                    selected,
                                                                    item.address
                                                                )
                                                            )
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
                                                onMsg={(msg) => {
                                                    switch (msg.type) {
                                                        case 'close':
                                                            onMsg(msg)
                                                            break
                                                        case 'try_again_clicked':
                                                            setReloadable({
                                                                type: 'reloading',
                                                                params: reloadable.params,
                                                                data: reloadable.data,
                                                            })
                                                            break
                                                        /* istanbul ignore next */
                                                        default:
                                                            return notReachable(
                                                                msg
                                                            )
                                                    }
                                                }}
                                            />
                                        </>
                                    )
                                case 'error':
                                    return (
                                        <AppErrorPopup
                                            error={parseAppError(
                                                reloadable.error
                                            )}
                                            onMsg={(msg) => {
                                                switch (msg.type) {
                                                    case 'close':
                                                        onMsg(msg)
                                                        break
                                                    case 'try_again_clicked':
                                                        setReloadable({
                                                            type: 'loading',
                                                            params: reloadable.params,
                                                        })
                                                        break
                                                    /* istanbul ignore next */
                                                    default:
                                                        return notReachable(msg)
                                                }
                                            }}
                                        />
                                    )
                                default:
                                    return notReachable(reloadable)
                            }
                        })()}
                    </Group>
                </Section>

                <Spacer />

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
                                            'Trezor',
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
                                                                type: 'trezor',
                                                                address:
                                                                    item.address,
                                                                path: item.path,
                                                            },
                                                        }
                                                    }),
                                        })
                                    }}
                                >
                                    <FormattedMessage
                                        id="AddFromTrezor.importAccounts"
                                        defaultMessage={`{count, plural,
                                    =0 {No accounts selected}
                                    one {Import account}
                                    other {Import {count} accounts}}`}
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
                                        id="AddFromTrezor.importAccounts"
                                        defaultMessage={`{count, plural,
                                    =0 {No accounts selected}
                                    one {Import account}
                                    other {Import {count} accounts}}`}
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
