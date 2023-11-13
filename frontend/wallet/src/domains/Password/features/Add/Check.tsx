import { ReactNode } from 'react'
import { notReachable } from '@zeal/toolkit'
import { Result } from '@zeal/toolkit/Result'
import { Checkbox } from 'src/uikit/Icon/Checkbox'
import { Row } from '@zeal/uikit/Row'
import { Text2 } from 'src/uikit/Text2'

type Props = {
    result: Result<unknown, unknown>
    text: ReactNode
}

export const Check = ({ result, text }: Props) => {
    const color = (() => {
        switch (result.type) {
            case 'Failure':
                return 'iconDefault'
            case 'Success':
                return 'iconAccent2'
            /* istanbul ignore next */
            default:
                return notReachable(result)
        }
    })()

    return (
        <Row spacing={8}>
            <Checkbox size={18} color={color} />
            <Text2 variant="caption1" weight="regular" color="textSecondary">
                {text}
            </Text2>
        </Row>
    )
}
