import { Token } from '@zeal/domains/Token'
import { GroupHeader } from '@zeal/uikit/Group'
import { FormattedMessage } from 'react-intl'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { sumTokensInDefaultCurrency } from '@zeal/domains/Portfolio/helpers/sum'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { Chain } from 'src/uikit/Chain'
import { Text2 } from 'src/uikit/Text2'
import { ForwardIcon } from 'src/uikit/Icon/Navigation/ForwardIcon'
import { Row } from '@zeal/uikit/Row'

type Props = {
    tokens: Token[]
    labelId: string
    knownCurrencies: KnownCurrencies
    onClick?: null | (() => void)
}

export const TokensGroupHeader = ({
    tokens,
    knownCurrencies,
    labelId,
    onClick,
}: Props) => {
    const sum = sumTokensInDefaultCurrency(tokens)
    const _onClick = onClick ?? undefined

    return (
        <GroupHeader
            onClick={_onClick}
            left={
                <Chain>
                    <Text2 id={labelId}>
                        <FormattedMessage
                            id="token.TokensGroupHeader.text"
                            defaultMessage="Tokens"
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
                tokens.length ? (
                    <Row spacing={4}>
                        <Chain>
                            <Text2>{tokens.length}</Text2>
                            <Text2>
                                <FormattedMessage
                                    id="token.TokensGroupHeader.seeAll"
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
