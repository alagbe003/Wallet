import { FormattedMessage } from 'react-intl'
import { noop, notReachable } from '@zeal/toolkit'
import { NotSelected } from 'src/uikit/Icon/NotSelected'
import { Radio } from 'src/uikit/Icon/Radio'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { HDPath } from '../../helpers/generatePaths'

type Props = {
    hdPath: HDPath
    selected: boolean
    onClick: () => void
}

export const PathItem = ({ hdPath, onClick, selected }: Props) => {
    return (
        <ListItem2
            aria-selected={false}
            size="regular"
            onClick={!selected ? onClick : noop}
            primaryText={<Label hdPath={hdPath} />}
            shortText={<Description hdPath={hdPath} />}
            side={{
                rightIcon: () =>
                    selected ? (
                        <Radio size={16} color="iconAccent2" />
                    ) : (
                        <NotSelected size={16} color="iconDefault" />
                    ),
            }}
        />
    )
}

const Label = ({ hdPath }: { hdPath: HDPath }) => {
    switch (hdPath) {
        case 'bip44':
            return (
                <FormattedMessage
                    id="ledger.hd_path.bip44.title"
                    defaultMessage="BIP44 Standard"
                />
            )

        case 'ledger_live':
            return <>Ledger Live</>

        case 'legacy':
            return (
                <FormattedMessage
                    id="ledger.hd_path.legacy.title"
                    defaultMessage="Legacy"
                />
            )

        default:
            return notReachable(hdPath)
    }
}

const Description = ({ hdPath }: { hdPath: HDPath }) => {
    switch (hdPath) {
        case 'bip44':
            return (
                <FormattedMessage
                    id="ledger.hd_path.bip44.subtitle"
                    defaultMessage="e.g. Metamask, Trezor"
                />
            )

        case 'ledger_live':
            return (
                <FormattedMessage
                    id="ledger.hd_path.ledger_live.subtitle"
                    defaultMessage="Default"
                />
            )

        case 'legacy':
            return (
                <FormattedMessage
                    id="ledger.hd_path.legacy.subtitle"
                    defaultMessage="MEW/MyCrypto"
                />
            )

        default:
            return notReachable(hdPath)
    }
}
