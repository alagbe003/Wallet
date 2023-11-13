import { FormattedMessage } from 'react-intl'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { ResultIcon } from 'src/domains/SafetyCheck/components/ResultIcon'
import { TransactionItem } from 'src/domains/SafetyCheck/components/TransactionItem'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { Column2 } from 'src/uikit/Column2'
import { Header } from 'src/uikit/Header'
import { Popup } from 'src/uikit/Popup'
import { validateSafetyCheckFailedWithFailedChecksOnly } from '../helpers/validation'

type Props = {
    knownCurrencies: KnownCurrencies

    simulateTransactionResponse: SimulateTransactionResponse

    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const SafetyChecks = ({
    onMsg,
    knownCurrencies,
    simulateTransactionResponse,
}: Props) => {
    const result = validateSafetyCheckFailedWithFailedChecksOnly({
        simulationResult: {
            type: 'simulated',
            simulation: simulateTransactionResponse,
        },
    })
    const safetyChecks = simulateTransactionResponse.checks

    return (
        <Popup.Layout
            aria-labelledby="SafetyChecksConfirmation-label"
            onMsg={onMsg}
        >
            <Header
                icon={({ size }) => (
                    <ResultIcon size={size} safetyCheckResult={result} />
                )}
                titleId="SafetyChecksConfirmation-label"
                title={
                    <FormattedMessage
                        id="transactionSafetyChecksPopup.title"
                        defaultMessage="Transaction Safety Checks"
                    />
                }
            />
            <Popup.Content>
                <Column2 spacing={12}>
                    {safetyChecks.map((check) => (
                        <TransactionItem
                            knownCurrencies={knownCurrencies}
                            key={check.type}
                            safetyCheck={check}
                        />
                    ))}
                </Column2>
            </Popup.Content>
        </Popup.Layout>
    )
}
