import { CountryISOCode } from '@zeal/domains/Country'
import { Avatar as UIAvatar, AvatarSize } from 'src/uikit/Avatar'

type Props = {
    countryCode: CountryISOCode
    size: AvatarSize
}

export const Avatar = ({ countryCode, size }: Props) => {
    return <UIAvatar size={size} src={`/svgs/flags/${countryCode}.svg`} />
}
