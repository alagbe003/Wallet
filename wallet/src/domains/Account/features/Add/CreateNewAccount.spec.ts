import { renderPage } from 'src/tests/utils/renderers'
import { screen, waitFor } from '@testing-library/react'

import { cleanEnv, mockEnv, TestEnvironment } from 'src/tests/env'
import userEvent from '@testing-library/user-event'
import { runLottieListeners } from 'src/tests/mocks/lottie'
import { testPassword } from 'src/domains/KeyStore/api/fixtures/testPassword'
import crypto from 'crypto'
import { LS_KEY } from '@zeal/domains/Storage/constants'
import { wait } from '@testing-library/user-event/dist/utils'

let env: TestEnvironment

beforeEach(() => {
    env = mockEnv()
})

afterEach(() => {
    cleanEnv(env)
    jest.restoreAllMocks()
})

test(`As a user I should be able to generate new account, so I can user Zeal even if I'm a new user`, async () => {
    jest.spyOn(crypto, 'randomBytes').mockImplementation((size: number) =>
        Uint8Array.from(new Array(size).fill(0).map((_, index) => index))
    )

    env.chromeMocks.storages.local[LS_KEY] = undefined
    env.chromeMocks.storages.session = {}

    renderPage('/page_entrypoint.html?type=onboarding')

    await userEvent.click(
        await screen.findByRole('button', { name: 'Get Started' })
    )

    await userEvent.type(
        await screen.findByPlaceholderText('Create password'),
        testPassword
    )

    await userEvent.click(
        await screen.findByRole('button', { name: 'Continue' })
    )

    expect(
        await screen.findByRole('button', { name: 'Continue' })
    ).toBeDisabled()

    await userEvent.type(
        await screen.findByPlaceholderText('Re-enter password'),
        testPassword
    )

    expect(
        await screen.findByRole('button', { name: 'Continue' })
    ).not.toBeDisabled()

    await userEvent.click(
        await screen.findByRole('button', { name: 'Continue' })
    )
    expect(await screen.findByText('Password created 🔥')).toBeInTheDocument()

    await runLottieListeners()

    await screen.findByText('How experienced are you with web3?')

    await userEvent.click(await screen.findByText('I’ve used web3 before'))
    await userEvent.click(await screen.findByLabelText('Next'))
    await userEvent.click(await screen.findByLabelText('Next'))
    await userEvent.click(await screen.findByLabelText('Next'))
    await userEvent.click(await screen.findByLabelText('Next'))
    await userEvent.click(await screen.findByText('Lets gooo!'))
    await userEvent.click(await screen.findByText('Create new wallet instead'))

    expect(
        await screen.findByText('New account created 🎉')
    ).toBeInTheDocument()

    await wait(100)

    await runLottieListeners()

    await waitFor(() => {
        expect(window.location.replace).toHaveBeenCalledWith(
            'chrome-extension://ext-id/account_is_ready.html'
        )
    })
})
