import { FormattedMessage } from 'react-intl'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { BoldDownload } from 'src/uikit/Icon/BoldDownload'
import { BoldGeneralBank } from 'src/uikit/Icon/BoldGeneralBank'
import { ForwardIcon } from '@zeal/uikit/Icon/ForwardIcon'
import { ListItem } from '@zeal/uikit/ListItem'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'bank_transfer_click' }
    | { type: 'receive_click' }

export const AddFunds = ({ onMsg }: Props) => {
    return (
        <Popup.Layout background="backgroundLight" onMsg={onMsg}>
            <Header
                title={
                    <FormattedMessage
                        id="add_funds.title"
                        defaultMessage="Add Funds"
                    />
                }
            />

            <Popup.Content>
                <Column spacing={8}>
                    <Group variant="default">
                        <ListItem
                            size="regular"
                            aria-selected={false}
                            avatar={({ size }) => (
                                <BoldGeneralBank
                                    size={size}
                                    color="iconAccent2"
                                />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="add_funds.bank_transfer"
                                    defaultMessage="Bank Transfer"
                                />
                            }
                            shortText="Fast, free deposit and withdrawal"
                            side={{
                                rightIcon: ({ size }) => (
                                    <ForwardIcon
                                        size={size}
                                        color="iconDefault"
                                    />
                                ),
                            }}
                            onClick={() =>
                                onMsg({ type: 'bank_transfer_click' })
                            }
                        />

                        <ListItem
                            size="regular"
                            aria-selected={false}
                            avatar={({ size }) => (
                                <BoldDownload size={size} color="iconAccent2" />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="add_funds.receive"
                                    defaultMessage="Receive"
                                />
                            }
                            shortText="From another wallet"
                            side={{
                                rightIcon: ({ size }) => (
                                    <ForwardIcon
                                        size={size}
                                        color="iconDefault"
                                    />
                                ),
                            }}
                            onClick={() => onMsg({ type: 'receive_click' })}
                        />
                    </Group>
                </Column>
            </Popup.Content>
        </Popup.Layout>
    )
}
