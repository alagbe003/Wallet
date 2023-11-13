import '@testing-library/jest-dom'
import 'jest-canvas-mock'
import 'jest-styled-components'

import './lottie'
import './chrome'
import './crypto'

jest.mock('@ledgerhq/hw-transport-webhid', () => ({}))

jest.mock('@sentry/react', () => {
    const { error } = console
    return {
        captureException: jest.fn(error),
        captureMessage: jest.fn(error),
    }
})

// TODO Remove this mock, Web3 signing should work same as in browser
jest.mock('@zeal/domains/RPCRequest/helpers/signEthSendTransaction.ts', () => ({
    signEthSendTransaction: () => ({
        id: 123,
        jsonrpc: '2.0',
        method: 'eth_sendRawTransaction',
        params: ['0x0'],
    }),
}))
