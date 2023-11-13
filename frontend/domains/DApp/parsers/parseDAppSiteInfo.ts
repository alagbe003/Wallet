import {
    nullable,
    object,
    oneOf,
    Result,
    shape,
    string,
} from '@zeal/toolkit/Result'
import { DAppSiteInfo } from '../index'

export const parseDAppSiteInfo = (
    input: unknown
): Result<unknown, DAppSiteInfo> =>
    object(input).andThen((obj) =>
        shape({
            title: oneOf([nullable(obj.title), string(obj.title)]),
            avatar: oneOf([nullable(obj.avatar), string(obj.avatar)]),
            hostname: string(obj.hostname),
        })
    )
