import { formatDistanceToNowStrict } from 'date-fns'
import { FormattedMessage } from 'react-intl'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { Refresh } from 'src/uikit/Icon/Refresh'
import { Row } from '@zeal/uikit/Row'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    onClick: () => void
    fetchedAt: Date
}

export const LastRefreshed = ({ onClick, fetchedAt }: Props) => {
    return (
        <Row spacing={4}>
            <Text2 variant="paragraph" weight="regular" color="textSecondary">
                <FormattedMessage
                    id="portfolio.view.lastRefreshed"
                    defaultMessage="Refreshed {date}"
                    values={{
                        date: formatDistanceToNowStrict(fetchedAt, {
                            addSuffix: true,
                            roundingMethod: 'floor',
                        }),
                    }}
                />
            </Text2>

            <Spacer2 />

            <Tertiary color="on_light" size="regular" onClick={onClick}>
                <Refresh size={16} color="iconDefault" />
                <FormattedMessage
                    id="account.view.error.refreshAssets"
                    defaultMessage="Refresh"
                />
            </Tertiary>
        </Row>
    )
}
