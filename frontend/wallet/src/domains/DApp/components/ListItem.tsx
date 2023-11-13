import { ComponentPropsWithoutRef, ReactNode } from 'react'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { notReachable } from '@zeal/toolkit'
import { Range } from 'src/toolkit/Range'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Text2 } from 'src/uikit/Text2'
import { Avatar } from './Avatar'

type Props = {
    dApp: DAppSiteInfo
    highlightHostName: Range | null
    variant: 'regular' | 'small'
    avatarBadge?: ComponentPropsWithoutRef<typeof Avatar>['badge']
}

export const ListItem = ({
    dApp,
    highlightHostName,
    variant,
    avatarBadge,
}: Props) => {
    return dApp.title ? (
        <ListItem2
            aria-selected={false}
            size="regular"
            avatar={() => (
                <AvatarVariant
                    dApp={dApp}
                    variant={variant}
                    avatarBadge={avatarBadge}
                />
            )}
            primaryText={<Title variant={variant}>{dApp.title}</Title>}
            shortText={
                <Subtitle variant={variant}>
                    <Hostname
                        hostname={dApp.hostname}
                        highlight={highlightHostName}
                    />
                </Subtitle>
            }
        />
    ) : (
        <ListItem2
            aria-selected={false}
            size="regular"
            avatar={() => (
                <AvatarVariant
                    dApp={dApp}
                    variant={variant}
                    avatarBadge={avatarBadge}
                />
            )}
            primaryText={
                <Hostname
                    hostname={dApp.hostname}
                    highlight={highlightHostName}
                />
            }
        />
    )
}

// TODO: make variant uniform with ListItem2 size ("regular" and "large") and drop this component
const Title = ({
    variant,
    children,
}: {
    variant: 'regular' | 'small'
    children: NonNullable<ReactNode>
}) => {
    switch (variant) {
        case 'regular':
            return (
                <Text2
                    ellipsis
                    variant="callout"
                    weight="regular"
                    color="textPrimary"
                >
                    {children}
                </Text2>
            )

        case 'small':
            return (
                <Text2
                    ellipsis
                    variant="paragraph"
                    weight="regular"
                    color="textPrimary"
                >
                    {children}
                </Text2>
            )

        /* istanbul ignore next */
        default:
            return notReachable(variant)
    }
}

// TODO: make variant uniform with ListItem2 size ("regular" and "large") and drop this componet
const Subtitle = ({
    children,
    variant,
}: {
    variant: 'regular' | 'small'
    children: NonNullable<ReactNode>
}) => {
    switch (variant) {
        case 'regular':
            return (
                <Text2
                    ellipsis
                    variant="paragraph"
                    weight="regular"
                    color="textSecondary"
                >
                    {children}
                </Text2>
            )
        case 'small':
            return (
                <Text2
                    ellipsis
                    variant="caption1"
                    weight="regular"
                    color="textSecondary"
                >
                    {children}
                </Text2>
            )

        /* istanbul ignore next */
        default:
            return notReachable(variant)
    }
}

const AvatarVariant = ({
    dApp,
    variant,
    avatarBadge,
}: {
    dApp: DAppSiteInfo
    variant: 'regular' | 'small'
    avatarBadge: ComponentPropsWithoutRef<typeof Avatar>['badge']
}) => {
    switch (variant) {
        case 'regular':
            return <Avatar dApp={dApp} size={32} badge={avatarBadge} />
        case 'small':
            return <Avatar dApp={dApp} size={28} badge={avatarBadge} />

        /* istanbul ignore next */
        default:
            return notReachable(variant)
    }
}

type HostnameProps = {
    hostname: DAppSiteInfo['hostname']
    highlight: Range | null
}

const Hostname = ({ hostname, highlight }: HostnameProps) => {
    if (!highlight) {
        return <>{hostname}</>
    }

    const extendedRange: Range = {
        start: highlight.start - 1,
        end: highlight.end + 1,
    }

    const start = hostname.substring(0, extendedRange.start)
    const highlightPart = hostname.substring(
        extendedRange.start,
        extendedRange.end
    )
    const end = hostname.substring(extendedRange.end)

    return (
        <>
            {start}
            <Text2 color="textError">{highlightPart}</Text2>
            {end}
        </>
    )
}
