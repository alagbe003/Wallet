import { QRCodeSVG } from 'qrcode.react'
import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { getAvatarImage } from '@zeal/domains/Account/helpers/getAvatarImage'
import { CopyAddress } from 'src/domains/Address/components/CopyAddress'
import { KeyStore } from '@zeal/domains/KeyStore'
import { Button } from '@zeal/uikit/Button'
import { IconButton } from '@zeal/uikit/IconButton'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { InfoCircle } from '@zeal/uikit/Icon/InfoCircle'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { Screen } from '@zeal/uikit/Screen'
import { noop } from '@zeal/toolkit/noop'
import { TickSquare } from '@zeal/uikit/Icon/TickSquare'
import { notReachable } from '@zeal/toolkit/notReachable'
import { useCopyTextToClipboard } from '@zeal/toolkit/Clipboard/hooks/useCopyTextToClipboard'
import { Row } from '@zeal/uikit/Row'
import { Actions } from '@zeal/uikit/Actions'

type Props = {
    account: Account
    keystore: KeyStore
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | { type: 'on_supported_networks_click' }

export const Layout = ({ account, keystore, onMsg }: Props) => {
    const [state, setState] = useCopyTextToClipboard()
    return (
        <Screen background="light" padding="form">
            <ActionBar
                left={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <BackIcon size={24} />
                    </IconButton>
                }
            />
            <Column spacing={16} fill>
                <Group variant="default" fill>
                    <Column spacing={16} fill>
                        <Column spacing={8} alignX="center">
                            <Header
                                title={
                                    <FormattedMessage
                                        id="receive_funds.title"
                                        defaultMessage="Receive funds"
                                    />
                                }
                                subtitle={
                                    <FormattedMessage
                                        id="receive_funds.subtitle"
                                        defaultMessage="Scan code or share address. You wallet uses the same code and address on all supported networks"
                                    />
                                }
                            />

                            <QRCodeSVG
                                size={200}
                                value={account.address}
                                imageSettings={{
                                    src: getAvatarImage(keystore, account),
                                    height: 24,
                                    width: 24,
                                    excavate: true,
                                }}
                            />
                        </Column>

                        <CopyAddress
                            size="large"
                            color="on_light"
                            address={account.address}
                        />
                    </Column>
                    <Row spacing={0} alignX="center">
                        <Tertiary
                            color="on_light"
                            size="small"
                            onClick={() =>
                                onMsg({
                                    type: 'on_supported_networks_click',
                                })
                            }
                        >
                            <FormattedMessage
                                id="receive_funds.only_evm_chains_supported"
                                defaultMessage="Only EVM chains supported"
                            />
                            <InfoCircle size={14} />
                        </Tertiary>
                    </Row>
                </Group>
                <Actions>
                    {(() => {
                        switch (state.type) {
                            case 'not_asked':
                            case 'loading':
                            case 'error':
                                return (
                                    <Button
                                        size="regular"
                                        variant="primary"
                                        onClick={() =>
                                            setState({
                                                type: 'loading',
                                                params: {
                                                    stringToCopy:
                                                        account.address,
                                                },
                                            })
                                        }
                                    >
                                        <FormattedMessage
                                            id="receive_funds.copy_address"
                                            defaultMessage="Copy address"
                                        />
                                    </Button>
                                )
                            case 'loaded':
                                return (
                                    <Button
                                        size="regular"
                                        variant="primary"
                                        onClick={noop}
                                    >
                                        <FormattedMessage
                                            id="receive_funds.copy_address.done"
                                            defaultMessage="Copied"
                                        />
                                        <TickSquare
                                            color="iconAccent1"
                                            size={14}
                                        />
                                    </Button>
                                )

                            /* istanbul ignore next */
                            default:
                                return notReachable(state)
                        }
                    })()}
                </Actions>
            </Column>
        </Screen>
    )
}
