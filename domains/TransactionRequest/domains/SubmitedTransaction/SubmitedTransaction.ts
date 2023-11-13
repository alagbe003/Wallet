export type SubmitedTransaction =
    | SubmitedTransactionQueued
    | SubmitedTransactionIncludedInBlock
    | SubmitedTransactionCompleted
    | SubmitedTransactionFailed

export type SubmitedTransactionQueued = {
    hash: string
    state: 'queued'
    queuedAt: number
}

export type SubmitedTransactionIncludedInBlock = {
    hash: string
    state: 'included_in_block'
    queuedAt: number
    gasInfo: GasInfo
}

export type SubmitedTransactionCompleted = {
    hash: string
    state: 'completed'
    queuedAt: number
    completedAt: number
    gasInfo: GasInfo
}

export type SubmitedTransactionFailed = {
    hash: string
    state: 'failed'
    queuedAt: number
    failedAt: number
    gasInfo: GasInfo
}

export type GasInfo =
    | { type: 'generic'; gasUsed: bigint; effectiveGasPrice: bigint }
    | {
          type: 'l2_rollup'
          l1Fee: bigint
          l1FeeScalar: bigint
          l1GasPrice: bigint
          l1GasUsed: bigint
          gasUsed: bigint
          l2GasPrice: bigint
      }
