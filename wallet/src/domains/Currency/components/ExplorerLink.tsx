import { Currency } from '@zeal/domains/Currency'
import { IconButton } from 'src/uikit'
import { ExternalLink } from 'src/uikit/Icon/ExternalLink'

import { getExplorerLink } from '@zeal/domains/Currency/helpers/getExplorerLink'
import { NetworkMap } from '@zeal/domains/Network'
import { notReachable } from '@zeal/toolkit'

type Props = {
    currency: Currency | null
    networkMap: NetworkMap
}

export const ExplorerLink = ({ currency, networkMap }: Props) => {
    if (!currency) {
        return null
    }

    switch (currency.type) {
        case 'FiatCurrency':
            return null

        case 'CryptoCurrency':
            return (
                <IconButton
                    onClick={() =>
                        window.open(getExplorerLink(currency, networkMap))
                    }
                >
                    <ExternalLink size={14} color="iconDefault" />
                </IconButton>
            )

        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}
