import { format } from '@zeal/domains/Address/helpers/format'
import { NetworkMap } from '@zeal/domains/Network'
import { SmartContract } from '@zeal/domains/SmartContract'
import { getExplorerLink } from 'src/domains/SmartContract/helpers/getExplorerLink'
import { IconButton } from 'src/uikit'
import { Avatar as UIAvatar } from 'src/uikit/Avatar'
import { ExternalLink } from 'src/uikit/Icon/ExternalLink'
import { QuestionCircle } from 'src/uikit/Icon/QuestionCircle'
import { ListItem2 } from 'src/uikit/ListItem2/ListItem2'
import { Row } from '@zeal/uikit/Row'
import { Text2 } from 'src/uikit/Text2'
import {
    SignMessageSafetyCheck,
    TransactionSafetyCheck,
} from '@zeal/domains/SafetyCheck'
import { SmartContractBadge } from 'src/domains/SafetyCheck/components/SmartContractBadge'

type Props = {
    smartContract: SmartContract
    networkMap: NetworkMap
    safetyChecks: Array<TransactionSafetyCheck | SignMessageSafetyCheck> | null
}

export const ListItem = ({
    smartContract,
    networkMap,
    safetyChecks,
}: Props) => {
    const label = smartContract.name || smartContract.website || null

    return (
        <ListItem2
            aria-selected={false}
            size="large"
            avatar={({ size }) =>
                smartContract.logo ? (
                    <UIAvatar
                        src={smartContract.logo}
                        size={size}
                        rightBadge={({ size }) =>
                            safetyChecks ? (
                                <SmartContractBadge
                                    size={size}
                                    safetyChecks={safetyChecks}
                                />
                            ) : null
                        }
                    />
                ) : (
                    <UIAvatar
                        icon={
                            <QuestionCircle color="iconDefault" size={size} />
                        }
                        size={size}
                        rightBadge={({ size }) =>
                            safetyChecks ? (
                                <SmartContractBadge
                                    size={size}
                                    safetyChecks={safetyChecks}
                                />
                            ) : null
                        }
                    />
                )
            }
            primaryText={
                <Row spacing={4}>
                    <Text2
                        ellipsis
                        id={`smart-contract-label-${smartContract.address}`}
                        variant="callout"
                        weight="regular"
                        color="textPrimary"
                    >
                        {label || format(smartContract.address)}
                    </Text2>
                    {!label && (
                        <IconButton
                            onClick={() =>
                                window.open(
                                    getExplorerLink(smartContract, networkMap)
                                )
                            }
                        >
                            <ExternalLink size={14} color="iconDefault" />
                        </IconButton>
                    )}
                </Row>
            }
            shortText={
                label ? (
                    <Row spacing={4}>
                        <Text2
                            id={`smart-contract-desc-${smartContract.address}`}
                            variant="paragraph"
                            weight="regular"
                            color="textSecondary"
                        >
                            {format(smartContract.address)}
                        </Text2>

                        <IconButton
                            onClick={() =>
                                window.open(
                                    getExplorerLink(smartContract, networkMap)
                                )
                            }
                        >
                            <ExternalLink size={14} color="iconDefault" />
                        </IconButton>
                    </Row>
                ) : null
            }
        />
    )
}
