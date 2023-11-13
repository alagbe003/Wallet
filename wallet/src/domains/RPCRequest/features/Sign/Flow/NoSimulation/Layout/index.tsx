import { FormattedMessage } from 'react-intl'
import { Account } from '@zeal/domains/Account'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStore } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { SignMessageRequest } from '@zeal/domains/RPCRequest'
import { Button, IconButton } from 'src/uikit'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'

import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { Column2 } from 'src/uikit/Column2'
import { Content } from 'src/uikit/Layout/Content'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Row } from '@zeal/uikit/Row'
import { MainCTA, Msg as MainCTAMsg } from './MainCTA'
import { Message } from '../../../Message'

type Props = {
    dApp: DAppSiteInfo
    account: Account
    network: Network
    request: SignMessageRequest
    keyStore: KeyStore
    isLoading: boolean
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'cancel_button_click' }
    | MainCTAMsg
    | { type: 'on_minimize_click' }

export const Layout = ({
    request,
    account,
    network,
    dApp,
    keyStore,
    isLoading,
    onMsg,
}: Props) => {
    return (
        <Layout2 background="light" padding="form">
            <ActionBar
                keystore={keyStore}
                network={network}
                account={account}
                right={
                    <IconButton
                        onClick={() => {
                            onMsg({ type: 'on_minimize_click' })
                        }}
                    >
                        <CloseCross size={24} />
                    </IconButton>
                }
            />
            <Column2 spacing={12} style={{ flex: '1' }}>
                <Content
                    header={
                        <Content.Header
                            title={
                                <FormattedMessage
                                    id="rpc.sign.title"
                                    defaultMessage="Sign"
                                />
                            }
                            subtitle={
                                <FormattedMessage
                                    id="rpc.sign.subtitle"
                                    defaultMessage="For {name}"
                                    values={{
                                        name: dApp.title || dApp.hostname,
                                    }}
                                />
                            }
                        />
                    }
                >
                    <Message request={request} />
                </Content>

                <Row spacing={8}>
                    <Button
                        variant="secondary"
                        disabled={isLoading}
                        size="regular"
                        onClick={() => {
                            onMsg({
                                type: 'cancel_button_click',
                            })
                        }}
                    >
                        <FormattedMessage
                            id="action.cancel"
                            defaultMessage="Cancel"
                        />
                    </Button>
                    <MainCTA
                        request={request}
                        isLoading={isLoading}
                        keyStore={keyStore}
                        onMsg={onMsg}
                    />
                </Row>
            </Column2>
        </Layout2>
    )
}
