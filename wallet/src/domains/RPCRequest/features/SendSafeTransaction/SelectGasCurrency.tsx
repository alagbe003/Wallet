import { Network } from '@zeal/domains/Network'
import { getGasAbstractionCurrencies } from '@zeal/domains/Currency/helpers/getGasAbstractionCurrency'
import { Portfolio } from '@zeal/domains/Portfolio'
import { CryptoCurrency } from '@zeal/domains/Currency'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Column2 } from 'src/uikit/Column2'
import { Text2 } from 'src/uikit/Text2'
import { Button } from 'src/uikit'

type Props = {
    network: Network
    portfolio: Portfolio
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_gas_currency_clicked'; gasCurrency: CryptoCurrency }

export const SelectGasCurrency = ({ network, portfolio, onMsg }: Props) => {
    const gasCurrencies = getGasAbstractionCurrencies({ network, portfolio })

    return (
        <Layout2 padding="main" background="light">
            <Column2 spacing={16}>
                <Text2>select gas currency</Text2>

                {gasCurrencies ? (
                    <>
                        {gasCurrencies.map((gasCurrency) => (
                            <Button
                                key={gasCurrency.code}
                                size="regular"
                                variant="primary"
                                onClick={() =>
                                    onMsg({
                                        type: 'on_gas_currency_clicked',
                                        gasCurrency,
                                    })
                                }
                            >
                                {gasCurrency.code}
                            </Button>
                        ))}
                    </>
                ) : (
                    <Text2>no gas currencies</Text2>
                )}

                <Button
                    size="regular"
                    variant="primary"
                    onClick={() => onMsg({ type: 'close' })}
                >
                    BACK
                </Button>
            </Column2>
        </Layout2>
    )
}
