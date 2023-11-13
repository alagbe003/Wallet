import { FormattedMessage } from 'react-intl'
import { KnownCurrencies } from '@zeal/domains/Currency'

import { useMemo } from 'react'
import { notReachable } from '@zeal/toolkit'
import {
    UnknownTransaction,
    UnknownTransactionToken,
} from '@zeal/domains/Transactions/domains/SimulatedTransaction'

import { Token } from './Token'
import { Nft } from './Nft'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { Group, Section } from 'src/uikit/Group'
import { GroupHeader } from '@zeal/uikit/Group'
import { Column2 } from 'src/uikit/Column2'
import { NetworkMap } from '@zeal/domains/Network'
import { TransactionNft } from '@zeal/domains/Transactions'

type Props = {
    transaction: UnknownTransaction
    knownCurrencies: KnownCurrencies
    checks: TransactionSafetyCheck[]
    networkMap: NetworkMap
}

type GroupedTokens = {
    send: UnknownTransactionToken[]
    receive: UnknownTransactionToken[]
}

type GroupedNfts = {
    sendNft: TransactionNft[]
    receiveNft: TransactionNft[]
}

export const Unknown = ({
    transaction,
    knownCurrencies,
    checks,
    networkMap,
}: Props) => {
    const { send, receive } = useMemo(() => {
        return transaction.tokens.reduce<GroupedTokens>(
            (group, item) => {
                switch (item.direction) {
                    case 'Receive':
                        group.receive.push(item)
                        return group

                    case 'Send':
                        group.send.push(item)
                        return group

                    /* istanbul ignore next */
                    default:
                        return notReachable(item.direction)
                }
            },
            { send: [], receive: [] }
        )
    }, [transaction.tokens])

    const { sendNft, receiveNft } = useMemo(() => {
        return transaction.nfts.reduce<GroupedNfts>(
            (group, item) => {
                switch (item.direction) {
                    case 'Receive':
                        group.receiveNft.push(item)
                        return group

                    case 'Send':
                        group.sendNft.push(item)
                        return group

                    /* istanbul ignore next */
                    default:
                        return notReachable(item.direction)
                }
            },
            { sendNft: [], receiveNft: [] }
        )
    }, [transaction.nfts])

    return (
        <Column2 spacing={20}>
            {(send.length > 0 || sendNft.length > 0) && (
                <Section aria-labelledby="send-section-label">
                    <GroupHeader
                        leftId="send-section-label"
                        left={
                            <FormattedMessage
                                id="simulatedTransaction.unknown.info.send"
                                defaultMessage="Send"
                            />
                        }
                        right={null}
                    />
                    <Group variant="compressed">
                        {send.map((item) => (
                            <Token
                                networkMap={networkMap}
                                safetyChecks={checks}
                                key={item.amount.currencyId}
                                knownCurrencies={knownCurrencies}
                                token={item}
                            />
                        ))}

                        {sendNft.map((item) => (
                            <Nft
                                networkMap={networkMap}
                                checks={checks}
                                key={item.nft.tokenId}
                                transactionNft={item}
                            />
                        ))}
                    </Group>
                </Section>
            )}
            {(receive.length > 0 || receiveNft.length > 0) && (
                <Section aria-labelledby="receive-section-label">
                    <GroupHeader
                        leftId="receive-section-label"
                        left={
                            <FormattedMessage
                                id="simulatedTransaction.unknown.info.receive"
                                defaultMessage="Receive"
                            />
                        }
                        right={null}
                    />
                    <Group variant="compressed">
                        {receive.map((item) => (
                            <Token
                                networkMap={networkMap}
                                safetyChecks={checks}
                                key={item.amount.currencyId}
                                knownCurrencies={knownCurrencies}
                                token={item}
                            />
                        ))}

                        {receiveNft.map((item) => (
                            <Nft
                                networkMap={networkMap}
                                checks={checks}
                                key={item.nft.tokenId}
                                transactionNft={item}
                            />
                        ))}
                    </Group>
                </Section>
            )}
        </Column2>
    )
}
