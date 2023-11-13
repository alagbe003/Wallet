import { GelatoRelayPack } from '@safe-global/relay-kit'

// FIXME @resetko-zeal we can switch here to some polling
export const getRelayedTransactionHash = async (
    taskId: string
): Promise<string> => {
    const relayPack = new GelatoRelayPack()
    const taskInfo = await relayPack.getTaskStatus(taskId)

    if (!taskInfo || !taskInfo.transactionHash) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return getRelayedTransactionHash(taskId)
    }

    return taskInfo.transactionHash
}
