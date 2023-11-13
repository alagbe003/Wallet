import {
    CurrencyHiddenMap,
    CurrencyPinMap,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { Token } from '@zeal/domains/Token'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { FXRate } from '@zeal/domains/FXRate'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Form as InitialForm, Layout } from './Layout'
import { fetchTokenRate } from '@zeal/domains/FXRate/api/fetchTokenRate'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { notReachable } from '@zeal/toolkit'
import { Modal, State as ModalState } from './Modal'
import { useState } from 'react'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { ImperativeError } from '@zeal/domains/Error'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

type Props = {
    token: Token | null
    portfolioMap: PortfolioMap
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    account: Account
    sessionPassword: string
    customCurrencies: CustomCurrencyMap
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<MsgOf<typeof Layout>, { type: 'on_submit_form' | 'close' }>
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'track_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'on_accounts_create_success_animation_finished'
          }
      >

const fetchFxRate = async ({
    form,
    knownCurrencies,
    networkMap,
}: {
    form: InitialForm
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
}): Promise<FXRate | null> => {
    if (!form.token?.rate) {
        return null
    }

    return fetchTokenRate(form.token, knownCurrencies, networkMap)
}

export const Form = ({
    networkMap,
    networkRPCMap,
    feePresetMap,
    token,
    account,
    accountsMap,
    portfolioMap,
    keyStoreMap,
    customCurrencies,
    sessionPassword,
    currencyHiddenMap,
    currencyPinMap,
    onMsg,
}: Props) => {
    const [modal, setModal] = useState<ModalState>(
        token ? { type: 'closed' } : { type: 'select_token' }
    )

    const portfolio = portfolioMap[account.address]

    const [pollable, setPollable] = usePollableData<
        FXRate | null,
        {
            form: InitialForm
            knownCurrencies: KnownCurrencies
            networkMap: NetworkMap
        }
    >(
        fetchFxRate,
        {
            type: 'loaded' as const,
            params: {
                form: {
                    type: 'amount_in_tokens' as const,
                    amount: null,
                    token,
                    toAddress: null,
                },
                knownCurrencies: portfolio.currencies,
                networkMap,
            },
            data: token?.rate || null,
        },
        { stopIf: () => false, pollIntervalMilliseconds: 2000 }
    )

    switch (pollable.type) {
        case 'loading':
        case 'error':
            throw new ImperativeError(
                'loading or error state should never be possible as we have rate'
            )
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return (
                <>
                    <Layout
                        feePresetMap={feePresetMap}
                        form={pollable.params.form}
                        knownCurrencies={portfolio.currencies}
                        fxRate={pollable.data}
                        accountsMap={accountsMap}
                        keyStoreMap={keyStoreMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        account={account}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                    onMsg(msg)
                                    break
                                case 'on_select_token':
                                    setModal({ type: 'select_token' })
                                    break
                                case 'on_select_to_address':
                                    setModal({ type: 'select_to_address' })
                                    break
                                case 'on_submit_form':
                                    onMsg(msg)
                                    break
                                case 'on_form_change':
                                    setPollable({
                                        type: 'loaded',
                                        data: pollable.data,
                                        params: {
                                            ...pollable.params,
                                            form: msg.form,
                                        },
                                    })
                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(msg)
                            }
                        }}
                    />
                    <Modal
                        currencyHiddenMap={currencyHiddenMap}
                        currencyPinMap={currencyPinMap}
                        portfolioMap={portfolioMap}
                        keyStoreMap={keyStoreMap}
                        customCurrencies={customCurrencies}
                        sessionPassword={sessionPassword}
                        accountsMap={accountsMap}
                        state={modal}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        account={account}
                        selectedToken={pollable.params.form.token}
                        toAddress={pollable.params.form.toAddress}
                        knownCurrencies={portfolio.currencies}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'on_accounts_create_success_animation_finished':
                                case 'track_wallet_clicked':
                                case 'add_wallet_clicked':
                                case 'hardware_wallet_clicked':
                                    setModal({ type: 'closed' })
                                    onMsg(msg)
                                    break

                                case 'close':
                                    setModal({ type: 'closed' })
                                    break
                                case 'on_token_select':
                                    setModal({ type: 'closed' })
                                    setPollable({
                                        type: 'loaded',
                                        data: msg.token.rate,
                                        params: {
                                            ...pollable.params,
                                            form: {
                                                ...pollable.params.form,
                                                token: msg.token,
                                                amount: null,
                                            },
                                        },
                                    })
                                    break

                                case 'on_add_label_skipped':
                                    setModal({ type: 'closed' })
                                    setPollable({
                                        type: 'loaded',
                                        data: pollable.data,
                                        params: {
                                            ...pollable.params,
                                            form: {
                                                ...pollable.params.form,
                                                toAddress: msg.address,
                                            },
                                        },
                                    })
                                    break

                                case 'account_item_clicked':
                                    setModal({ type: 'closed' })
                                    setPollable({
                                        type: 'loaded',
                                        data: pollable.data,
                                        params: {
                                            ...pollable.params,
                                            form: {
                                                ...pollable.params.form,
                                                toAddress: msg.account.address,
                                            },
                                        },
                                    })
                                    break
                                case 'on_account_create_request':
                                    setModal({ type: 'closed' })
                                    setPollable({
                                        type: 'loaded',
                                        data: pollable.data,
                                        params: {
                                            ...pollable.params,
                                            form: {
                                                ...pollable.params.form,
                                                toAddress:
                                                    msg.accountsWithKeystores[0]
                                                        .account.address,
                                            },
                                        },
                                    })
                                    onMsg(msg)
                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(msg)
                            }
                        }}
                    />
                </>
            )
        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}
