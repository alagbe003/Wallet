import { SumSubAccessToken } from '@zeal/domains/Storage'
import SumSubWebSdk from '@sumsub/websdk-react'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { IconButton } from 'src/uikit'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { Spacer2 } from 'src/uikit/Spacer2'
import { Column2 } from 'src/uikit/Column2'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Account } from '@zeal/domains/Account'
import { Network } from '@zeal/domains/Network'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { ImperativeError } from '@zeal/domains/Error'
import { notReachable } from '@zeal/toolkit'

type Props = {
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    sumSubAccessToken: SumSubAccessToken
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'application_submitted' } | { type: 'close' }

type SumSubEvent =
    | 'idCheck.onReady'
    | 'idCheck.onInitialized'
    | 'idCheck.onStepInitiated'
    | 'idCheck.stepCompleted'
    | 'idCheck.onApplicantLoaded'
    | 'idCheck.onApplicantSubmitted'
    | 'idCheck.applicantStatus'
    | 'idCheck.onApplicantResubmitted'
    | 'idCheck.onActionSubmitted'
    | 'idCheck.actionCompleted'
    | 'idCheck.moduleResultPresented'
    | 'idCheck.onResize'
    | 'idCheck.onVideoIdentCallStarted'
    | 'idCheck.onVideoIdentModeratorJoined'
    | 'idCheck.onVideoIdentCompleted'
    | 'idCheck.onUploadError'
    | 'idCheck.onUploadWarning'

export const SumSubWrapper = ({
    sumSubAccessToken,
    account,
    network,
    keyStoreMap,
    onMsg,
}: Props) => {
    return (
        <Layout2 background="light" padding="form">
            <ActionBar
                account={account}
                keystore={getKeyStore({
                    keyStoreMap,
                    address: account.address,
                })}
                network={network}
                left={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <BackIcon size={24} />
                    </IconButton>
                }
            />

            <Spacer2 />

            <Column2 alignX="center" spacing={0}>
                <SumSubWebSdk
                    accessToken={sumSubAccessToken}
                    onMessage={(msg: SumSubEvent) => {
                        switch (msg) {
                            case 'idCheck.onApplicantSubmitted':
                            case 'idCheck.applicantStatus':
                            case 'idCheck.onApplicantResubmitted':
                                onMsg({ type: 'application_submitted' })
                                break
                            case 'idCheck.onReady':
                            case 'idCheck.onInitialized':
                            case 'idCheck.onStepInitiated':
                            case 'idCheck.stepCompleted':
                            case 'idCheck.onApplicantLoaded':
                            case 'idCheck.onActionSubmitted':
                            case 'idCheck.actionCompleted':
                            case 'idCheck.moduleResultPresented':
                            case 'idCheck.onResize':
                            case 'idCheck.onVideoIdentCallStarted':
                            case 'idCheck.onVideoIdentModeratorJoined':
                            case 'idCheck.onVideoIdentCompleted':
                            case 'idCheck.onUploadError':
                            case 'idCheck.onUploadWarning':
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                    expirationHandler={() => {
                        // TODO: Refresh token if this becomes a problem
                        captureError(
                            new ImperativeError('SumSub access token expired')
                        )
                        return sumSubAccessToken
                    }}
                />
            </Column2>

            <Spacer2 />
        </Layout2>
    )
}
