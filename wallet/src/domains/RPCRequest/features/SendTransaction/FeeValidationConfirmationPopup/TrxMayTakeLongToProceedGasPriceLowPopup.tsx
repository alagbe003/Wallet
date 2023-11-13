import { FormattedMessage } from 'react-intl'
import { SigningKeyStore } from '@zeal/domains/KeyStore'
import { Simulated } from '@zeal/domains/TransactionRequest'
import { Button } from 'src/uikit'
import { Header } from 'src/uikit/Header'
import { BoldDangerTriangle } from 'src/uikit/Icon/BoldDangerTriangle'
import { Popup } from 'src/uikit/Popup'
import { TrxMayTakeLongToProceedGasPriceLow } from '../FeeForecastWidget/helpers/validation'

type Props = {
    error: TrxMayTakeLongToProceedGasPriceLow<SigningKeyStore>
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'user_confirmed_transaction_for_signing'
          transactionRequest: Simulated
          keyStore: SigningKeyStore
      }

export const TrxMayTakeLongToProceedGasPriceLowPopup = ({
    error,
    onMsg,
}: Props) => {
    const labelId = 'TrxMayTakeLongToProceedGasPriceLowPopupLabel'
    const descrId = 'TrxMayTakeLongToProceedGasPriceLowPopupDesc'

    return (
        <Popup.Layout
            onMsg={onMsg}
            aria-labelledby={labelId}
            aria-describedby={descrId}
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
                        id="TrxMayTakeLongToProceedGasPriceLowPopup.title"
                        defaultMessage="Transaction will get stuck"
                    />
                }
                titleId={labelId}
                subtitle={
                    <FormattedMessage
                        id="TrxMayTakeLongToProceedGasPriceLowPopup.subtitle"
                        defaultMessage="Transaction Max Fee is too low. Increase Max Fee to prevent transaction from getting stuck. "
                    />
                }
                subtitleId={descrId}
            />

            <Popup.Actions>
                <Button
                    size="regular"
                    variant="primary"
                    onClick={() => onMsg({ type: 'close' })}
                >
                    <FormattedMessage
                        id="UserConfirmationPopup.goBack"
                        defaultMessage="Cancel"
                    />
                </Button>

                <Button
                    size="regular"
                    variant="secondary"
                    onClick={() =>
                        onMsg({
                            type: 'user_confirmed_transaction_for_signing',
                            transactionRequest: error.simulated,
                            keyStore: error.keystore,
                        })
                    }
                >
                    <FormattedMessage
                        id="UserConfirmationPopup.submit"
                        defaultMessage="Submit anyway"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}
