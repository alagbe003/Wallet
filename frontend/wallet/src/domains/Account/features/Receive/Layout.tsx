import { QRCodeSVG } from 'qrcode.react'
import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { getAvatarImage } from '@zeal/domains/Account/helpers/getAvatarImage'
import { CopyAddress } from 'src/domains/Address/components/CopyAddress'
import { KeyStore } from '@zeal/domains/KeyStore'
import { Button, IconButton } from 'src/uikit'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { Column2 } from 'src/uikit/Column2'
import { Group } from 'src/uikit/Group'
import { Header } from 'src/uikit/Header'
import { InfoCircle } from 'src/uikit/Icon/InfoCircle'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Spacer2 } from 'src/uikit/Spacer2'

type Props = {
    account: Account
    keystore: KeyStore
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | { type: 'on_supported_networks_click' }

export const Layout = ({ account, keystore, onMsg }: Props) => {
    return (
        <Layout2 background="light" padding="form">
            <ActionBar
                left={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <BackIcon size={24} />
                    </IconButton>
                }
            />
            <Column2 spacing={16} style={{ flex: '1' }}>
                <Group variant="default" style={{ flex: '1' }}>
                    <Spacer2 />

                    <Column2 spacing={16}>
                        <Column2 spacing={8} alignX="center">
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
                        </Column2>

                        <CopyAddress
                            size="large"
                            color="on_light"
                            address={account.address}
                        />
                    </Column2>

                    <Spacer2 />

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

                    <Spacer2 />
                </Group>

                <Button
                    size="regular"
                    variant="primary"
                    onClick={() =>
                        onMsg({ type: 'on_supported_networks_click' })
                    }
                >
                    <FormattedMessage
                        id="receive_funds.copy_address"
                        defaultMessage="Copy address"
                    />
                </Button>
            </Column2>
        </Layout2>
    )
}
