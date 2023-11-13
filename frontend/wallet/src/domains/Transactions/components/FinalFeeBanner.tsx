import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { Money } from '@zeal/domains/Money'
import { FormattedFeeInDefaultCurrency } from 'src/domains/Money/components/FormattedFeeInDefaultCurrency'
import { TruncatedFeeInNativeTokenCurrency } from 'src/domains/Money/components/TruncatedFeeInNativeTokenCurrency'
import { Banner } from 'src/uikit/Banner'
import { Row } from '@zeal/uikit/Row'
import { Text2 } from 'src/uikit/Text2'
import { v4 } from 'uuid'

type Props = {
    fee: Money
    priceInDefaultCurrency: Money | null
    knownCurrencies: KnownCurrencies
}

export const FinalFeeBanner = ({
    fee,
    knownCurrencies,
    priceInDefaultCurrency,
}: Props) => {
    const [id] = useState(v4())

    return (
        <Banner variant="outline" icon={null}>
            <Row
                spacing={0}
                alignX="stretch"
                fullWidth
                aria-labelledby={`final-fee-label-${id}`}
                aria-describedby={`final-fee-desc-${id}`}
            >
                <Text2
                    variant="paragraph"
                    color="textPrimary"
                    weight="regular"
                    id={`final-fee-label-${id}`}
                >
                    <FormattedMessage
                        id="confirmTransaction.networkFee"
                        defaultMessage="Final network fee"
                    />
                </Text2>

                <Text2
                    variant="paragraph"
                    color="textPrimary"
                    weight="regular"
                    id={`final-fee-desc-${id}`}
                >
                    {priceInDefaultCurrency ? (
                        <FormattedFeeInDefaultCurrency
                            money={priceInDefaultCurrency}
                            knownCurrencies={knownCurrencies}
                        />
                    ) : (
                        <TruncatedFeeInNativeTokenCurrency
                            money={fee}
                            knownCurrencies={knownCurrencies}
                        />
                    )}
                </Text2>
            </Row>
        </Banner>
    )
}
