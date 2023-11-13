import { FormattedMessage } from 'react-intl'
import { SignMessageSimulationResponse } from 'src/domains/RPCRequest/domains/SignMessageSimulation'
import { ResultIcon } from 'src/domains/SafetyCheck/components/ResultIcon'
import { SignMessageItem } from 'src/domains/SafetyCheck/components/SignMessageItem'
import { calculateSignMessageSafetyChecksResult } from '@zeal/domains/SafetyCheck/helpers/calculateSignMessageSafetyChecksResult'
import { notReachable } from '@zeal/toolkit'
import { Column2 } from 'src/uikit/Column2'
import { Header } from '@zeal/uikit/Header'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    simulationResponse: SignMessageSimulationResponse
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const SafetyCheckPopup = ({ simulationResponse, onMsg }: Props) => {
    const { checks, currencies } = simulationResponse
    const result = calculateSignMessageSafetyChecksResult(checks)

    return (
        <Popup.Layout
            aria-labelledby="SignMessageSafetyChecksConfirmation-label"
            onMsg={onMsg}
        >
            <Header
                icon={({ size }) => (
                    <ResultIcon size={size} safetyCheckResult={result} />
                )}
                titleId="SignMessageSafetyChecksConfirmation-label"
                title={<Title simulationResponse={simulationResponse} />}
            />
            <Popup.Content>
                <Column2 spacing={12}>
                    {checks.map((check) => (
                        <SignMessageItem
                            knownCurrencies={currencies}
                            key={check.type}
                            safetyCheck={check}
                        />
                    ))}
                </Column2>
            </Popup.Content>
        </Popup.Layout>
    )
}

const Title = ({
    simulationResponse,
}: {
    simulationResponse: SignMessageSimulationResponse
}) => {
    switch (simulationResponse.message.type) {
        case 'UnknownSignMessage':
            return null
        case 'PermitSignMessage':
        case 'DaiPermitSignMessage':
        case 'Permit2SignMessage':
            return (
                <FormattedMessage
                    id="SignMessageSafetyChecksPopup.title.permits"
                    defaultMessage="Permit safety checks"
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(simulationResponse.message)
    }
}
