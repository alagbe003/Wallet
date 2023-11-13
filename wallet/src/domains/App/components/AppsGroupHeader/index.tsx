import { GroupHeader } from '@zeal/uikit/Group'
import { FormattedMessage } from 'react-intl'
import { App } from '@zeal/domains/App'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { sumAppsInDefaultCurrency } from '@zeal/domains/Portfolio/helpers/sum'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { Chain } from 'src/uikit/Chain'
import { Text2 } from 'src/uikit/Text2'
import { Row } from '@zeal/uikit/Row'
import { ForwardIcon } from 'src/uikit/Icon/Navigation/ForwardIcon'

type Props = {
    apps: App[]
    knownCurrencies: KnownCurrencies
    onClick: null | (() => void)
}

export const AppsGroupHeader = ({ apps, onClick, knownCurrencies }: Props) => {
    const sum = sumAppsInDefaultCurrency(apps)
    const _onClick = onClick ?? undefined
    return (
        <GroupHeader
            onClick={_onClick}
            left={
                <Chain>
                    <Text2>
                        <FormattedMessage
                            id="app.appsGroupHeader.text"
                            defaultMessage="DeFi"
                        />
                    </Text2>
                    {sum && (
                        <Text2>
                            <FormattedTokenBalanceInDefaultCurrency
                                money={sum}
                                knownCurrencies={knownCurrencies}
                            />
                        </Text2>
                    )}
                </Chain>
            }
            right={
                !!apps.length ? (
                    <Row spacing={4}>
                        <Chain>
                            <Text2>{apps.length}</Text2>
                            <Text2>
                                <FormattedMessage
                                    id="app.appsGroupHeader.seeAll"
                                    defaultMessage="See all"
                                />
                            </Text2>
                        </Chain>
                        <ForwardIcon size={16} color="iconDefault" />
                    </Row>
                ) : null
            }
        />
    )
}
