import { FormattedMessage } from 'react-intl'
import { SignMessageRequest } from '@zeal/domains/RPCRequest'
import { getPersonalSignMessage } from '@zeal/domains/RPCRequest/helpers/getPersonalSignMessage'
import { notReachable } from '@zeal/toolkit'
import { Text2 } from 'src/uikit/Text2'
import { InfoCard } from '@zeal/uikit/InfoCard'
import { InfoCircle } from '@zeal/uikit/Icon/InfoCircle'

type Props = {
    request: SignMessageRequest
}

export const Message = ({ request }: Props) => {
    const result = getPersonalSignMessage(request)

    switch (result.type) {
        case 'Failure':
            return (
                <InfoCard
                    title={
                        <FormattedMessage
                            id="rpc.sign.cannot_parse_message.header"
                            defaultMessage="Proceed with caution"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="rpc.sign.cannot_parse_message.body"
                            defaultMessage="We couldn’t decode this message. Only accept this request if you trust this app.{br}{br}Messages can be used to log you in to an app, but can also gives apps control over your tokens or NFTs."
                            values={{
                                br: <br />,
                            }}
                        />
                    }
                    variant="critical"
                    icon={({ size }) => <InfoCircle size={size} />}
                />
            )
        case 'Success':
            return (
                <Text2
                    variant="footnote"
                    weight="regular"
                    color="textSecondary"
                    whiteSpace="pre-wrap"
                >
                    {result.data}
                </Text2>
            )
        /* istanbul ignore next */
        default:
            return notReachable(result)
    }
}
