import React, { useState } from 'react'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Column2 } from 'src/uikit/Column2'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Button, IconButton } from 'src/uikit'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { Text2 } from 'src/uikit/Text2'
import { FormattedMessage } from 'react-intl'
import { Tertiary } from 'src/uikit/Button/Tertiary'
import { Group, Section } from 'src/uikit/Group'
import { GroupHeader } from '@zeal/uikit/Group'
import {
    Connected,
    ConnectionMap,
} from 'src/domains/DApp/domains/ConnectionState'
import { notReachable } from '@zeal/toolkit'
import { ConnectedListItem } from 'src/domains/DApp/domains/ConnectionState/components/ConnectedListItem'
import { Spacer2 } from 'src/uikit/Spacer2'
import { values } from '@zeal/toolkit/Object'
import { Connections } from 'src/uikit/Icon/Empty/Connections'

type Props = {
    connections: ConnectionMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_disconnect_all_click' }
    | { type: 'on_disconnect_dapps_click'; dAppHostNames: string[] }

export const Layout = ({ connections, onMsg }: Props) => {
    const [dAppHostNames, setDAppHostNames] = useState<Set<string>>(new Set())
    const activeConnections = values(connections).filter(
        (connection): connection is Connected => {
            switch (connection.type) {
                case 'not_interacted':
                case 'disconnected':
                case 'connected_to_meta_mask':
                    return false
                case 'connected':
                    return true
                /* istanbul ignore next */
                default:
                    return notReachable(connection)
            }
        }
    )

    return (
        <Layout2
            background="light"
            padding="form"
            aria-labelledby="connections-layout-label"
        >
            <Column2 style={{ flex: '1 0 0%' }} spacing={16}>
                <Column2 style={{ flex: '0 0 auto' }} spacing={8}>
                    <ActionBar
                        left={
                            <IconButton
                                onClick={() => onMsg({ type: 'close' })}
                            >
                                <BackIcon size={24} />
                            </IconButton>
                        }
                    />
                    <Text2
                        variant="title3"
                        weight="semi_bold"
                        color="textPrimary"
                        id="connections-layout-label"
                    >
                        <FormattedMessage
                            id="dapp.connection.manage.connection_list.title"
                            defaultMessage="Connections"
                        />
                    </Text2>
                </Column2>

                <Section>
                    <GroupHeader
                        left={
                            <FormattedMessage
                                id="dapp.connection.manage.connection_list.section.title"
                                defaultMessage="Active"
                            />
                        }
                        right={
                            !!activeConnections.length ? (
                                <Tertiary
                                    color="on_light"
                                    size="small"
                                    onClick={() =>
                                        onMsg({
                                            type: 'on_disconnect_all_click',
                                        })
                                    }
                                >
                                    <FormattedMessage
                                        id="dapp.connection.manage.connection_list.section.button.title"
                                        defaultMessage="Disconnect all"
                                    />
                                </Tertiary>
                            ) : null
                        }
                    />
                    <Group variant="default" style={{ overflow: 'auto' }}>
                        {!!activeConnections.length ? (
                            activeConnections.map((connection) => {
                                const selected = dAppHostNames.has(
                                    connection.dApp.hostname
                                )
                                return (
                                    <ConnectedListItem
                                        key={connection.dApp.hostname}
                                        connection={connection}
                                        isSelected={selected}
                                        onClick={() => {
                                            selected
                                                ? dAppHostNames.delete(
                                                      connection.dApp.hostname
                                                  )
                                                : dAppHostNames.add(
                                                      connection.dApp.hostname
                                                  )
                                            setDAppHostNames(
                                                new Set(dAppHostNames)
                                            )
                                        }}
                                    />
                                )
                            })
                        ) : (
                            <Column2
                                alignX="center"
                                style={{ padding: '16px' }}
                                spacing={8}
                            >
                                <Connections size={24} color="iconDefault" />
                                <Text2
                                    variant="paragraph"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="dapp.connection.manage.connection_list.no_connections"
                                        defaultMessage="You have no connected apps"
                                    />
                                </Text2>
                            </Column2>
                        )}
                    </Group>
                </Section>

                <Spacer2 />
                <Button
                    size="regular"
                    variant="primary"
                    disabled={!dAppHostNames.size}
                    onClick={() => {
                        onMsg({
                            type: 'on_disconnect_dapps_click',
                            dAppHostNames: Array.from(dAppHostNames),
                        })
                    }}
                >
                    <FormattedMessage
                        id="dapp.connection.manage.connection_list.main.button.title"
                        defaultMessage="Disconnect"
                    />
                </Button>
            </Column2>
        </Layout2>
    )
}
