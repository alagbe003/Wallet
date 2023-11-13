import { fromString } from './helpers/fromString'

export const NULL_ADDRESS = fromString(
    '0x0000000000000000000000000000000000000000'
).getSuccessResultOrThrow('Failed to parse NULL address')
