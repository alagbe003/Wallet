import { post } from '@zeal/api/request'
import { UserEvent } from 'src/domains/UserEvents'

export const postUserEvent = async (userEvent: UserEvent): Promise<void> => {
    await post('/wallet/metrics', {
        body: userEvent,
    })
}
