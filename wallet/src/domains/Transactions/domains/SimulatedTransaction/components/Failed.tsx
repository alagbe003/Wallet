import { FormattedMessage } from 'react-intl'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { FailedTransaction } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { Content } from 'src/uikit/Layout/Content'

type Props = {
    transaction: FailedTransaction
    dApp: DAppSiteInfo | null
}

export const Failed = (_: Props) => {
    return (
        <Content.Splash
            title={
                <FormattedMessage
                    id="failed.transaction.content"
                    defaultMessage="Transaction likely to fail"
                />
            }
            variant="error"
            onAnimationComplete={null}
        />
    )
}
