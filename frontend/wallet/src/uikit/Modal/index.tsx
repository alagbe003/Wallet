import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Base } from 'src/uikit/Base'
import { createPortal } from 'react-dom'

type Props = {
    children: React.ReactNode
}

const MODAL_ID = 'modal'

const Overlay = styled(Base).attrs(() => ({
    className: 'layout',
}))`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 100;
`

export const Modal = ({ children }: Props) => {
    useScrollLock()
    return createPortal(
        <Overlay>{children}</Overlay>,
        document.getElementById(MODAL_ID)!
    )
}

const SCROLL_LOCK_KEY = 'scroll_lock'

export function useScrollLock(condition: boolean = true) {
    const doc = window.document

    useEffect(() => {
        if (condition && doc !== null) {
            const element = doc.body
            const initial = Number(element.dataset[SCROLL_LOCK_KEY] || 0)

            element.dataset[SCROLL_LOCK_KEY] = `${initial + 1}`
            if (initial === 0) element.style.overflow = 'hidden'

            return () => {
                const current =
                    Number(element.dataset[SCROLL_LOCK_KEY] || 0) - 1

                element.dataset[SCROLL_LOCK_KEY] = `${current}`
                if (current <= 0) element.style.overflow = ''
            }
        }
    }, [doc, condition])
}
