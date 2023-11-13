import React from 'react'
import { FormattedMessage } from 'react-intl'
import { FormError } from 'src/domains/Account/domains/Label'
import { notReachable } from '@zeal/toolkit'

type Props = {
    error: FormError['label']
}

export type Msg = { type: 'close' }

export const LabelErrorMessage = ({ error }: Props) => {
    if (!error) {
        return null
    }

    switch (error.type) {
        case 'label_already_exist':
            return (
                <FormattedMessage
                    id="account.addLabel.labelError.labelAlreadyExist"
                    defaultMessage="Label already exists. Try another label"
                />
            )
        case 'max_string_length_is_exceeded':
            return (
                <FormattedMessage
                    id="account.addLabel.labelError.labelAlreadyExist"
                    defaultMessage="Max character count reached"
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}
