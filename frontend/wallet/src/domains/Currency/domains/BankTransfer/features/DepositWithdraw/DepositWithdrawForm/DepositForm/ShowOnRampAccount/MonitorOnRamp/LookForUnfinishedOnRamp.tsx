import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { Avatar } from 'src/domains/Currency/components/Avatar'
import {
    OnRampTransactionEvent,
    UnblockLoginSignature,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { NetworkMap } from '@zeal/domains/Network'
import { Badge } from 'src/domains/Network/components/Badge'
import { notReachable, useLiveRef } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { IconButton } from 'src/uikit'
import { Column2 } from 'src/uikit/Column2'
import { Section } from 'src/uikit/Group'
import { GroupHeader } from '@zeal/uikit/Group'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { Content } from 'src/uikit/Layout/Content'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Progress2 } from 'src/uikit/Progress/Progress2'
import { Spinner } from 'src/uikit/Spinner'
import { fetchLastUnfinishedOnRamp } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchLastUnfinishedOnRamp'

type Props = {
    account: Account
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap

    form: OnRampFeeParams
    unblockLoginSignature: UnblockLoginSignature
    bankTransferCurrencies: BankTransferCurrencies
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_onramp_found'; event: OnRampTransactionEvent }

export const LookForUnfinishedOnRamp = ({
    onMsg,
    account,
    networkMap,
    form,
    bankTransferCurrencies,
    unblockLoginSignature,
    keyStoreMap,
}: Props) => {
    const liveMsg = useLiveRef(onMsg)
    const [pollable] = usePollableData(
        fetchLastUnfinishedOnRamp,
        {
            type: 'loading',
            params: {
                bankTransferCurrencies,
                unblockLoginSignature,
            },
        },
        {
            stopIf: () => false,
            pollIntervalMilliseconds: 5000,
        }
    )

    useEffect(() => {
        switch (pollable.type) {
            case 'loaded':
            case 'reloading':
            case 'subsequent_failed':
                if (pollable.data) {
                    liveMsg.current({
                        type: 'on_onramp_found',
                        event: pollable.data,
                    })
                }
                break

            case 'loading':
            case 'error':
                // We do nothing if there is no data yet
                break

            default:
                notReachable(pollable)
        }
    }, [pollable, liveMsg])

    return (
        <Layout2 padding="form" background="light">
            <ActionBar
                network={null}
                account={account}
                keystore={getKeyStore({
                    keyStoreMap,
                    address: account.address,
                })}
                right={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <CloseCross size={24} />
                    </IconButton>
                }
            />

            <Content
                header={
                    <Content.Header
                        title={
                            <FormattedMessage
                                id="currency.bankTransfer.deposit_status.title"
                                defaultMessage="Deposit"
                            />
                        }
                    />
                }
                footer={
                    <Progress2
                        initialProgress={0}
                        progress={0.1}
                        title={
                            // FIXME @resetko-zeal maybe we need as bit better wording for that
                            <FormattedMessage
                                id="MonitorOnRamp.waitingForTransfer"
                                defaultMessage="Waiting for you to transfer funds"
                            />
                        }
                        variant="neutral"
                    />
                }
            >
                <Column2 spacing={16}>
                    <Section>
                        <GroupHeader
                            left={
                                <FormattedMessage
                                    id="MonitorOnRamp.from"
                                    defaultMessage="From"
                                />
                            }
                            right={null}
                        />
                        <ListItem2
                            aria-selected={false}
                            size="large"
                            primaryText={form.inputCurrency.code}
                            avatar={({ size }) => (
                                <Avatar
                                    rightBadge={() => null}
                                    size={size}
                                    currency={form.inputCurrency}
                                />
                            )}
                            side={{
                                rightIcon: ({ size }) => (
                                    <Spinner
                                        size={size}
                                        color="iconStatusNeutral"
                                    />
                                ),
                            }}
                        />
                    </Section>

                    <Section>
                        <GroupHeader
                            left={
                                <FormattedMessage
                                    id="MonitorOnRamp.to"
                                    defaultMessage="To"
                                />
                            }
                            right={null}
                        />
                        <ListItem2
                            aria-selected={false}
                            size="large"
                            primaryText={form.outputCurrency.code}
                            avatar={({ size }) => (
                                <Avatar
                                    rightBadge={({ size }) => (
                                        <Badge
                                            network={
                                                networkMap[
                                                    form.outputCurrency
                                                        .networkHexChainId
                                                ]
                                            }
                                            size={size}
                                        />
                                    )}
                                    size={size}
                                    currency={form.outputCurrency}
                                />
                            )}
                        />
                    </Section>
                </Column2>
            </Content>
        </Layout2>
    )
}
