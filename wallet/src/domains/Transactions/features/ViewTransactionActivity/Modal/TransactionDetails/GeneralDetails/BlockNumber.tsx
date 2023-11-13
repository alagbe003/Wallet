import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { RpcTransaction } from '@zeal/domains/Transactions'
import { FormattedMessage } from 'react-intl'
import { Skeleton } from 'src/uikit/Skeleton'
import { notReachable } from '@zeal/toolkit'
import { DetailItem } from './DetailItem'
import { joinURL } from '@zeal/toolkit/URL/joinURL'
import { Network } from '@zeal/domains/Network'

type Props = {
    loadable: LoadableData<RpcTransaction, unknown>
    network: Network
}

const getBlockExplorerLink = (blockNumber: bigint, network: Network) =>
    joinURL(network.blockExplorerUrl, '/block', blockNumber.toString())

export const BlockNumber = ({ loadable, network }: Props) => {
    switch (loadable.type) {
        case 'loading':
        case 'error':
            return (
                <DetailItem
                    label={
                        <FormattedMessage
                            id="activity.detail.general.block-number"
                            defaultMessage="Block"
                        />
                    }
                    value={
                        <Skeleton variant="default" width={40} height={16} />
                    }
                    explorerLink={null}
                />
            )
        case 'loaded':
            return (
                <DetailItem
                    label={
                        <FormattedMessage
                            id="activity.detail.general.block-number"
                            defaultMessage="Block"
                        />
                    }
                    value={loadable.data.blockNumber.toString()}
                    explorerLink={getBlockExplorerLink(
                        loadable.data.blockNumber,
                        network
                    )}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
