import { Group, Section } from 'src/uikit/Group'
import { AppsGroupHeader } from '../AppsGroupHeader'
import { App } from '@zeal/domains/App'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { ListItem } from '../ListItem'
import { FormattedMessage } from 'react-intl'
import { Apps } from 'src/uikit/Icon/Empty/Apps'
import { NetworkMap } from '@zeal/domains/Network'
import { EmptyStateWidget } from 'src/uikit/EmptyStateWidget'
import { MsgOf } from '@zeal/toolkit/MsgOf'

type Props = {
    apps: App[]
    currencies: KnownCurrencies
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'show_all_apps_click' } | MsgOf<typeof ListItem>

const NUM_OF_ELEMENTS = 3

export const Widget = ({ apps, currencies, networkMap, onMsg }: Props) => {
    return (
        <Section style={{ flex: '0 0 auto' }}>
            <AppsGroupHeader
                knownCurrencies={currencies}
                apps={apps}
                onClick={
                    apps.length
                        ? () => {
                              onMsg({ type: 'show_all_apps_click' })
                          }
                        : null
                }
            />
            <Group style={{ flex: '0 0 auto' }} variant="default">
                {apps.length ? (
                    apps
                        .slice(0, NUM_OF_ELEMENTS)
                        .map((app) => (
                            <ListItem
                                networkMap={networkMap}
                                key={`${app.networkHexId}${app.name}`}
                                knownCurrencies={currencies}
                                app={app}
                                onMsg={onMsg}
                            />
                        ))
                ) : (
                    <AppsEmptyState />
                )}
            </Group>
        </Section>
    )
}

const AppsEmptyState = () => {
    return (
        <EmptyStateWidget
            icon={({ size }) => <Apps size={size} color="backgroundLight" />}
            size="regular"
            title={
                <FormattedMessage
                    id="app.widget.emptystate"
                    defaultMessage="We found no assets in DeFi apps"
                />
            }
        />
    )
}
