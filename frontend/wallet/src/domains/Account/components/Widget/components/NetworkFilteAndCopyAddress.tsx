import { Account } from '@zeal/domains/Account'
import { CopyAddress } from 'src/domains/Address/components/CopyAddress'
import { CurrentNetwork } from '@zeal/domains/Network'
import { Name } from 'src/domains/Network/components/Name'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { Filter } from 'src/uikit/Icon/Filter'
import { ArrowDown } from 'src/uikit/Icon/Navigation/ArrowDown'
import { Row } from '@zeal/uikit/Row'

type Props = {
    currentAccount: Account
    currentNetwork: CurrentNetwork
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'network_filter_click' }

export const CopyAddressNetworkFilterRaw = ({
    onMsg,
    currentNetwork,
    currentAccount,
}: Props) => {
    return (
        <Row spacing={0} alignX="stretch">
            <CopyAddress
                size="small"
                color="on_dark"
                address={currentAccount.address}
            />
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
        </Row>
    )
}
