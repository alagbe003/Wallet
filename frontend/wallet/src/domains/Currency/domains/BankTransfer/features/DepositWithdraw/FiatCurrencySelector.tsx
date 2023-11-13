import { FormattedMessage } from 'react-intl'
import { FiatCurrency } from '@zeal/domains/Currency'
import { Avatar } from 'src/domains/Currency/components/Avatar'
import { IconButton } from 'src/uikit'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column2 } from 'src/uikit/Column2'
import { Group } from 'src/uikit/Group'
import { Header } from 'src/uikit/Header'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'

type Props = {
    selected: FiatCurrency | null
    fiatCurrencies: FiatCurrency[]
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_currency_selected'; currency: FiatCurrency }

export const FiatCurrencySelector = ({
    selected,
    onMsg,
    fiatCurrencies,
}: Props) => (
    <Layout2
        background="light"
        padding="form"
        aria-labelledby="choose-currency-id"
    >
        <ActionBar
            right={
                <IconButton onClick={() => onMsg({ type: 'close' })}>
                    <CloseCross size={24} />
                </IconButton>
            }
        />

        <Column2 spacing={24}>
            <Header
                titleId="choose-currency-id"
                title={
                    <FormattedMessage
                        id="currencySelector.title"
                        defaultMessage="Choose currency"
                    />
                }
            />
            <Column2 spacing={12}>
                <Group variant="default">
                    {fiatCurrencies.map((currency: FiatCurrency) => (
                        <ListItem2
                            key={currency.id}
                            size="regular"
                            aria-selected={selected?.id === currency.id}
                            avatar={({ size }) => (
                                <Avatar size={size} currency={currency} />
                            )}
                            primaryText={currency.code}
                            shortText={currency.name}
                            onClick={() =>
                                onMsg({
                                    type: 'on_currency_selected',
                                    currency,
                                })
                            }
                        />
                    ))}
                </Group>
            </Column2>
        </Column2>
    </Layout2>
)
