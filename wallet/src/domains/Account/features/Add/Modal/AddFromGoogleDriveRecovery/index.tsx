import { useState } from 'react'
import { notReachable } from '@zeal/toolkit'
import { FileLoader } from './FileLoader'
import { DecryptBackup } from './DecryptBackup'
import { AccountsMap } from '@zeal/domains/Account'
import { MsgOf } from '@zeal/toolkit/MsgOf'

type Props = {
    accounts: AccountsMap
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' } | MsgOf<typeof DecryptBackup>

type State =
    | { type: 'loading_file_content' }
    | {
          type: 'decrypt_file'
          file: {
              id: string
              name: string
              modifiedTime: number
              encryptedContent: string
          }
      }

export const AddFromGoogleDriveRecovery = ({
    accounts,
    sessionPassword,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'loading_file_content' })
    switch (state.type) {
        case 'loading_file_content':
            return (
                <FileLoader
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'recovery_file_found':
                                setState({
                                    type: 'decrypt_file',
                                    file: msg.file,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'decrypt_file':
            return (
                <DecryptBackup
                    file={state.file}
                    accounts={accounts}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
