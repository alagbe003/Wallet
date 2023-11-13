import { KnownCurrencies } from '@zeal/domains/Currency'
import { SimulatedSignMessage } from 'src/domains/RPCRequest/domains/SignMessageSimulation'
import { SignMessageSafetyCheck } from '@zeal/domains/SafetyCheck'
import { notReachable } from '@zeal/toolkit'
import { calculateSignMessageSafetyChecksResult } from '@zeal/domains/SafetyCheck/helpers/calculateSignMessageSafetyChecksResult'
import { SignMessageStatusButton } from 'src/domains/SafetyCheck/components/SignMessageStatusButton'
import { Column2 } from 'src/uikit/Column2'
import { Group } from 'src/uikit/Group'
import { Text2 } from 'src/uikit/Text2'
import { FormattedMessage } from 'react-intl'
import { ListItem } from 'src/domains/SmartContract/components/ListItem'
import { NetworkMap } from '@zeal/domains/Network'

type Props = {
    simulatedSignMessage: SimulatedSignMessage
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
    safetyChecks: SignMessageSafetyCheck[]
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_safety_checks_clicked' }

export const Footer = ({
    simulatedSignMessage,
    knownCurrencies,
    safetyChecks,
    networkMap,
    onMsg,
}: Props) => {
    // TODO: Footer should never be visible for UnknownSignMessage. Consider removing the switch and always returning something like "Sign Message Safety Checks"
    switch (simulatedSignMessage.type) {
        case 'UnknownSignMessage':
            return null
        case 'PermitSignMessage':
        case 'DaiPermitSignMessage':
        case 'Permit2SignMessage':
            const safetyChecksResult =
                calculateSignMessageSafetyChecksResult(safetyChecks)
            return (
                <Column2 spacing={0}>
                    <Group
                        variant="default"
                        aria-labelledby="simulation.permit.footer.for"
                    >
                        <Column2 spacing={0}>
                            <Text2
                                id="simulation.permit.footer.for"
                                variant="paragraph"
                                weight="regular"
                                color="textSecondary"
                            >
                                <FormattedMessage
                                    id="simulation.approve.footer.for"
                                    defaultMessage="For"
                                />
                            </Text2>
                            <ListItem
                                smartContract={simulatedSignMessage.approveTo}
                                networkMap={networkMap}
                                safetyChecks={safetyChecks}
                            />
                        </Column2>
                    </Group>

                    <SignMessageStatusButton
                        safetyCheckResult={safetyChecksResult}
                        knownCurrencies={knownCurrencies}
                        onClick={() =>
                            onMsg({ type: 'on_safety_checks_clicked' })
                        }
                    />
                </Column2>
            )

        /* istanbul ignore next */
        default:
            return notReachable(simulatedSignMessage)
    }
}
