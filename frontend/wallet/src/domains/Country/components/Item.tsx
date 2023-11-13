import { COUNTRIES_MAP, CountryISOCode } from '@zeal/domains/Country'
import { Avatar } from './Avatar'
import { Text2 } from 'src/uikit/Text2'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'

type Props = {
    selected: boolean
    country: CountryISOCode
    onClick: () => void
}

export const Item = ({ country, selected, onClick }: Props) => {
    return (
        <ListItem2
            size="regular"
            aria-selected={selected}
            avatar={({ size }) => <Avatar countryCode={country} size={size} />}
            primaryText={<Text2 ellipsis>{COUNTRIES_MAP[country].name}</Text2>}
            onClick={onClick}
        />
    )
}
