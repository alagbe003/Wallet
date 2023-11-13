import React from 'react'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { IconButton } from 'src/uikit'
import { BoldSubtract } from 'src/uikit/Icon/BoldSubtract'
import { Token } from '@zeal/domains/Token'
import { Spam } from 'src/uikit/Icon/Spam'

type Props = {
    token: Token
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_token_hide_click'; token: Token }
    | { type: 'on_token_un_hide_click'; token: Token }

export const Layout = ({ token, currencyHiddenMap, onMsg }: Props) => {
    const isHidden =
        currencyHiddenMap[token.balance.currencyId] === undefined
            ? token.scam
            : currencyHiddenMap[token.balance.currencyId]

    return isHidden ? (
        <IconButton
            onClick={() => {
                onMsg({
                    type: 'on_token_un_hide_click',
                    token,
                })
            }}
        >
            <Spam size={20} color="iconStatusCritical" />
        </IconButton>
    ) : (
        <IconButton
            onClick={() => {
                onMsg({
                    type: 'on_token_hide_click',
                    token,
                })
            }}
        >
            <BoldSubtract size={20} />
        </IconButton>
    )
}
