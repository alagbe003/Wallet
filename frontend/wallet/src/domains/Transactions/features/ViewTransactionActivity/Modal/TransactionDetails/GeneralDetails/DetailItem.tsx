import { ReactNode } from 'react'
import { Row } from '@zeal/uikit/Row'
import { Text2 } from 'src/uikit/Text2'
import { Spacer2 } from 'src/uikit/Spacer2'
import { IconButton } from 'src/uikit'
import { ExternalLink } from 'src/uikit/Icon/ExternalLink'

type Props = {
    label: ReactNode
    value: ReactNode
    explorerLink: string | null
}

export const DetailItem = ({ label, value, explorerLink }: Props) => (
    <Row spacing={2}>
        <Text2 variant="paragraph" weight="regular" color="textSecondary">
            {label}
        </Text2>
        <Spacer2 />
        <Text2 variant="paragraph" weight="regular" color="textPrimary">
            {value}
        </Text2>
        {explorerLink && (
            <IconButton onClick={() => window.open(explorerLink, '_blank')}>
                <ExternalLink size={16} color="iconDefault" />
            </IconButton>
        )}
    </Row>
)
