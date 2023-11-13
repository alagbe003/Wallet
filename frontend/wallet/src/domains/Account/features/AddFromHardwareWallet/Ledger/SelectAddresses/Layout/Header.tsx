import React from 'react'
import { FormattedMessage } from 'react-intl'
import { GroupHeader as UIGroupHeader } from '@zeal/uikit/Group'
import { Header as UIHeader } from '@zeal/uikit/Header'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { Setting } from 'src/uikit/Icon/Setting'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'change_path_settings_clicked' }

export const Header = () => {
    return (
        <UIHeader
            title={
                <FormattedMessage
                    id="ledger.select_account.title"
                    defaultMessage="Import Ledger accounts"
                />
            }
            subtitle={
                <FormattedMessage
                    id="ledger.select_account.subtitle"
                    defaultMessage="Don’t see the accounts you expect? Try changing the path settings"
                />
            }
        />
    )
}

export const GroupHeader = ({ onMsg }: Props) => {
    return (
        <UIGroupHeader
            left={
                <FormattedMessage
                    id="ledger.select_account.subtitle.group_header"
                    defaultMessage="Accounts"
                />
            }
            right={
                <Tertiary
                    size="small"
                    color="on_light"
                    onClick={() => {
                        onMsg({ type: 'change_path_settings_clicked' })
                    }}
                >
                    <FormattedMessage
                        id="ledger.select_account.path_settings"
                        defaultMessage="Path Settings"
                    />
                    <Setting size={20} />
                </Tertiary>
            }
        />
    )
}
