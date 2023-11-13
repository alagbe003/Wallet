import { CurrentNetwork, NetworkMap } from '@zeal/domains/Network'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { useReloadableData } from '@zeal/toolkit/LoadableData/ReloadableData'
import { fetchTransactionActivity } from '@zeal/domains/Transactions/api/fetchTransactionActivity'
import React, { ReactElement, useEffect, useState } from 'react'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { notReachable } from '@zeal/toolkit'
import { Skeleton } from 'src/uikit/Skeleton'
import { EmptyStateWidget } from 'src/uikit/EmptyStateWidget'
import { Tokens } from 'src/uikit/Icon/Empty'
import {
    FormatDateOptions,
    FormattedMessage,
    MessageDescriptor,
    useIntl,
} from 'react-intl'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { ActivityTransaction } from '@zeal/domains/Transactions'
import { ListItem } from 'src/domains/Transactions/components/ListItem'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { Group, GroupHeader, Section } from '@zeal/uikit/Group'
import { Column } from '@zeal/uikit/Column'
import { SectionList } from '@zeal/uikit/SectionList'

type Props = {
    networkMap: NetworkMap
    selectedNetwork: CurrentNetwork
    account: Account
    accountsMap: AccountsMap
    scam: boolean
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof ListItem>

const getGroupLabel = (
    transactionDate: Date,
    formatMessage: (x: MessageDescriptor) => string,
    formatDate: (x: Date, y: FormatDateOptions) => string
): string => {
    const todayMidnight = new Date()
    todayMidnight.setHours(0, 0, 0, 0)

    const startOfWeek = new Date(todayMidnight)
    startOfWeek.setDate(todayMidnight.getDate() - todayMidnight.getDay() + 1)

    const startOfMonth = new Date(
        todayMidnight.getFullYear(),
        todayMidnight.getMonth(),
        1
    )

    const todayLabel = formatMessage({
        id: 'activity.labels.today',
        defaultMessage: 'Today',
    })
    const thisWeekLabel = formatMessage({
        id: 'activity.labels.this-week',
        defaultMessage: 'This week',
    })
    const thisMonthLabel = formatMessage({
        id: 'activity.labels.this-month',
        defaultMessage: 'This month',
    })

    return transactionDate.getTime() >= todayMidnight.getTime()
        ? todayLabel
        : transactionDate.getTime() >= startOfWeek.getTime()
        ? thisWeekLabel
        : transactionDate.getTime() >= startOfMonth.getTime()
        ? thisMonthLabel
        : formatDate(transactionDate, {
              month: 'short',
              year: 'numeric',
              day: '2-digit',
          })
}

const group = (
    transactions: ActivityTransaction[],
    formatMessage: (x: MessageDescriptor) => string,
    formatDate: (x: Date, y: FormatDateOptions) => string
): Map<string, ActivityTransaction[]> => {
    return transactions.reduce((memo, currentValue) => {
        const key = getGroupLabel(
            currentValue.timestamp,
            formatMessage,
            formatDate
        )
        const values = memo.get(key) || []
        values.push(currentValue)
        memo.set(key, values)
        return memo
    }, new Map<string, ActivityTransaction[]>())
}

export const TransactionList = ({
    selectedNetwork,
    account,
    onMsg,
    scam,
    networkMap,
    accountsMap,
}: Props) => {
    const [transactionLoadable, setTransactionLoadable] = useReloadableData(
        fetchTransactionActivity,
        {
            type: 'loading',
            params: {
                address: account.address,
                timestampLessThan: Date.now(),
                selectedNetwork,
                scam,
            },
        },
        {
            accumulate: (newData, prevData) => {
                return {
                    continueFromTimestamp: newData.continueFromTimestamp,
                    transactions: [
                        ...prevData.transactions,
                        ...newData.transactions,
                    ],
                    currencies: {
                        ...prevData.currencies,
                        ...newData.currencies,
                    },
                }
            },
        }
    )

    useEffect(() => {
        if (
            transactionLoadable.params.address !== account.address ||
            transactionLoadable.params.selectedNetwork !== selectedNetwork
        ) {
            setTransactionLoadable({
                type: 'loading',
                params: {
                    address: account.address,
                    timestampLessThan: Date.now(),
                    selectedNetwork,
                    scam,
                },
            })
        }
    }, [
        account.address,
        scam,
        selectedNetwork,
        setTransactionLoadable,
        transactionLoadable.params.address,
        transactionLoadable.params.selectedNetwork,
    ])

    useEffect(() => {
        switch (transactionLoadable.type) {
            case 'loaded':
            case 'reloading':
            case 'loading':
                break

            case 'subsequent_failed':
            case 'error':
                captureError(transactionLoadable.error)
                break

            /* istanbul ignore next */
            default:
                return notReachable(transactionLoadable)
        }
    }, [transactionLoadable])

    switch (transactionLoadable.type) {
        case 'loading':
            return (
                <Column spacing={16}>
                    {new Array(3).fill(1).map((_, index) => (
                        <Section key={`s-${index}`}>
                            <Skeleton
                                variant="default"
                                width={75}
                                height={18}
                            />

                            <Group variant="default">
                                <Column spacing={24}>
                                    {new Array(3).fill(1).map((_, index) => (
                                        <Skeleton
                                            key={`sk-${index}`}
                                            variant="default"
                                            width="100%"
                                            height={12}
                                        />
                                    ))}
                                </Column>
                            </Group>
                        </Section>
                    ))}
                </Column>
            )
        case 'loaded':
            return (
                <GroupedTransactions
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_activity_transaction_click':
                                onMsg(msg)
                                break
                            case 'on_end_reached':
                                if (
                                    transactionLoadable.data
                                        .continueFromTimestamp
                                ) {
                                    setTransactionLoadable({
                                        type: 'reloading',
                                        data: transactionLoadable.data,
                                        params: {
                                            address: account.address,
                                            selectedNetwork,
                                            timestampLessThan:
                                                transactionLoadable.data
                                                    .continueFromTimestamp,
                                            scam,
                                        },
                                    })
                                }
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                    networkMap={networkMap}
                    account={account}
                    accountsMap={accountsMap}
                    transactions={transactionLoadable.data.transactions}
                    knownCurrencies={transactionLoadable.data.currencies}
                    footer={null}
                />
            )
        case 'subsequent_failed':
        case 'reloading':
            return (
                <GroupedTransactions
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_activity_transaction_click':
                                onMsg(msg)
                                break
                            case 'on_end_reached': // we are already reloading
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                    networkMap={networkMap}
                    account={account}
                    accountsMap={accountsMap}
                    transactions={transactionLoadable.data.transactions}
                    knownCurrencies={transactionLoadable.data.currencies}
                    footer={
                        <Skeleton variant="default" width={75} height={18} />
                    }
                />
            )

        case 'error': {
            return (
                <EmptyStateWidget
                    size="regular"
                    icon={({ size }) => (
                        <Tokens size={size} color="backgroundLight" />
                    )}
                    title={
                        <FormattedMessage
                            id="transactions.viewTRXHistory.errorMessage"
                            defaultMessage="We failed to load your transactions history"
                        />
                    }
                />
            )
        }
        /* istanbul ignore next */
        default:
            return notReachable(transactionLoadable)
    }
}

type GroupedTransactionsProps = {
    transactions: ActivityTransaction[]
    knownCurrencies: KnownCurrencies
    accountsMap: AccountsMap
    account: Account
    networkMap: NetworkMap
    footer: ReactElement | null
    onMsg: (msg: GroupedTransactionMsg) => void
}

type GroupedTransactionMsg =
    | MsgOf<typeof ListItem>
    | { type: 'on_end_reached'; distanceFromEnd: number }

const GroupedTransactions = ({
    transactions,
    account,
    accountsMap,
    onMsg,
    footer,
    knownCurrencies,
    networkMap,
}: GroupedTransactionsProps) => {
    const [sectionId] = useState(crypto.randomUUID())
    const { formatMessage, formatDate } = useIntl()
    const grouped = group(transactions, formatMessage, formatDate)

    const sections = Array.from(grouped.entries()).map(
        ([groupKey, transactionsList], idx) => ({
            title: groupKey,
            key: `s-${idx}-${sectionId}`,
            data: transactionsList,
        })
    )

    return (
        <SectionList
            variant="default"
            sections={sections}
            itemSpacing={12}
            sectionSpacing={12}
            renderSectionHeader={({ section: { title, key } }) => (
                <GroupHeader right={null} left={title} leftId={key} />
            )}
            emptyState={
                <EmptyStateWidget
                    size="regular"
                    icon={({ size }) => (
                        <Tokens size={size} color="backgroundLight" />
                    )}
                    title={
                        <FormattedMessage
                            id="transactions.viewTRXHistory.emptyState"
                            defaultMessage="We found no transactions"
                        />
                    }
                />
            }
            footer={footer}
            onEndReached={({ distanceFromEnd }) =>
                onMsg({ type: 'on_end_reached', distanceFromEnd })
            }
            renderItem={({ item: trx }) => (
                <ListItem
                    onMsg={onMsg}
                    networkMap={networkMap}
                    key={trx.hash}
                    transaction={trx}
                    knownCurrencies={knownCurrencies}
                    accountsMap={accountsMap}
                    account={account}
                />
            )}
        />
    )
}
