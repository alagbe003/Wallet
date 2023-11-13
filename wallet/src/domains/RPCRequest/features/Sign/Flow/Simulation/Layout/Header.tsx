import { FormattedMessage, useIntl } from 'react-intl'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { SimulatedSignMessage } from 'src/domains/RPCRequest/domains/SignMessageSimulation'
import { notReachable } from '@zeal/toolkit'
import { IconButton } from 'src/uikit'
import { InfoCircle } from 'src/uikit/Icon/InfoCircle'
import { Content } from 'src/uikit/Layout/Content'
import { Row } from '@zeal/uikit/Row'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    dApp: DAppSiteInfo
    simulatedSignMessage: SimulatedSignMessage
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'on_permit_info_icon_clicked'
}

export const Header = ({ simulatedSignMessage, dApp, onMsg }: Props) => {
    const { formatMessage } = useIntl()
    switch (simulatedSignMessage.type) {
        case 'PermitSignMessage':
        case 'DaiPermitSignMessage':
        case 'Permit2SignMessage':
            return (
                <Content.Header
                    title={
                        <Row spacing={4}>
                            <Text2
                                variant="title3"
                                weight="semi_bold"
                                color="textPrimary"
                            >
                                <FormattedMessage
                                    id="simulatedTransaction.PermitSignMessage.title"
                                    defaultMessage="Permit"
                                />
                            </Text2>
                            <IconButton
                                aria-label={formatMessage({
                                    id: 'approval.approval_info',
                                    defaultMessage: 'Permit information',
                                })}
                                onClick={() =>
                                    onMsg({
                                        type: 'on_permit_info_icon_clicked',
                                    })
                                }
                            >
                                <InfoCircle size={16} />
                            </IconButton>
                        </Row>
                    }
                />
            )

        case 'UnknownSignMessage':
            return (
                <Content.Header
                    title={
                        <FormattedMessage
                            id="simulatedTransaction.UnknownSignMessage.title"
                            defaultMessage="Sign"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="rpc.sign.subtitle"
                            defaultMessage="For {name}"
                            values={{
                                name: dApp.title || dApp.hostname,
                            }}
                        />
                    }
                />
            )

        default:
            return notReachable(simulatedSignMessage)
    }
}
