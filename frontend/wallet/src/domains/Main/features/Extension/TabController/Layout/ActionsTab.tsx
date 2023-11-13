import { Account } from '@zeal/domains/Account'
import { Widget } from 'src/domains/Account/components/Widget'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { Actions } from 'src/domains/Currency/features/Actions'
import { KeyStore } from '@zeal/domains/KeyStore'
import { CurrentNetwork, NetworkMap } from '@zeal/domains/Network'
import { getLayoutBackground } from '@zeal/domains/Network/helpers/getLayoutBackground'
import { Portfolio } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { ContentBox, HeaderBox, Layout2 } from 'src/uikit/Layout/Layout2'
import { Overlay } from '@zeal/uikit/Overlay'

type Props = {
    portfolio: Portfolio
    currentAccount: Account
    currentNetwork: CurrentNetwork
    keystore: KeyStore
    currencyHiddenMap: CurrencyHiddenMap
    networkMap: NetworkMap
    customCurrencyMap: CustomCurrencyMap
    currencyPinMap: CurrencyPinMap

    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | MsgOf<typeof Widget> | MsgOf<typeof Actions>

export const ActionsTab = ({
    currentNetwork,
    currencyHiddenMap,
    currentAccount,
    keystore,
    portfolio,
    currencyPinMap,
    customCurrencyMap,
    networkMap,
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
            </Layout2>
            <Overlay onClick={() => onMsg({ type: 'close' })}>
                <ContentBox style={{ flexGrow: 0 }}>
                    <Actions
                        currencyHiddenMap={currencyHiddenMap}
                        currencyId={null}
                        currencyPinMap={currencyPinMap}
                        customCurrencyMap={customCurrencyMap}
                        fromAccount={currentAccount}
                        networkMap={networkMap}
                        onMsg={onMsg}
                        portfolio={portfolio}
                    />
                </ContentBox>
            </Overlay>
        </>
    )
}
