import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LS_KEY } from '@zeal/domains/Storage/constants'
import { cleanEnv, mockEnv, TestEnvironment } from 'src/tests/env'
import { renderPage } from 'src/tests/utils/renderers'

let env: TestEnvironment
let originalOpen: Window['open']
let originalClose: Window['close']

beforeEach(() => {
    env = mockEnv()
    originalOpen = window.open
    originalClose = window.close
})

afterEach(() => {
    cleanEnv(env)
    window.open = originalOpen
    window.close = originalClose
})

test('As a user I should be able to open freshly installed extension, so I can start my onboarding process', async () => {
    env.chromeMocks.storages.local[LS_KEY] = JSON.stringify(null)
    window.open = jest.fn()
    window.close = jest.fn()

    await renderPage('/index.html?type=extension')

    await userEvent.click(await screen.findByText('Get Started'))

    expect(window.open).toHaveBeenCalledWith(
        'chrome-extension://ext-id/page_entrypoint.html?type=onboarding',
        '_blank'
    )
})
