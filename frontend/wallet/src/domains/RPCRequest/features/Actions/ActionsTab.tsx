import { Account } from '@zeal/domains/Account'
import { Widget } from 'src/domains/Account/components/Widget'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStore } from '@zeal/domains/KeyStore'
import { CurrentNetwork } from '@zeal/domains/Network'
import { getLayoutBackground } from '@zeal/domains/Network/helpers/getLayoutBackground'
import { Portfolio } from '@zeal/domains/Portfolio'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { ContentBox, HeaderBox, Layout2 } from 'src/uikit/Layout/Layout2'
import { Overlay } from '@zeal/uikit/Overlay'
import { Spacer2 } from 'src/uikit/Spacer2'

type Props = {
    portfolio: Portfolio
    currentAccount: Account
    currentNetwork: CurrentNetwork
    keystore: KeyStore
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | MsgOf<typeof Widget>

export const Actions = ({
    currentNetwork,
    currencyHiddenMap,
    currentAccount,
    keystore,
    portfolio,
    onMsg,
}: Props) => {
    return (
        <>
            <Layout2
                padding="main"
                background={getLayoutBackground(currentNetwork)}
            >
                <HeaderBox>
                    <Widget
                        currencyHiddenMap={currencyHiddenMap}
                        keystore={keystore}
                        currentNetwork={currentNetwork}
                        portfolio={portfolio}
                        currentAccount={currentAccount}
                        onMsg={onMsg}
                    />
                </HeaderBox>

                <ContentBox>hm</ContentBox>
            </Layout2>
            <Overlay onClick={() => onMsg({ type: 'close' })}>
                <Spacer2 />
                <ContentBox>test</ContentBox>
            </Overlay>
        </>
    )
}
