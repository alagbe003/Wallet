import { Account } from '@zeal/domains/Account'
import { CurrentNetwork } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { FormattedMessage } from 'react-intl'
import { KeyStore } from '@zeal/domains/KeyStore'
import { notReachable } from '@zeal/toolkit'
import { TagButton } from '@zeal/uikit/TagButton'
import { Column } from '@zeal/uikit/Column'
import { BoldEye } from '@zeal/uikit/Icon/BoldEye'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { Text } from '@zeal/uikit/Text'
import { ShowBalance } from './ShowBalance'
import { AccountPicker } from './components/AccountPicker'
import { Container } from './components/Container'
import { CopyAddressNetworkFilterRaw } from './components/NetworkFilteAndCopyAddress'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'

type Props = {
    portfolio: Portfolio
    currentAccount: Account
    currentNetwork: CurrentNetwork
    keystore: KeyStore
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'account_filter_click' }
    | { type: 'network_filter_click' }
    | { type: 'on_tracked_tag_click' }

export {
    SmallWidget,
    SmallWidgetError,
    SmallWidgetSkeleton,
} from './SmallWidget'

export const Widget = ({
    portfolio,
    currentAccount,
    currentNetwork,
    keystore,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    return (
        <Container>
            <Row spacing={8} alignX="stretch">
                <AccountPicker
                    keystore={keystore}
                    currentAccount={currentAccount}
                    onMsg={onMsg}
                />
                <KeystoreTag
                    keystore={keystore}
                    onClick={() => onMsg({ type: 'on_tracked_tag_click' })}
                />
            </Row>
            <Column spacing={8}>
                <Text variant="title1" weight="bold" color="textOnDark">
                    <ShowBalance
                        currencyHiddenMap={currencyHiddenMap}
                        portfolio={portfolio}
                        currentNetwork={currentNetwork}
                    />
                </Text>
                <CopyAddressNetworkFilterRaw
                    currentNetwork={currentNetwork}
                    currentAccount={currentAccount}
                    onMsg={onMsg}
                />
            </Column>
        </Container>
    )
}

const KeystoreTag = ({
    keystore,
    onClick,
}: {
    keystore: KeyStore
    onClick: () => void
}) => {
    switch (keystore.type) {
        case 'safe_v0':
            // FIXME @resetko-zeal - Safe implementation
            return <>kstag:safe</>
        case 'track_only':
            return (
                <TagButton
                    onClick={onClick}
                    variant="bright"
                    leftIcon={({ size }) => <BoldEye size={size} />}
                >
                    <FormattedMessage
                        id="account.widget"
                        defaultMessage="Tracked"
                    />
                </TagButton>
            )

        case 'private_key_store':
        case 'ledger':
        case 'secret_phrase_key':
        case 'trezor':
            return null

        /* istanbul ignore next */
        default:
            return notReachable(keystore)
    }
}

export const WidgetSkeleton = ({
    currentAccount,
    currentNetwork,
    keystore,
    onMsg,
}: {
    currentAccount: Account
    currentNetwork: CurrentNetwork
    keystore: KeyStore
    onMsg: (msg: Msg) => void
}) => {
    return (
        <Container>
            <AccountPicker
                keystore={keystore}
                currentAccount={currentAccount}
                onMsg={onMsg}
            />
            <Column spacing={8}>
                <Skeleton variant="transparent" width="100%" height={35} />
                <CopyAddressNetworkFilterRaw
                    currentNetwork={currentNetwork}
                    currentAccount={currentAccount}
                    onMsg={onMsg}
                />
            </Column>
        </Container>
    )
}

export const ErrorWidget = ({
    currentNetwork,
    currentAccount,
    keystore,
    onMsg,
}: {
    currentAccount: Account
    keystore: KeyStore
    currentNetwork: CurrentNetwork
    onMsg: (msg: Msg) => void
}) => {
    return (
        <Container>
            <AccountPicker
                keystore={keystore}
                currentAccount={currentAccount}
                onMsg={onMsg}
            />
            <Column spacing={8}>
                <Text variant="title1" weight="bold" color="textOnDark">
                    &nbsp;
                </Text>
                <CopyAddressNetworkFilterRaw
                    currentNetwork={currentNetwork}
                    currentAccount={currentAccount}
                    onMsg={onMsg}
                />
            </Column>
        </Container>
    )
}
