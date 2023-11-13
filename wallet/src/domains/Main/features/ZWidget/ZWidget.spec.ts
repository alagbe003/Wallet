import { renderZWidget } from 'src/tests/utils/renderers'
import { screen } from '@testing-library/react'

import { cleanEnv, mockEnv, TestEnvironment } from 'src/tests/env'
import userEvent from '@testing-library/user-event'
import { runLottieListeners } from 'src/tests/mocks/lottie'

let env: TestEnvironment

beforeEach(() => {
    env = mockEnv()
})

afterEach(() => {
    cleanEnv(env)
})

test('As a user I should see if dApp is trying to connect with my wallet, so I can decide if I want to connect', async () => {
    const dAppHost = 'dapp.example.com'

    const { postMessage, toWidget } = await renderZWidget({ dAppHost })

    await toWidget({
        type: 'rpc_request',
        request: {
            id: 0,
            method: 'eth_requestAccounts',
            params: [],
        },
    })

    await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }))

    expect(postMessage).toReceiveMsg({
        id: 0,
        response: {
            reason: { code: 4001, message: 'User Rejected Request' },
            type: 'failure',
        },
    })

    postMessage.mockReset()
    await toWidget({
        type: 'rpc_request',
        request: {
            id: 1,
            method: 'eth_requestAccounts',
            params: [],
        },
    })

    await userEvent.click(
        await screen.findByRole('button', { name: 'Connect' })
    )
    await runLottieListeners()

    expect(postMessage).not.toHaveBeenCalledWith({
        chainId: '0x89',
        type: 'network_change',
    })

    expect(postMessage).not.toHaveBeenCalledWith({
        account: '0x83f1caAdaBeEC2945b73087F803d404F054Cc2B7',
        type: 'account_change',
    })

    expect(postMessage).not.toHaveBeenCalledWith({
        chainId: '0x89',
        account: '0x83f1caAdaBeEC2945b73087F803d404F054Cc2B7',
        type: 'init_provider',
    })
    expect(postMessage).toReceiveMsg({
        id: 1,
        response: {
            data: ['0x83f1caAdaBeEC2945b73087F803d404F054Cc2B7'],
            type: 'success',
        },
        type: 'rpc_response',
    })
})
test('As a user I should see ZWidget onboarding screen after dApp trying to interact with wallet, so I can see knows how to connect', async () => {
    const dAppHost = 'dapp.example.com'

    const { toWidget } = await renderZWidget({ dAppHost })

    await toWidget({
        type: 'rpc_request',
        request: { id: 0, method: 'eth_chainId', params: [] },
    })

    expect(
        await screen.findByText(`How to connect with Zeal?`)
    ).toBeInTheDocument()
})
