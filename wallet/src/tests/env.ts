import { firstSignUp } from 'src/domains/Storage/api/fixtures/localStorage'
import { sessionPassword } from 'src/domains/Storage/api/fixtures/sessionStorage'

import {
    getMocks as getChromeMocks,
    clearMocks as clearChromeMocks,
    ChromeMocks,
} from './mocks/chrome'
import { getMocks as getApiMocks, ApiMock } from './mocks/api'
import { clearLocationMock, getLocationMock } from './mocks/location'
import { v4 as uuid } from 'uuid'
import { LS_KEY } from '@zeal/domains/Storage/constants'

export type TestEnvironment = {
    chromeMocks: ChromeMocks
    api: ApiMock
}

jest.setTimeout(1000 * 60 * 5)

export const cleanEnv = (env: TestEnvironment) => {
    clearChromeMocks()
    clearLocationMock()
}

export const mockEnv = (): TestEnvironment => {
    const env: TestEnvironment = {
        chromeMocks: getChromeMocks(),
        api: getApiMocks(),
    }

    getLocationMock()

    env.chromeMocks.storages.local[LS_KEY] = JSON.stringify(firstSignUp)
    env.chromeMocks.storages.session['password'] = sessionPassword
    env.chromeMocks.storages.local['installationId'] = uuid()

    return env
}
