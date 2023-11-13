import { FormattedMessage } from 'react-intl'
import { useState } from 'react'
import { SigningKeyStore } from '@zeal/domains/KeyStore'
import { Simulated } from '@zeal/domains/TransactionRequest'
import { Button } from 'src/uikit'
import { Header } from 'src/uikit/Header'
import { BoldDangerTriangle } from 'src/uikit/Icon/BoldDangerTriangle'
import { Popup } from 'src/uikit/Popup'
import { SimulationFailedSafetyChecks } from '../../helpers/validation'

type Props = {
    reason: SimulationFailedSafetyChecks<SigningKeyStore>
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | {
          type: 'user_confirmed_transaction_for_signing'
          transactionRequest: Simulated
          keyStore: SigningKeyStore
      }

export const SimulationFailedConfirmation = ({ reason, onMsg }: Props) => {
    const [labelId] = useState(crypto.randomUUID())
    const [descriptionId] = useState(crypto.randomUUID())
    return (
        <Popup.Layout
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
            onMsg={onMsg}
        >
            <Header
                icon={({ size }) => (
                    <BoldDangerTriangle
                        size={size}
                        color="iconStatusCritical"
                    />
                )}
                title={
                    <FormattedMessage
                        id="SimulationFailedConfirmation.title"
                        defaultMessage="Transaction likely to fail"
                    />
                }
                titleId={labelId}
                subtitle={
                    <FormattedMessage
                        id="SimulationFailedConfirmation.subtitle"
                        defaultMessage="We simulated this transaction and found an issue that would cause it to fail. You can submit this transaction, but it will likely fail and you may lose your network fee."
                    />
                }
                subtitleId={descriptionId}
            />
            <Popup.Actions>
                <Button
                    size="regular"
                    variant="primary"
                    onClick={() => onMsg({ type: 'close' })}
                >
                    <FormattedMessage
                        id="action.cancel"
                        defaultMessage="Cancel"
                    />
                </Button>
                <Button
                    size="regular"
                    variant="secondary"
                    onClick={() =>
                        onMsg({
                            type: 'user_confirmed_transaction_for_signing',
                            keyStore: reason.keystore,
                            transactionRequest: reason.simulated,
                        })
                    }
                >
                    <FormattedMessage
                        id="action.submit"
                        defaultMessage="Submit"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}
