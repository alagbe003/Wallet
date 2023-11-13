import { useState } from 'react'
import { notReachable } from '@zeal/toolkit'
import { Progress2 } from 'src/uikit/Progress/Progress2'
import { Column2 } from 'src/uikit/Column2'
import { ShieldEmpty } from 'src/uikit/Icon/ShieldEmpty'
import { Text2 } from 'src/uikit/Text2'
import { ArrowDown } from 'src/uikit/Icon/Navigation/ArrowDown'

type Layout = 'none' | 'sign' | 'queue' | 'in_block' | 'completed'

export const AnimationDuringRemount = () => {
    const [state, setState] = useState<Layout>('none')

    switch (state) {
        case 'none':
            return (
                <Column2 spacing={4}>
                    <button onClick={() => setState('sign')}>
                        current=[{state}] click to change
                    </button>
                    <Progress2
                        variant="neutral"
                        progress={0.75}
                        initialProgress={0}
                        title="funasdfasdfasdfasdfasdf"
                    />
                    <Progress2
                        variant="warning"
                        progress={0.25}
                        initialProgress={0}
                        title="funasdfasd"
                    />
                    <Progress2
                        variant="success"
                        progress={0.5}
                        initialProgress={0}
                        title="fun"
                        right={
                            <>
                                <ShieldEmpty size={20} />
                                <Text2>adfasdfa</Text2>
                                <ArrowDown size={20} />
                            </>
                        }
                        onClick={() => {}}
                    />
                    <Progress2
                        variant="critical"
                        progress={0.5}
                        initialProgress={0}
                        title="fun"
                        onClick={() => {}}
                    />
                </Column2>
            )

        case 'sign':
            return (
                <Progress2
                    title={
                        <button onClick={() => setState('queue')}>
                            current=[{state}] click to change
                        </button>
                    }
                    progress={0.1}
                    initialProgress={0}
                    variant="neutral"
                ></Progress2>
            )

        case 'queue':
            return (
                <div>
                    <Progress2
                        title={
                            <button onClick={() => setState('in_block')}>
                                current=[{state}] click to change
                            </button>
                        }
                        initialProgress={0.1}
                        progress={0.4}
                        variant="neutral"
                    ></Progress2>
                </div>
            )

        case 'in_block':
            return (
                <div>
                    <Progress2
                        title={
                            <button onClick={() => setState('completed')}>
                                current=[{state}] click to change
                            </button>
                        }
                        progress={0.8}
                        initialProgress={null}
                        variant="neutral"
                    />
                </div>
            )

        case 'completed':
            return (
                <div>
                    <Progress2
                        title={
                            <button onClick={() => setState('none')}>
                                current=[{state}] click to change
                            </button>
                        }
                        initialProgress={null}
                        progress={1}
                        variant="success"
                    />
                </div>
            )

        default:
            return notReachable(state)
    }
}
