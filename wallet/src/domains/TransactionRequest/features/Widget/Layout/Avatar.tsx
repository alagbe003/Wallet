import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'
import { notReachable } from '@zeal/toolkit'
import { Document } from 'src/uikit/Icon/Document'
import { Avatar as UIAvatar } from 'src/uikit/Avatar'
import { Badge } from '@zeal/domains/Network/components/Badge'
import React from 'react'
import { Network } from '@zeal/domains/Network'
import { BoldImageCollection } from 'src/uikit/Icon/BoldImageCollection'
import { Avatar as CurrencyAvatar } from 'src/domains/Currency/components/Avatar'
import { NftAvatar } from 'src/domains/NFTCollection/components/NftAvatar'

type Props = {
    simulatedTransaction: SimulationResult
    network: Network
}

export const Avatar = ({ simulatedTransaction, network }: Props) => {
    switch (simulatedTransaction.type) {
        case 'failed':
        case 'not_supported':
            return null
        case 'simulated': {
            const { transaction, currencies } = simulatedTransaction.simulation

            switch (transaction.type) {
                case 'BridgeTrx':
                case 'FailedTransaction':
                case 'WithdrawalTrx':
                    return null
                case 'ApprovalTransaction':
                case 'UnknownTransaction': // TODO: Multi-token dynamic icon
                    return (
                        <UIAvatar
                            size={32}
                            variant="squared"
                            icon={<Document size={32} color="iconDefault" />}
                            rightBadge={({ size }) => (
                                <Badge size={size} network={network} />
                            )}
                        />
                    )
                case 'SingleNftApprovalTransaction':
                    return (
                        <NftAvatar
                            size={32}
                            nft={transaction.nft}
                            badge={({ size }) => (
                                <Badge size={size} network={network} />
                            )}
                        />
                    )
                case 'NftCollectionApprovalTransaction':
                    return (
                        <UIAvatar
                            size={32}
                            variant="squared"
                            icon={
                                <BoldImageCollection
                                    size={32}
                                    color="iconDefault"
                                />
                            }
                            rightBadge={({ size }) => (
                                <Badge size={size} network={network} />
                            )}
                        />
                    )
                case 'P2PTransaction':
                    const currency =
                        currencies[transaction.token.amount.currencyId]
                    return (
                        <CurrencyAvatar
                            currency={currency}
                            size={32}
                            rightBadge={({ size }) => (
                                <Badge size={size} network={network} />
                            )}
                        />
                    )
                case 'P2PNftTransaction':
                    return (
                        <NftAvatar
                            size={32}
                            nft={transaction.nft.nft}
                            badge={({ size }) => (
                                <Badge size={size} network={network} />
                            )}
                        />
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(transaction)
            }
        }
        /* istanbul ignore next */
        default:
            return notReachable(simulatedTransaction)
    }
}
